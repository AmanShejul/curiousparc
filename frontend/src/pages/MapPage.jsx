import LiveMap from '../components/dashboard/LiveMap'
import { incidents } from '../data/mockData'
import StatusBadge from '../components/common/StatusBadge'

export default function MapPage() { return <div className="generic-page"><div className="page-heading"><div><div className="eyebrow">Situational awareness</div><h1>Live map</h1><p>Track incidents, teams, hospitals, and blocked routes.</p></div></div><LiveMap /><div className="panel simple-table-panel"><div className="panel-heading"><div><h3>Active map events</h3><span className="muted">{incidents.length} events currently plotted</span></div></div><div className="simple-table">{incidents.map((incident) => <div className="table-row" key={incident.id}><strong>{incident.id}</strong><span>{incident.type}</span><span>{incident.location}</span><StatusBadge tone={incident.severity}>{incident.severity}</StatusBadge></div>)}</div></div></div> }
