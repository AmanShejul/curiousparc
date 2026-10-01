import { BedDouble, ChevronRight, Hospital } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export default function NearbyHospitals({ hospitals }) {
  return <section className="panel hospitals-panel"><div className="panel-heading"><div><h3>Nearby hospitals</h3><span className="muted">Current facility status</span></div><Link to="/hospitals" className="text-link">View all <ChevronRight size={14} /></Link></div><div className="hospital-list">{hospitals.map((hospital) => { const capacity = hospital.capacityUsedPct ?? hospital.capacityPct; return <div className="hospital-row" key={hospital.id}><div className="hospital-icon"><Hospital size={17} /></div><div className="hospital-info"><div className="hospital-name">{hospital.name}</div>{hospital.distanceKm != null && <div className="hospital-meta">{hospital.distanceKm} km away</div>}</div><div className="hospital-capacity">{capacity != null ? <><strong>{capacity}%</strong><span>capacity used</span><div className="capacity-bar"><i style={{ width: `${capacity}%` }} /></div></> : <span>Capacity unavailable</span>}</div><StatusBadge tone={hospital.status === 'AVAILABLE' || hospital.status === 'NORMAL' ? 'green' : 'orange'}>{hospital.status}</StatusBadge></div> })}{!hospitals.length && <p className="empty-state">No hospital data loaded.</p>}</div></section>
}
