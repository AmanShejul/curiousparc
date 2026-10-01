import { RotateCcw, SlidersHorizontal } from 'lucide-react'
import Button from '../common/Button'

export default function EventSimulator({ state, loading, error, runSimulation }) {
  const availableTeam = state?.teams?.find((team) => team.status !== 'UNAVAILABLE')
  const hospital = state?.hospitals?.[0]
  const events = [
    ['BLOCK_ROAD', 'Block Route A', 'road-a'],
    ['HOSPITAL_OVERLOAD', 'Hospital Overload', hospital?.id],
    ['TEAM_UNAVAILABLE', 'Team Unavailable', availableTeam?.id],
    ['NEW_EMERGENCY', 'New Emergency'],
    ['RESET', 'Reset'],
  ]
  const disabled = loading || !state
  return <section className="panel simulator-panel"><div className="panel-heading"><div className="heading-with-icon"><span className="utility-icon"><SlidersHorizontal size={15} /></span><div><h3>Event simulator</h3><span className="muted">Apply an event and re-plan from the updated state</span></div></div><span className="simulator-mode">{loading ? 'Processing' : 'Ready'}</span></div><div className="simulator-event-actions">{events.map(([event, label, targetId]) => <Button key={event} variant={event === 'RESET' ? 'secondary' : undefined} disabled={disabled || (event === 'HOSPITAL_OVERLOAD' && !targetId) || (event === 'TEAM_UNAVAILABLE' && !targetId)} onClick={() => runSimulation(event, targetId)}>{event === 'RESET' && <RotateCcw size={14} />}{label}</Button>)}</div>{error && <p className="error-state" role="alert">{error}</p>}</section>
}
