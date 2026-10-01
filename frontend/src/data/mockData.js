export const systemStatus = {
  status: 'operational',
  lastSync: '2025-04-18T14:32:00',
  activeIncidents: 7,
  teamsDeployed: 12,
  network: 'Connected',
}

export const incidents = [
  { id: 'INC-2048', type: 'Urban flooding', location: 'Riverside district', severity: 'critical', status: 'Active', affected: 1240, coordinates: [28.6139, 77.209], reportedAt: '2025-04-18T13:48:00' },
  { id: 'INC-2047', type: 'Structural collapse', location: 'Market Street', severity: 'high', status: 'Response underway', affected: 86, coordinates: [28.6226, 77.218], reportedAt: '2025-04-18T12:56:00' },
  { id: 'INC-2046', type: 'Road accident', location: 'East bypass', severity: 'moderate', status: 'Contained', affected: 12, coordinates: [28.601, 77.23], reportedAt: '2025-04-18T11:24:00' },
  { id: 'INC-2045', type: 'Electrical fire', location: 'Industrial zone 4', severity: 'high', status: 'Contained', affected: 34, coordinates: [28.588, 77.202], reportedAt: '2025-04-18T10:09:00' },
]

export const hospitals = [
  { id: 'HOS-01', name: 'Central General Hospital', distance: '2.4 km', capacity: 78, beds: 42, totalBeds: 54, status: 'Receiving', trauma: 'Level I', coordinates: [28.626, 77.215] },
  { id: 'HOS-02', name: 'St. Mary’s Medical Center', distance: '4.8 km', capacity: 61, beds: 31, totalBeds: 51, status: 'Receiving', trauma: 'Level II', coordinates: [28.59, 77.218] },
  { id: 'HOS-03', name: 'Northside Community Hospital', distance: '6.1 km', capacity: 92, beds: 11, totalBeds: 120, status: 'Limited intake', trauma: 'Level II', coordinates: [28.65, 77.21] },
  { id: 'HOS-04', name: 'University Medical Institute', distance: '8.7 km', capacity: 39, beds: 74, totalBeds: 120, status: 'Available', trauma: 'Level I', coordinates: [28.57, 77.19] },
]

export const rescueTeams = [
  { id: 'TEAM-07', name: 'Alpha response', members: 8, specialty: 'Flood rescue', status: 'Deployed', location: 'Riverside district', eta: 'On scene' },
  { id: 'TEAM-03', name: 'Bravo response', members: 6, specialty: 'Urban search & rescue', status: 'En route', location: 'Market Street', eta: '06 min' },
  { id: 'TEAM-11', name: 'Medical unit 11', members: 4, specialty: 'Field medical', status: 'Standby', location: 'Central station', eta: '12 min' },
  { id: 'TEAM-02', name: 'Delta response', members: 7, specialty: 'Water operations', status: 'Deployed', location: 'East embankment', eta: 'On scene' },
]

export const shelters = [
  { id: 'SHL-01', name: 'Civic Convention Hall', occupancy: 318, capacity: 500, status: 'Open', location: 'Civic center' },
  { id: 'SHL-02', name: 'Northside School', occupancy: 166, capacity: 200, status: 'Near capacity', location: 'Northside' },
  { id: 'SHL-03', name: 'South Recreation Center', occupancy: 92, capacity: 350, status: 'Open', location: 'South district' },
]

export const blockedRoads = [
  { name: 'Riverside Avenue', reason: 'Flood water', severity: 'critical', coordinates: [[28.605, 77.204], [28.619, 77.211]] },
  { name: 'Market Street underpass', reason: 'Structural debris', severity: 'high', coordinates: [[28.621, 77.213], [28.628, 77.222]] },
]

export const responsePlan = {
  id: 'PLAN-091',
  title: 'Riverside flood response',
  status: 'Awaiting approval',
  generatedAt: '2025-04-18T14:27:00',
  confidence: 94,
  summary: 'Prioritize evacuation of low-lying blocks, route water rescue through the east embankment, and distribute incoming patients across three receiving hospitals.',
  actions: [
    { priority: '01', action: 'Evacuate Blocks R-4 through R-7', owner: 'Alpha response', timing: 'Immediate' },
    { priority: '02', action: 'Divert traffic from Riverside Avenue', owner: 'Traffic control', timing: 'Within 5 min' },
    { priority: '03', action: 'Open Civic Convention Hall shelter', owner: 'Community ops', timing: 'Within 10 min' },
    { priority: '04', action: 'Distribute patients across Central General and St. Mary’s', owner: 'Medical unit 11', timing: 'Within 15 min' },
  ],
}

export const activity = [
  { id: 1, time: '2025-04-18T14:32:00', title: 'Hospital capacity updated', detail: 'Central General reported 42 available beds', tone: 'blue' },
  { id: 2, time: '2025-04-18T14:29:00', title: 'New road blockage detected', detail: 'Riverside Avenue closed due to rising flood water', tone: 'red' },
  { id: 3, time: '2025-04-18T14:27:00', title: 'Response plan generated', detail: 'Riverside flood response is awaiting approval', tone: 'orange' },
  { id: 4, time: '2025-04-18T14:18:00', title: 'Team Alpha deployed', detail: '8 responders assigned to Riverside district', tone: 'green' },
  { id: 5, time: '2025-04-18T14:02:00', title: 'Incident severity escalated', detail: 'INC-2048 changed from high to critical', tone: 'red' },
]

export const whatIfScenarios = [
  { label: 'Road closure', value: 'Close Riverside Avenue', effect: '+8 min', detail: 'Average patient arrival time increases to 17 min.', tone: 'orange' },
  { label: 'Hospital overflow', value: 'Central General reaches 95%', effect: '+12 min', detail: '42 patients rerouted to University Medical Institute.', tone: 'red' },
  { label: 'Team redeployment', value: 'Move Bravo to Riverside', effect: '-5 min', detail: 'Flood-zone evacuation coverage improves by 18%.', tone: 'green' },
]
