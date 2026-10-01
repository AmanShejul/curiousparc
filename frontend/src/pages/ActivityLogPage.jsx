import ActivityLog from '../components/dashboard/ActivityLog'
import { activity } from '../data/mockData'
export default function ActivityLogPage() { return <div className="generic-page narrow-page"><div className="page-heading"><div><div className="eyebrow">Audit trail</div><h1>Activity log</h1><p>Chronological record of system and operator events.</p></div></div><ActivityLog activity={activity} /></div> }
