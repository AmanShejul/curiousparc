import StatusBadge from '../components/common/StatusBadge'
import { useEmergencyStore } from '../store/emergencyStore'
import PlaceholderPage from './PlaceholderPage'

export default function HospitalsPage() {
	const { emergencyState, loading, error } = useEmergencyStore()
	const hospitals = emergencyState?.hospitals || []
	const rows = hospitals.map((hospital) => [
		hospital.name,
		`${hospital.capacityUsedPct ?? hospital.capacityPct}% utilized`,
		hospital.distanceKm != null ? `${hospital.distanceKm} km` : 'Not provided',
		<StatusBadge key={`${hospital.id}-status`} tone={hospital.status === 'AVAILABLE' || hospital.status === 'NORMAL' ? 'green' : 'orange'}>{hospital.status}</StatusBadge>,
	])
	return <PlaceholderPage eyebrow="Medical network" title="Hospitals" description="Monitor receiving facilities and reported capacity." rows={rows} headings={['Facility', 'Utilization', 'Distance', 'Status']} loading={loading} error={error} updatedAt={emergencyState?.updatedAt} />
}
