import StatusBadge from '../components/common/StatusBadge'
import { useEmergencyStore } from '../store/emergencyStore'
import { formatDateTime } from '../utils/formatters'
import PlaceholderPage from './PlaceholderPage'

export default function IncidentsPage() {
	const { emergencyState, loading, error } = useEmergencyStore()
	const incidents = emergencyState?.incidents || []
	const rows = incidents.map((incident) => [
		incident.id,
		incident.type,
		incident.locationName,
		`${incident.affectedPeople} people`,
		incident.status,
		formatDateTime(incident.reportedAt),
		<StatusBadge key={`${incident.id}-severity`} tone={incident.severity === 'HIGH' || incident.severity === 'CRITICAL' ? 'red' : incident.severity === 'MEDIUM' ? 'orange' : 'green'}>{incident.severity}</StatusBadge>,
	])
	return <PlaceholderPage eyebrow="Incident management" title="Incidents" description="Review active emergency incidents and affected populations." headings={['ID', 'Type', 'Location', 'Affected', 'Status', 'Reported', 'Severity']} rows={rows} loading={loading} error={error} updatedAt={emergencyState?.updatedAt} />
}
