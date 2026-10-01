import LiveMap from '../components/dashboard/LiveMap'
import StatusBadge from '../components/common/StatusBadge'
import { useEmergencyStore } from '../store/emergencyStore'

export default function MapPage() {
	const { emergencyState } = useEmergencyStore()
	const incidents = emergencyState?.incidents || []
	return <div className="generic-page"><div className="page-heading"><div><div className="eyebrow">Situational awareness</div><h1>Live map</h1><p>Track incidents, teams, hospitals, and blocked routes.</p></div></div><LiveMap state={emergencyState} /><div className="panel simple-table-panel"><div className="panel-heading"><div><h3>Active map events</h3><span className="muted">{incidents.length} incidents in the current system state</span></div></div><div className="simple-table">{incidents.length ? incidents.map((incident) => <div className="table-row" key={incident.id}><strong>{incident.id}</strong><span>{incident.type}</span><span>{incident.locationName}</span><StatusBadge tone={incident.severity === 'HIGH' || incident.severity === 'CRITICAL' ? 'red' : 'orange'}>{incident.severity}</StatusBadge></div>) : <p className="empty-state">No incident data loaded.</p>}</div></div></div>
}
