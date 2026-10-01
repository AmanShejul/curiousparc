import type { EmergencyState } from "./types.js";

/**
 * Controlled simulation data — realistic, but NOT real.
 * The agent logic is real; only the inputs are simulated.
 * (Judges' line: "controlled simulation so conditions can be reproduced
 * reliably; architecture accepts real feeds later.")
 */
export function seedState(): EmergencyState {
  return {
    incidents: [
      {
        id: "inc-001",
        type: "FLOOD",
        severity: "HIGH",
        locationName: "Zone A, Pune",
        coords: { lat: 18.62, lng: 73.81 },
        affectedPeople: 320,
        status: "ACTIVE",
        reportedAt: new Date().toISOString(),
      },
    ],
    teams: [
      { id: "team-01", name: "Team 01", status: "AVAILABLE", distanceKm: 4, members: 8, lat: 18.558, lng: 73.809 },
      { id: "team-02", name: "Team 02", status: "AVAILABLE", distanceKm: 2, members: 6, lat: 18.612, lng: 73.835 },
      { id: "team-03", name: "Team 03", status: "AVAILABLE", distanceKm: 6, members: 10, lat: 18.585, lng: 73.881 },
    ],
    hospitals: [
      { id: "hosp-a", name: "Hospital A", capacityUsedPct: 35, status: "AVAILABLE", distanceKm: 5, lat: 18.5196, lng: 73.8553 },
      { id: "hosp-b", name: "Hospital B", capacityUsedPct: 82, status: "LIMITED", distanceKm: 3, lat: 18.5018, lng: 73.8636 },
      { id: "hosp-c", name: "Hospital C", capacityUsedPct: 45, status: "AVAILABLE", distanceKm: 7, lat: 18.5679, lng: 73.9143 },
    ],
    shelters: [
      { id: "shelter-s1", name: "Shelter S1", occupancyPct: 80, capacity: 200 },
      { id: "shelter-s2", name: "Shelter S2", occupancyPct: 35, capacity: 300 },
    ],
    roads: [
      { id: "road-a", name: "Route A", status: "OPEN", connectsTo: "Zone A -> Shelter S2", coords: [{ lat: 18.62, lng: 73.81 }, { lat: 18.601, lng: 73.832 }, { lat: 18.585, lng: 73.86 }] },
      { id: "road-b", name: "Route B", status: "OPEN", connectsTo: "Zone A -> Hospital C", coords: [{ lat: 18.62, lng: 73.81 }, { lat: 18.609, lng: 73.858 }, { lat: 18.5679, lng: 73.9143 }] },
    ],
    updatedAt: new Date().toISOString(),
  };
}
