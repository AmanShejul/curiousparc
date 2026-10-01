import { BedDouble, ChevronRight, Hospital } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

export default function NearbyHospitals({ hospitals }) {
  return <section className="panel hospitals-panel"><div className="panel-heading"><div><h3>Nearby hospitals</h3><span className="muted">Capacity within 10 km</span></div><Link to="/hospitals" className="text-link">View all <ChevronRight size={14} /></Link></div><div className="hospital-list">{hospitals.slice(0, 4).map((hospital) => <div className="hospital-row" key={hospital.id}><div className="hospital-icon"><Hospital size={17} /></div><div className="hospital-info"><div className="hospital-name">{hospital.name}</div><div className="hospital-meta">{hospital.distance} · {hospital.trauma}</div></div><div className="hospital-capacity"><strong>{hospital.beds}</strong><span>/ {hospital.totalBeds} beds</span><div className="capacity-bar"><i style={{ width: `${100 - hospital.capacity}%` }} /></div></div><StatusBadge tone={hospital.status === 'Available' ? 'green' : hospital.status === 'Limited intake' ? 'orange' : 'blue'}>{hospital.status}</StatusBadge></div>)}</div></section>
}
