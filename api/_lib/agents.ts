import { generateJson, geminiAvailable, SchemaType } from "./gemini.js";
import type {
  EmergencyState,
  RiskOutput,
  ResourceOutput,
  PlanOutput,
  ResponsePlan,
  ActivityLogEntry,
  RiskLevel,
  Priority,
} from "./types.js";

/* ================= Risk Assessment Agent ================= */

const RISK_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    riskLevel: { type: SchemaType.STRING, enum: ["LOW", "MODERATE", "HIGH", "CRITICAL"] },
    priority: { type: SchemaType.STRING, enum: ["P3", "P2", "P1", "P0"] },
    affectedEstimate: { type: SchemaType.NUMBER },
    keyHazards: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    reasoning: { type: SchemaType.STRING },
  },
  required: ["riskLevel", "priority", "affectedEstimate", "keyHazards", "reasoning"],
};

const RISK_SYSTEM = `You are the Risk Assessment Agent in an emergency response coordination system.
Given the current emergency state as JSON, assess the situation decisively.

Consider: incident type and severity, affected population, blocked or partial roads
(which reduce evacuation options), hospital capacity strain, unavailable rescue teams,
and cascading effects (e.g. a blocked route + a full hospital compounds risk).

Rules:
- Be decisive. No hedging, no "as an AI" phrasing.
- affectedEstimate: your best numeric estimate of people needing assistance.
- keyHazards: short phrases, max 4.
- reasoning: 2-3 sentences a coordinator can read aloud.
- Output STRICT JSON matching the schema. Nothing else.`;

function riskFallback(state: EmergencyState): RiskOutput {
  const inc = state.incidents.find((i) => i.status === "ACTIVE") ?? state.incidents[0];
  const blockedRoads = state.roads.filter((r) => r.status === "BLOCKED").length;
  const strainedHospitals = state.hospitals.filter((h) => h.capacityUsedPct >= 80).length;

  let riskLevel: RiskLevel = "MODERATE";
  let priority: Priority = "P2";
  if (inc.severity === "CRITICAL") { riskLevel = "CRITICAL"; priority = "P0"; }
  else if (inc.severity === "HIGH") { riskLevel = "HIGH"; priority = "P1"; }
  else if (inc.severity === "MEDIUM") { riskLevel = "MODERATE"; priority = "P2"; }
  else { riskLevel = "LOW"; priority = "P3"; }
  if (blockedRoads > 0 && riskLevel !== "CRITICAL") {
    riskLevel = riskLevel === "LOW" ? "MODERATE" : "HIGH";
  }

  const hazards: string[] = [];
  if (blockedRoads > 0) hazards.push(`${blockedRoads} road(s) blocked — evacuation routes reduced`);
  if (strainedHospitals > 0) hazards.push(`${strainedHospitals} hospital(s) near capacity`);
  if (inc.affectedPeople > 200) hazards.push(`Large affected population (~${inc.affectedPeople})`);

  return {
    riskLevel,
    priority,
    affectedEstimate: inc.affectedPeople,
    keyHazards: hazards,
    reasoning: `${inc.type} of ${inc.severity} severity in ${inc.locationName}. ` +
      (blockedRoads > 0 ? "Blocked roads constrain evacuation. " : "") +
      (strainedHospitals > 0 ? "Hospital capacity is strained. " : "") +
      `Priority ${priority}.`,
  };
}

export async function riskAgent(state: EmergencyState): Promise<{ out: RiskOutput; degraded: boolean }> {
  if (!geminiAvailable()) return { out: riskFallback(state), degraded: true };
  try {
    const out = await generateJson<RiskOutput>(
      RISK_SYSTEM,
      `Current emergency state:\n${JSON.stringify(state, null, 1)}`,
      RISK_SCHEMA
    );
    return { out, degraded: false };
  } catch {
    return { out: riskFallback(state), degraded: true };
  }
}

/* ================= Resource & Routing Agent ================= */

const RESOURCE_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    teamId: { type: SchemaType.STRING },
    hospitalId: { type: SchemaType.STRING },
    shelterId: { type: SchemaType.STRING },
    routeId: { type: SchemaType.STRING },
    reasoning: { type: SchemaType.STRING },
    rejected: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["teamId", "hospitalId", "shelterId", "routeId", "reasoning", "rejected"],
};

const RESOURCE_SYSTEM = `You are the Resource & Routing Agent in an emergency response coordination system.
Given the emergency state and the risk assessment as JSON, select the best
team, hospital, shelter, and route.

Hard rules (never violate):
- Team must have status AVAILABLE. Prefer the nearest available team.
- Hospital must NOT be FULL. Prefer lower capacityUsedPct; avoid LIMITED unless nothing else exists.
- Route must have status OPEN. Never select a BLOCKED road.
- Shelter: prefer lower occupancyPct with spare capacity.

Also output "rejected": one short line per rejected candidate explaining why
(e.g. "Hospital B rejected: 95% capacity", "Route A rejected: blocked").
reasoning: 2 sentences max.
Output STRICT JSON matching the schema. Nothing else.`;

