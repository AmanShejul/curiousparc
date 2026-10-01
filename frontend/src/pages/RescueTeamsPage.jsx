import StatusBadge from '../components/common/StatusBadge'
import { useEmergencyStore } from '../store/emergencyStore'
import PlaceholderPage from './PlaceholderPage'

export default function RescueTeamsPage() {
	const { emergencyState, loading, error } = useEmergencyStore()
	const teams = emergencyState?.teams || []
	const rows = teams.map((team) => [
		team.name,
		`${team.members} responders`,
		`${team.distanceKm} km`,
		<StatusBadge key={`${team.id}-status`} tone={team.status === 'AVAILABLE' ? 'green' : team.status === 'DISPATCHED' ? 'blue' : 'orange'}>{team.status}</StatusBadge>,
	])
	return <PlaceholderPage eyebrow="Field operations" title="Rescue teams" description="View team size, distance from the primary incident, and availability." rows={rows} headings={['Team', 'Size', 'Distance', 'Status']} loading={loading} error={error} updatedAt={emergencyState?.updatedAt} />
}
