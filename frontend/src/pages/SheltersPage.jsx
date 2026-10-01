import StatusBadge from '../components/common/StatusBadge'
import { useEmergencyStore } from '../store/emergencyStore'
import PlaceholderPage from './PlaceholderPage'

export default function SheltersPage() {
	const { emergencyState, loading, error } = useEmergencyStore()
	const shelters = emergencyState?.shelters || []
	const rows = shelters.map((shelter) => {
		const occupied = shelter.occupied ?? Math.round(shelter.capacity * (shelter.occupancyPct || 0) / 100)
		const occupancyPct = shelter.capacity ? Math.round(occupied / shelter.capacity * 100) : 0
		return [
			shelter.name,
			`${occupied} / ${shelter.capacity}`,
			`${occupancyPct}% occupied`,
			<StatusBadge key={`${shelter.id}-status`} tone={occupancyPct >= 90 ? 'orange' : 'green'}>{occupancyPct >= 90 ? 'HIGH OCCUPANCY' : 'AVAILABLE'}</StatusBadge>,
		]
	})
	return <PlaceholderPage eyebrow="Community support" title="Shelters" description="Monitor shelter occupancy and available capacity." rows={rows} headings={['Shelter', 'Occupied / Capacity', 'Load', 'Status']} loading={loading} error={error} updatedAt={emergencyState?.updatedAt} />
}
