import { AlertTriangle, Radio, Route, UsersRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEmergencyStore } from '../store/emergencyStore'
import StatCard from '../components/dashboard/StatCard'
import LiveMap from '../components/dashboard/LiveMap'
import NearbyHospitals from '../components/dashboard/NearbyHospitals'
import ResponsePlan from '../components/dashboard/ResponsePlan'
import EventSimulator from '../components/dashboard/EventSimulator'
import ActivityLog from '../components/dashboard/ActivityLog'

export default function Dashboard() {
  const { emergencyState, currentPlan, activityLog, degraded, loading, error, runSimulation, setPlanStatus } = useEmergencyStore()
  const state = emergencyState
  const incidents = state?.incidents || []
  const teams = state?.teams || []
  const roads = state?.roads || []
  const activeIncidents = incidents.filter((incident) => incident.status === 'ACTIVE').length
  const deployedTeams = teams.filter((team) => team.status === 'DISPATCHED').length
  const affectedPeople = incidents.reduce((total, incident) => total + incident.affectedPeople, 0)
  const blockedRoads = roads.filter((road) => road.status === 'BLOCKED').length
  return <div className="dashboard-page"><div className="page-heading"><div><div className="eyebrow"><span className="live-pulse" />Operations overview</div><h1>Emergency coordination</h1><p>Current response picture and agent-generated tactics.</p></div><div className="page-heading-meta">{degraded && <span className="fallback-badge">Fallback mode</span>}<div className="data-source"><span className="source-dot" />{state ? 'Live system state' : error ? 'System unavailable' : 'Connecting to response API'}</div></div></div>
    <motion.div className="stats-grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><StatCard label="Active incidents" value={activeIncidents} icon={AlertTriangle} tone="red" /><StatCard label="Teams deployed" value={deployedTeams} icon={UsersRound} tone="blue" /><StatCard label="People affected" value={affectedPeople} icon={UsersRound} tone="orange" /><StatCard label="Blocked routes" value={blockedRoads} icon={Route} tone="green" /></motion.div>
    <div className="dashboard-grid top-grid"><LiveMap compact state={state} /><NearbyHospitals hospitals={state?.hospitals || []} /></div>
    <div className="dashboard-grid middle-grid"><ResponsePlan plan={currentPlan} state={state} onStatusChange={setPlanStatus} /><EventSimulator state={state} loading={loading} error={error} runSimulation={runSimulation} /></div>
    <ActivityLog activity={activityLog} />
    <div className="dashboard-footer"><Radio size={14} /> {state ? `Updated ${new Date(state.updatedAt).toLocaleTimeString()}` : 'Waiting for emergency state from the response API.'}</div>
  </div>
}
