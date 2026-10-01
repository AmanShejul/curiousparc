import { Activity, Hospital, Route, UsersRound } from 'lucide-react'
import StatCard from '../components/dashboard/StatCard'
import { useEmergencyStore } from '../store/emergencyStore'

export default function AnalyticsPage() {
	const state = useEmergencyStore((store) => store.emergencyState)
	const incidents = state?.incidents || []
	const teams = state?.teams || []
	const hospitals = state?.hospitals || []
	const roads = state?.roads || []
	const resolvedIncidents = incidents.filter((incident) => incident.status === 'RESOLVED').length
	const activeTeams = teams.filter((team) => team.status === 'DISPATCHED').length
	const averageCapacity = hospitals.length ? Math.round(hospitals.reduce((total, hospital) => total + (hospital.capacityUsedPct ?? hospital.capacityPct ?? 0), 0) / hospitals.length) : 0
	const blockedRoads = roads.filter((road) => road.status === 'BLOCKED').length
	const affectedPeople = incidents.reduce((total, incident) => total + incident.affectedPeople, 0)
	return <div className="generic-page"><div className="page-heading"><div><div className="eyebrow">Performance review</div><h1>Analytics</h1><p>Summary calculated from the current emergency state.</p></div></div>{state ? <div className="stats-grid analytics-stats"><StatCard label="People affected" value={affectedPeople} icon={UsersRound} tone="orange" /><StatCard label="Incidents resolved" value={`${resolvedIncidents} / ${incidents.length}`} icon={Activity} tone="blue" /><StatCard label="Teams dispatched" value={`${activeTeams} / ${teams.length}`} icon={UsersRound} tone="green" /><StatCard label="Average hospital capacity" value={`${averageCapacity}%`} icon={Hospital} tone="red" /><StatCard label="Blocked roads" value={`${blockedRoads} / ${roads.length}`} icon={Route} tone="orange" /></div> : <p className="empty-state">Emergency state is not available yet.</p>}</div>
}
