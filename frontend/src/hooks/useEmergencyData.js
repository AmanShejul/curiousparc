import { useEmergencyStore } from '../store/emergencyStore'

export function useEmergencyData() {
  const store = useEmergencyStore()
  return {
    incidents: store.emergencyState?.incidents || [],
    rescueTeams: store.emergencyState?.teams || [],
    hospitals: store.emergencyState?.hospitals || [],
    shelters: store.emergencyState?.shelters || [],
    responsePlan: store.currentPlan,
    activity: store.activityLog,
    source: store.emergencyState ? 'api' : 'loading',
  }
}
