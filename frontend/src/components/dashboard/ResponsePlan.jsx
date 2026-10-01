import { Check, ChevronRight, Clock3, Sparkles, X } from 'lucide-react'
import { useState } from 'react'
import { formatTime } from '../../utils/formatters'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'

export default function ResponsePlan({ plan }) {
  const [status, setStatus] = useState(plan.status)
  return <section className="panel response-plan"><div className="panel-heading"><div className="heading-with-icon"><span className="ai-icon"><Sparkles size={15} /></span><div><h3>AI response plan</h3><span className="muted">Generated {formatTime(plan.generatedAt)} · {plan.confidence}% confidence</span></div></div><StatusBadge tone={status === 'Approved' ? 'green' : 'orange'}>{status}</StatusBadge></div><div className="plan-summary">{plan.summary}</div><div className="plan-actions">{plan.actions.map((action) => <div className="plan-action" key={action.priority}><span className="plan-number">{action.priority}</span><div className="plan-action-main"><strong>{action.action}</strong><span>{action.owner}</span></div><span className="plan-timing"><Clock3 size={13} /> {action.timing}</span><ChevronRight size={15} className="plan-chevron" /></div>)}</div>{status === 'Awaiting approval' ? <div className="plan-footer"><span>Review recommended actions before dispatch</span><div className="plan-buttons"><Button variant="secondary" onClick={() => setStatus('Rejected')}><X size={14} /> Reject</Button><Button onClick={() => setStatus('Approved')}><Check size={14} /> Approve plan</Button></div></div> : <div className={`plan-decision ${status === 'Approved' ? 'decision-approved' : 'decision-rejected'}`}><Check size={15} /> Plan {status.toLowerCase()} for dispatch</div>}</section>
}
