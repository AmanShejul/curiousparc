import { ChevronRight, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatTime } from '../../utils/formatters'

export default function ActivityLog({ activity }) {
  return <section className="panel activity-panel"><div className="panel-heading"><div><h3>Recent activity</h3><span className="muted">System and operator events</span></div><Link to="/activity" className="text-link">View all <ChevronRight size={14} /></Link></div><div className="activity-list">{activity.slice(0, 5).map((event) => <div className="activity-row" key={event.id}><span className={`activity-indicator ${event.tone}`} /><div className="activity-content"><strong>{event.title}</strong><span>{event.detail}</span></div><span className="activity-time"><Clock3 size={12} /> {formatTime(event.time)}</span></div>)}</div></section>
}
