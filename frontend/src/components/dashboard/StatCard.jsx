import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function StatCard({ label, value, meta, trend, icon: Icon, tone = 'blue' }) {
  return <article className="stat-card"><div className="stat-card-top"><span className="stat-label">{label}</span><span className={`stat-icon stat-icon-${tone}`}><Icon size={17} /></span></div><div className="stat-value">{value}</div><div className="stat-meta">{trend && <span className={trend.startsWith('+') ? 'trend-up' : 'trend-down'}>{trend.startsWith('+') ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{trend}</span>}{meta}</div></article>
}