function resourceFallback(state: EmergencyState): ResourceOutput {
  const rejected: string[] = [];
  const team =
    state.teams.filter((t) => t.status === "AVAILABLE").sort((a, b) => a.distanceKm - b.distanceKm)[0]
    ?? state.teams[0];
  state.teams.forEach((t) => {
    if (t.id !== team.id) rejected.push(`${t.name} rejected: ${t.status.toLowerCase()}${t.status === "AVAILABLE" ? `, farther (${t.distanceKm} km)` : ""}`);
  });

  const viableHosp = state.hospitals.filter((h) => h.status !== "FULL").sort((a, b) => a.capacityUsedPct - b.capacityUsedPct);
  const hospital = viableHosp[0] ?? state.hospitals[0];
  state.hospitals.forEach((h) => {
    if (h.id !== hospital.id) rejected.push(`${h.name} rejected: ${h.capacityUsedPct}% capacity${h.status === "FULL" ? ", full" : ""}`);
  });

  const shelter =
    [...state.shelters].sort((a, b) => a.occupancyPct - b.occupancyPct)[0] ?? state.shelters[0];

  const openRoads = state.roads.filter((r) => r.status === "OPEN");
  const route = openRoads[0] ?? state.roads.find((r) => r.status === "PARTIAL") ?? state.roads[0];
  state.roads.forEach((r) => {
    if (r.id !== route.id) rejected.push(`${r.name} rejected: ${r.status.toLowerCase()}`);
  });

  return {
    teamId: team.id,
    hospitalId: hospital.id,
    shelterId: shelter.id,
    routeId: route.id,
    reasoning: `${team.name} is nearest available (${team.distanceKm} km). ${hospital.name} has capacity (${hospital.capacityUsedPct}% used). ${route.name} is ${route.status.toLowerCase()}.`,
    rejected,
  };
}

export async function resourceAgent(
  state: EmergencyState,
  risk: RiskOutput
): Promise<{ out: ResourceOutput; degraded: boolean }> {
  if (!geminiAvailable()) return { out: resourceFallback(state), degraded: true };
  try {
    const out = await generateJson<ResourceOutput>(
      RESOURCE_SYSTEM,
      `Emergency state:\n${JSON.stringify(state, null, 1)}\n\nRisk assessment:\n${JSON.stringify(risk, null, 1)}`,
      RESOURCE_SCHEMA
    );
    return { out, degraded: false };
  } catch {
    return { out: resourceFallback(state), degraded: true };
  }
}

/* ================= Response Planning Agent ================= */

const PLAN_SCHEMA = {
  type: SchemaType.OBJECT,
  properties: {
    actions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    reason: { type: SchemaType.STRING },
    etaMinutes: { type: SchemaType.NUMBER },
    monitoringNotes: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
  },
  required: ["actions", "reason", "etaMinutes", "monitoringNotes"],
};

const PLAN_SYSTEM = `You are the Response Planning Agent in an emergency response coordination system.
Given the emergency state, the risk assessment, and the selected resources as JSON,
produce an ordered response plan.

Rules:
- 5-7 concrete actions, ordered by execution. Name the actual team, route, hospital, shelter IDs.
- reason: 1-2 sentences the coordinator can read aloud to justify the plan.
- If a previous plan is provided and still valid, say why it is unchanged.
  If conditions changed, explicitly state WHAT changed and HOW the plan adapted.
- monitoringNotes: what to watch that could invalidate this plan (max 3).
- Output STRICT JSON matching the schema. Nothing else.`;

function planningFallback(
  state: EmergencyState,
  risk: RiskOutput,
  res: ResourceOutput,
  previousPlan: ResponsePlan | null
): PlanOutput {
  const inc = state.incidents.find((i) => i.status === "ACTIVE") ?? state.incidents[0];
  const team = state.teams.find((t) => t.id === res.teamId);
  const route = state.roads.find((r) => r.id === res.routeId);
  const hospital = state.hospitals.find((h) => h.id === res.hospitalId);
  const shelter = state.shelters.find((s) => s.id === res.shelterId);

  const changed = previousPlan &&
    (previousPlan.teamId !== res.teamId ||
      previousPlan.routeId !== res.routeId ||
      previousPlan.hospitalId !== res.hospitalId);

  return {
    actions: [
      `Dispatch ${team?.name ?? res.teamId} to ${inc.locationName}`,
      `Route movement via ${route?.name ?? res.routeId} (${route?.connectsTo ?? ""})`,
      `Begin evacuation of affected zone toward ${shelter?.name ?? res.shelterId}`,
      `Direct medical cases to ${hospital?.name ?? res.hospitalId}`,
      `Monitor ${hospital?.name ?? res.hospitalId} capacity and ${route?.name ?? res.routeId} status`,
      `Reassess in 2 minutes or on any state change`,
    ],
    reason: changed
      ? `Conditions changed since the previous plan: reassigned to ${team?.name}, ${route?.name}, ${hospital?.name}. Risk is ${risk.riskLevel}, priority ${risk.priority}.`
      : `${inc.type} in ${inc.locationName}: ${team?.name} via ${route?.name}, medical to ${hospital?.name}. Risk ${risk.riskLevel}, priority ${risk.priority}.`,
    etaMinutes: Math.round((team?.distanceKm ?? 4) * 6),
    monitoringNotes: [
      `${route?.name} status changes invalidate routing`,
      `${hospital?.name} exceeding 90% capacity requires reallocation`,
      "New incidents require full reassessment",
    ],
  };
}

