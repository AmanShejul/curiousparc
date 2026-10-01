import type { VercelRequest, VercelResponse } from "@vercel/node";
import { runEmergencyCycle } from "./_lib/agents.js";
import { seedState } from "./_lib/mockData.js";
import type {
  EmergencyState,
  ResponsePlan,
  SimEvent,
  SimulationRequest,
  SimulationResponse,
} from "./_lib/types.js";

/**
 * Deterministic event application — pure state transition, no AI.
 * The agents then replan FROM the mutated state. This is what makes
 * the replanning genuine rather than staged.
 */
function applyEvent(
  state: EmergencyState,
  event: SimEvent,
  req: SimulationRequest
): { state: EmergencyState; label: string } {
  // deep clone: never mutate the caller's object
  const s: EmergencyState = JSON.parse(JSON.stringify(state));
  s.updatedAt = new Date().toISOString();

  switch (event) {
    case "BLOCK_ROAD": {
      const road = s.roads.find((r) => r.id === req.roadId) ?? s.roads[0];
      road.status = "BLOCKED";
      return { state: s, label: `${road.name} marked BLOCKED` };
    }
    case "HOSPITAL_OVERLOAD": {
      const hosp = s.hospitals.find((h) => h.id === req.hospitalId) ?? s.hospitals[0];
      hosp.capacityUsedPct = 95;
      hosp.status = "LIMITED";
      return { state: s, label: `${hosp.name} capacity now 95% (LIMITED)` };
    }
    case "TEAM_UNAVAILABLE": {
      const team = s.teams.find((t) => t.id === req.teamId) ?? s.teams[0];
      team.status = "UNAVAILABLE";
      return { state: s, label: `${team.name} now UNAVAILABLE` };
    }
    case "NEW_EMERGENCY": {
      s.incidents.push({
        id: `inc-${Date.now()}`,
        type: "FIRE",
        severity: "MEDIUM",
        locationName: "Zone B, Pune",
        coords: { lat: 18.65, lng: 73.78 },
        affectedPeople: 60,
        status: "ACTIVE",
        reportedAt: new Date().toISOString(),
      });
      return { state: s, label: `New FIRE emergency reported in Zone B` };
    }
    case "RESET":
      return { state: seedState(), label: "Scenario reset to initial flood state" };
  }
}

/**
 * POST /api/simulation
 * Body: { event, state, roadId?, hospitalId?, teamId?, previousPlan? }
 * Applies the event deterministically, runs the full agent cycle,
 * returns the new state + plan + activity timeline.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const body = req.body as Partial<SimulationRequest>;
  if (!body.event || !body.state) {
    res.status(400).json({ error: "Body must include { event, state }" });
    return;
  }

  const previousPlan = (body as { previousPlan?: ResponsePlan | null }).previousPlan ?? null;

  const { state: newState, label } = applyEvent(
    body.state,
    body.event,
    body as SimulationRequest
  );

  try {
    const { plan, activityLog, degraded } = await runEmergencyCycle(
      newState,
      previousPlan,
      `Simulation: ${label}`
    );

    const response: SimulationResponse = {
      state: newState,
      plan,
      activityLog,
      degraded,
    };
    res.status(200).json(response);
  } catch (err) {
    console.error("Agent cycle failed:", err);
    res.status(500).json({ error: "Agent cycle failed", detail: String(err) });
  }
}
