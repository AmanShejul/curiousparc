import EventSimulator from '../components/dashboard/EventSimulator'
import WhatIfAnalysis from '../components/dashboard/WhatIfAnalysis'
export default function SimulationPage() { return <div className="generic-page narrow-page"><div className="page-heading"><div><div className="eyebrow">Preparedness</div><h1>Simulation</h1><p>Test response conditions and compare projected outcomes.</p></div></div><div className="dashboard-grid bottom-grid"><EventSimulator /><WhatIfAnalysis /></div></div> }
