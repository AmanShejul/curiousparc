import ActivityLog from '../components/dashboard/ActivityLog'
import { useEmergencyStore } from '../store/emergencyStore'

export default function ActivityLogPage() {
	const activityLog = useEmergencyStore((store) => store.activityLog)
	return <div className="generic-page narrow-page"><div className="page-heading"><div><div className="eyebrow">Audit trail</div><h1>Activity log</h1><p>Chronological record of system and agent events.</p></div></div><ActivityLog activity={activityLog} /></div>
}
