import { ChevronRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function ActivityLog({ activity }) {
  const entries = [...activity].sort((first, second) => String(second.t || '').localeCompare(String(first.t || '')))
  return <section className="panel activity-panel"><div className="panel-heading"><div><h3>Recent activity</h3><span className="muted">Agent event timeline</span></div><Link to="/activity" className="text-link">View all <ChevronRight size={14} /></Link></div><div className="activity-list">{entries.slice(0, 8).map((event, index) => <div className="activity-row" key={`${event.t}-${event.agent}-${index}`}><span className={`activity-indicator ${event.agent === 'RISK' ? 'red' : event.agent === 'PLANNING' ? 'green' : event.agent === 'RESOURCE' ? 'orange' : 'blue'}`} /><div className="activity-content"><strong>{event.agent}</strong><span>{event.message}</span></div><span className="activity-time"><Clock3 size={12} /> {event.t}</span></div>)}{!entries.length && <p className="empty-state">No agent activity yet.</p>}</div></section>
}
