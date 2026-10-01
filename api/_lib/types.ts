/**
 * Frozen API contract — shared by backend (/api) and frontend.
 * Do not rename fields without updating both sides.
 */

export type IncidentType = "FLOOD" | "FIRE" | "EARTHQUAKE" | "ACCIDENT";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";
export type Priority = "P3" | "P2" | "P1" | "P0"; // P0 = respond immediately

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  type: IncidentType;
  severity: Severity;
  locationName: string;
  coords: Coordinates;
  affectedPeople: number;
  status: "ACTIVE" | "MONITORING" | "RESOLVED";
  reportedAt: string; // ISO
}

export type TeamStatus = "AVAILABLE" | "DISPATCHED" | "BUSY" | "UNAVAILABLE";

export interface RescueTeam {
  id: string;
  name: string;
  status: TeamStatus;
  distanceKm: number; // distance to primary incident
  members: number;
  lat?: number;
  lng?: number;
}

export type FacilityStatus = "AVAILABLE" | "LIMITED" | "FULL";

export interface Hospital {
  id: string;
  name: string;
  capacityUsedPct: number; // 0-100
  status: FacilityStatus;
  distanceKm: number;
  lat?: number;
  lng?: number;
}

export interface Shelter {
  id: string;
  name: string;
  occupancyPct: number; // 0-100
  capacity: number; // total beds
}

export type RoadStatus = "OPEN" | "PARTIAL" | "BLOCKED";

export interface Road {
  id: string;
  name: string;
  status: RoadStatus;
  connectsTo: string; // human-readable, e.g. "Zone A -> Shelter S2"
  coords?: Coordinates[];
}

/** The full live picture. Frontend holds this; backend is stateless. */
export interface EmergencyState {
  incidents: Incident[];
  teams: RescueTeam[];
  hospitals: Hospital[];
  shelters: Shelter[];
  roads: Road[];
  updatedAt: string;
}

export type PlanStatus = "PROPOSED" | "APPROVED" | "REJECTED" | "ACTIVE" | "SUPERSEDED";

export interface ResponsePlan {
  id: string;
  createdAt: string;
  incidentId: string;
  riskLevel: RiskLevel;
  priority: Priority;
  teamId: string;
  routeId: string;
  hospitalId: string;
  shelterId: string;
  actions: string[]; // ordered, human-readable steps
  reason: string; // one or two sentences a coordinator can read aloud
  etaMinutes: number;
  status: PlanStatus;
}

export type AgentName = "SYSTEM" | "RISK" | "RESOURCE" | "PLANNING";

export interface ActivityLogEntry {
  t: string; // HH:MM:SS
  agent: AgentName;
  message: string;
}

/* ---------- Agent structured outputs (what Gemini must return) ---------- */

export interface RiskOutput {
  riskLevel: RiskLevel;
  priority: Priority;
  affectedEstimate: number;
  keyHazards: string[];
  reasoning: string;
}

export interface ResourceOutput {
  teamId: string;
  hospitalId: string;
  shelterId: string;
  routeId: string;
  reasoning: string;
  rejected: string[]; // e.g. "Hospital B rejected: 95% capacity"
}

export interface PlanOutput {
  actions: string[];
  reason: string;
  etaMinutes: number;
  monitoringNotes: string[];
}

/* ---------- API shapes ---------- */

export type SimEvent =
  | "BLOCK_ROAD"
  | "HOSPITAL_OVERLOAD"
  | "TEAM_UNAVAILABLE"
  | "NEW_EMERGENCY"
  | "RESET";

export interface SimulationRequest {
  event: SimEvent;
  state: EmergencyState; // current state, held by frontend
  roadId?: string;
  hospitalId?: string;
  teamId?: string;
}

export interface SimulationResponse {
  state: EmergencyState; // state after event applied
  plan: ResponsePlan;
  activityLog: ActivityLogEntry[];
  degraded: boolean; // true if any agent fell back to deterministic logic
}