export async function planningAgent(
  state: EmergencyState,
  risk: RiskOutput,
  res: ResourceOutput,
  previousPlan: ResponsePlan | null
): Promise<{ out: PlanOutput; degraded: boolean }> {
  if (!geminiAvailable()) return { out: planningFallback(state, risk, res, previousPlan), degraded: true };
  try {
    const out = await generateJson<PlanOutput>(
      PLAN_SYSTEM,
      `Emergency state:\n${JSON.stringify(state, null, 1)}\n\n` +
      `Risk assessment:\n${JSON.stringify(risk, null, 1)}\n\n` +
      `Selected resources:\n${JSON.stringify(res, null, 1)}\n\n` +
      `Previous plan (null if none):\n${JSON.stringify(previousPlan, null, 1)}`,
      PLAN_SCHEMA
    );
    return { out, degraded: false };
  } catch {
    return { out: planningFallback(state, risk, res, previousPlan), degraded: true };
  }
}

/* ================= Orchestrator ================= */

function now(): string {
  return new Date().toTimeString().slice(0, 8);
}

let planCounter = 0;

export interface CycleResult {
  plan: ResponsePlan;
  activityLog: ActivityLogEntry[];
  degraded: boolean;
}

/**
 * One full agentic cycle: risk + resource in PARALLEL (independent),
 * then planning (depends on both). Total must stay under ~8s for Vercel.
 */
export async function runEmergencyCycle(
  state: EmergencyState,
  previousPlan: ResponsePlan | null,
  triggerLabel: string
): Promise<CycleResult> {
  const activityLog: ActivityLogEntry[] = [];
  const log = (agent: ActivityLogEntry["agent"], message: string) =>
    activityLog.push({ t: now(), agent, message });

  log("SYSTEM", triggerLabel);

  log("RISK", "Assessing severity, population impact and hazards...");
  log("RESOURCE", "Evaluating teams, hospitals, shelters and routes...");
  // Risk and Resource are independent: run in parallel. Resource gets a
  // deterministic risk hint (computed from the same state, instant, no API
  // call) so it doesn't wait on the Risk agent's LLM round-trip.
  const [riskRes, resRes] = await Promise.all([
    riskAgent(state),
    resourceAgent(state, riskFallback(state)),
  ]);
  const risk = riskRes.out;
  const resource = resRes.out;
  log("RISK", `Severity assessed → ${risk.riskLevel} (priority ${risk.priority})`);
  log("RESOURCE", `Selected ${resource.teamId} / ${resource.routeId} / ${resource.hospitalId}`);

  log("PLANNING", "Generating response plan...");
  const planRes = await planningAgent(state, risk, resource, previousPlan);
  const planOut = planRes.out;

  planCounter += 1;
  const inc = state.incidents.find((i) => i.status === "ACTIVE") ?? state.incidents[0];
  const plan: ResponsePlan = {
    id: `plan-${String(planCounter).padStart(2, "0")}`,
    createdAt: new Date().toISOString(),
    incidentId: inc.id,
    riskLevel: risk.riskLevel,
    priority: risk.priority,
    teamId: resource.teamId,
    routeId: resource.routeId,
    hospitalId: resource.hospitalId,
    shelterId: resource.shelterId,
    actions: planOut.actions,
    reason: planOut.reason,
    etaMinutes: planOut.etaMinutes,
    status: "PROPOSED",
  };

  if (previousPlan) previousPlan.status = "SUPERSEDED";
  log("PLANNING", `Response plan ${plan.id} generated (${plan.actions.length} actions)`);
  log("SYSTEM", "Plan ready — awaiting coordinator approval.");

  const degraded = riskRes.degraded || resRes.degraded || planRes.degraded;
  if (degraded) log("SYSTEM", "Note: one or more agents used deterministic fallback.");

  return { plan, activityLog, degraded };
}
