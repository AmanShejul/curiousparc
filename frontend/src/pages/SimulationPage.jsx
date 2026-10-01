import EventSimulator from '../components/dashboard/EventSimulator'
import ResponsePlan from '../components/dashboard/ResponsePlan'
import ActivityLog from '../components/dashboard/ActivityLog'
import { useEmergencyStore } from '../store/emergencyStore'

export default function SimulationPage() {
  const { emergencyState, currentPlan, activityLog, loading, error, runSimulation, setPlanStatus } = useEmergencyStore()
  return <div className="generic-page narrow-page"><div className="page-heading"><div><div className="eyebrow">Preparedness</div><h1>Simulation</h1><p>Apply an event and review the resulting response plan.</p></div></div><EventSimulator state={emergencyState} loading={loading} error={error} runSimulation={runSimulation} /><div className="dashboard-grid middle-grid"><ResponsePlan plan={currentPlan} state={emergencyState} onStatusChange={setPlanStatus} /><ActivityLog activity={activityLog} /></div></div>
}
