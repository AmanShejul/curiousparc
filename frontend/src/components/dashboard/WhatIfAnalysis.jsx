import { ArrowRight, GitBranch, TrendingDown, TrendingUp } from 'lucide-react'
import { useState } from 'react'
import { whatIfScenarios } from '../../data/mockData'
import Button from '../common/Button'

export default function WhatIfAnalysis() {
  const [selected, setSelected] = useState(0)
  const scenario = whatIfScenarios[selected]
  return <section className="panel what-if-panel"><div className="panel-heading"><div className="heading-with-icon"><span className="utility-icon"><GitBranch size={15} /></span><div><h3>What-if analysis</h3><span className="muted">Compare response outcomes</span></div></div><span className="analysis-live">Live model</span></div><div className="what-if-tabs">{whatIfScenarios.map((item, index) => <button className={selected === index ? 'selected' : ''} onClick={() => setSelected(index)} key={item.label}>{item.label}</button>)}</div><div className="what-if-result"><div className="result-top"><div><span className="field-label">Scenario</span><strong>{scenario.value}</strong></div><span className={`impact-badge impact-${scenario.tone}`}>{scenario.tone === 'green' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}{scenario.effect}</span></div><p>{scenario.detail}</p><div className="what-if-compare"><span>Current estimate <strong>9 min</strong></span><ArrowRight size={15} /><span>Projected <strong className={`text-${scenario.tone}`}>{scenario.effect.replace('+', '')}</strong></span></div></div><Button variant="secondary" className="full-button" onClick={() => {}}>Run detailed analysis <ArrowRight size={14} /></Button></section>
}
