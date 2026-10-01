import { Check, Sparkles, X } from 'lucide-react'
import { formatTime } from '../../utils/formatters'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'

export default function ResponsePlan({ plan, state, onStatusChange }) {
  if (!plan) return <section className="panel response-plan"><div className="panel-heading"><div className="heading-with-icon"><span className="ai-icon"><Sparkles size={15} /></span><div><h3>AI response plan</h3><span className="muted">No plan generated yet</span></div></div></div><p className="empty-state">Run an event simulation to generate a response plan.</p></section>
  const team = state?.teams?.find((item) => item.id === plan.teamId)
  const road = state?.roads?.find((item) => item.id === plan.routeId)
  const hospital = state?.hospitals?.find((item) => item.id === plan.hospitalId)
  const status = plan.status || 'PROPOSED'
  const proposed = status === 'PROPOSED'
  return <section className="panel response-plan"><div className="panel-heading"><div className="heading-with-icon"><span className="ai-icon"><Sparkles size={15} /></span><div><h3>AI response plan</h3><span className="muted">Generated {formatTime(plan.createdAt)}{plan.confidence != null ? ` · ${plan.confidence}% confidence` : ''}</span></div></div><StatusBadge tone={status === 'APPROVED' || status === 'ACTIVE' ? 'green' : status === 'REJECTED' ? 'red' : 'orange'}>{status}</StatusBadge></div><div className="plan-assignments"><span><strong>Team</strong>{team?.name || plan.teamId}</span><span><strong>Route</strong>{road?.name || plan.routeId}</span><span><strong>Hospital</strong>{hospital?.name || plan.hospitalId}</span><StatusBadge tone="blue">{plan.priority}</StatusBadge></div><div className="plan-summary">{plan.reason}</div><div className="plan-actions">{(plan.actions || []).map((action, index) => <div className="plan-action" key={`${index}-${action}`}><span className="plan-number">{String(index + 1).padStart(2, '0')}</span><div className="plan-action-main"><strong>{action}</strong></div></div>)}</div>{proposed ? <div className="plan-footer"><span>Review recommended actions before dispatch</span><div className="plan-buttons"><Button variant="secondary" onClick={() => onStatusChange('REJECTED')}><X size={14} /> Reject</Button><Button onClick={() => onStatusChange('APPROVED')}><Check size={14} /> Approve</Button></div></div> : <div className={`plan-decision ${status === 'REJECTED' ? 'decision-rejected' : 'decision-approved'}`}><Check size={15} /> Plan {status.toLowerCase()}</div>}</section>
}
