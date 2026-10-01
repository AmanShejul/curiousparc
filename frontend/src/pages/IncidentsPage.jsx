import { incidents } from '../data/mockData'
import StatusBadge from '../components/common/StatusBadge'
import { formatDateTime } from '../utils/formatters'
export default function IncidentsPage() { return <PlaceholderPage eyebrow="Incident management" title="Incidents" description="Review, prioritize, and assign active emergency incidents." rows={incidents.map((item) => [item.id, item.type, item.location, `${item.affected} people`, item.status, formatDateTime(item.reportedAt), <StatusBadge tone={item.severity}>{item.severity}</StatusBadge>])} headings={['ID', 'Type', 'Location', 'Affected', 'Status', 'Reported', 'Severity']} /> }
