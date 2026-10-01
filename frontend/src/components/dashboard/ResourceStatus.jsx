import { CarFront, ChevronRight, Droplets, Radio, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import StatusBadge from '../common/StatusBadge'

const resources = [
  { label: 'Rescue teams', value: '12 / 18', icon: UsersRound, tone: 'blue', status: '6 available' },
  { label: 'Response vehicles', value: '9 / 14', icon: CarFront, tone: 'green', status: '5 available' },
  { label: 'Water rescue units', value: '4 / 6', icon: Droplets, tone: 'orange', status: '2 available' },
  { label: 'Radio channels', value: '8 / 8', icon: Radio, tone: 'green', status: 'All operational' },
]

export default function ResourceStatus() {
  return <section className="panel resource-panel"><div className="panel-heading"><div><h3>Resource status</h3><span className="muted">Current deployment</span></div><Link to="/rescue-teams" className="text-link">Manage <ChevronRight size={14} /></Link></div><div className="resource-list">{resources.map(({ label, value, icon: Icon, tone, status }) => <div className="resource-row" key={label}><span className={`resource-icon ${tone}`}><Icon size={16} /></span><div className="resource-label"><strong>{label}</strong><span>{status}</span></div><strong className="resource-value">{value}</strong></div>)}</div></section>
}
