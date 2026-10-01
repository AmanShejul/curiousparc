import { useEmergencyStore } from '../store/emergencyStore'
import ResponsePlan from '../components/dashboard/ResponsePlan'
export default function ResponsePlansPage() { const { currentPlan, emergencyState, setPlanStatus } = useEmergencyStore(); return <div className="generic-page narrow-page"><div className="page-heading"><div><div className="eyebrow">Decision support</div><h1>Response plans</h1><p>Review generated recommendations before dispatch.</p></div></div><ResponsePlan plan={currentPlan} state={emergencyState} onStatusChange={setPlanStatus} /></div> }
