export const NAV_ITEMS = [
  { label: 'Command center', path: '/', icon: 'LayoutDashboard' },
  { label: 'Live map', path: '/map', icon: 'Map' },
  { label: 'Incidents', path: '/incidents', icon: 'TriangleAlert' },
  { label: 'Hospitals', path: '/hospitals', icon: 'Hospital' },
  { label: 'Shelters', path: '/shelters', icon: 'House' },
  { label: 'Rescue teams', path: '/rescue-teams', icon: 'UsersRound' },
  { label: 'Response plans', path: '/response-plans', icon: 'Route' },
  { label: 'Simulation', path: '/simulation', icon: 'PlayCircle' },
  { label: 'Analytics', path: '/analytics', icon: 'ChartNoAxesCombined' },
  { label: 'Activity log', path: '/activity', icon: 'ScrollText' },
]

export const STATUS_COLORS = {
  critical: 'red',
  high: 'orange',
  moderate: 'blue',
  stable: 'green',
  available: 'green',
  deployed: 'blue',
  standby: 'slate',
  offline: 'red',
}
