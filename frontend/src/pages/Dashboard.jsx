import { Activity, AlertTriangle, Clock3, Radio, UsersRound } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEmergencyData } from '../hooks/useEmergencyData'
import StatCard from '../components/dashboard/StatCard'
import LiveMap from '../components/dashboard/LiveMap'
import NearbyHospitals from '../components/dashboard/NearbyHospitals'
import ResponsePlan from '../components/dashboard/ResponsePlan'
import ResourceStatus from '../components/dashboard/ResourceStatus'
import EventSimulator from '../components/dashboard/EventSimulator'
import WhatIfAnalysis from '../components/dashboard/WhatIfAnalysis'
import ActivityLog from '../components/dashboard/ActivityLog'

export default function Dashboard() {
  const { incidents, hospitals, responsePlan, activity, systemStatus, source } = useEmergencyData()
  return <div className="dashboard-page"><div className="page-heading"><div><div className="eyebrow"><span className="live-pulse" />Operations overview</div><h1>Good afternoon, operator</h1><p>Monitor active incidents and coordinate the city response.</p></div><div className="page-heading-meta"><div className="data-source"><span className="source-dot" />{source === 'api' ? 'Connected to backend' : 'Using local operational data'}</div><span>Friday, 18 April 2025</span></div></div>
    <motion.div className="stats-grid" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}><StatCard label="Active incidents" value={systemStatus.activeIncidents} meta="2 need immediate attention" trend="+2" icon={AlertTriangle} tone="red" /><StatCard label="Teams deployed" value={systemStatus.teamsDeployed} meta="of 18 available units" trend="+3" icon={UsersRound} tone="blue" /><StatCard label="People affected" value="1,372" meta="across 7 active incidents" trend="+14%" icon={Activity} tone="orange" /><StatCard label="Avg. response time" value="08:42" meta="target under 10:00" trend="-01:18" icon={Clock3} tone="green" /></motion.div>
    <div className="dashboard-grid top-grid"><LiveMap compact /><NearbyHospitals hospitals={hospitals} /></div>
    <div className="dashboard-grid middle-grid"><ResponsePlan plan={responsePlan} /><ResourceStatus /></div>
    <div className="dashboard-grid bottom-grid"><EventSimulator /><WhatIfAnalysis /></div>
    <ActivityLog activity={activity} />
    <div className="dashboard-footer"><Radio size={14} /> {systemStatus.network} · Dispatch channel 4 active · {source === 'mock' ? 'Mock data is shown until the backend is connected.' : 'Live data from the response API.'}</div>
  </div>
}
