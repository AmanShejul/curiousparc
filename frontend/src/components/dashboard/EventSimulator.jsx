import { Pause, Play, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import Button from '../common/Button'

export default function EventSimulator() {
  const [running, setRunning] = useState(false)
  const [progress, setProgress] = useState(48)
  return <section className="panel simulator-panel"><div className="panel-heading"><div className="heading-with-icon"><span className="utility-icon"><SlidersHorizontal size={15} /></span><div><h3>Event simulator</h3><span className="muted">Test response conditions</span></div></div><span className="simulator-mode">Scenario mode</span></div><div className="scenario-select"><div><span className="field-label">Active scenario</span><strong>Riverside flood escalation</strong></div><span className="scenario-chevron">⌄</span></div><div className="simulator-timeline"><div className="timeline-header"><span>Simulation timeline</span><strong>00:24:18 / 00:50:00</strong></div><input type="range" min="0" max="100" value={progress} onChange={(event) => setProgress(event.target.value)} /><div className="timeline-labels"><span>14:00</span><span>14:25</span><span>14:50</span></div></div><div className="simulator-actions"><Button onClick={() => setRunning(!running)}>{running ? <Pause size={14} /> : <Play size={14} />} {running ? 'Pause simulation' : 'Run simulation'}</Button><Button variant="secondary" onClick={() => setProgress(0)}><RotateCcw size={14} /> Reset</Button></div></section>
}
