import { create } from 'zustand'
import { api } from '../services/api'

export const useEmergencyStore = create((set, get) => ({
  emergencyState: null,
  plans: [],
  currentPlan: null,
  activityLog: [],
  degraded: false,
  loading: false,
  error: null,
  initialized: false,
  loadSystem: async () => {
    if (get().loading || get().initialized) return
    set({ loading: true, error: null })
    try {
      const response = await api.getSystem()
      const emergencyState = response.state || response
      const plans = response.plans || []
      set({ emergencyState, plans, currentPlan: plans[0] || null, loading: false, initialized: true })
    } catch (error) {
      set({ loading: false, error: error.message, initialized: true })
    }
  },
  runSimulation: async (event, targetId) => {
    const { emergencyState } = get()
    if (!emergencyState || get().loading) return
    set({ loading: true, error: null })
    try {
      const response = await api.runSimulation({ state: emergencyState, event, targetId })
      const previousPlans = get().plans
      const plans = response.plan ? [response.plan, ...previousPlans] : previousPlans
      set((current) => ({
        emergencyState: response.state,
        plans,
        currentPlan: response.plan || current.currentPlan,
        activityLog: [...(response.activityLog || []), ...current.activityLog],
        degraded: Boolean(response.degraded),
        loading: false,
      }))
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },
  setPlanStatus: (status) => set((current) => {
    if (!current.currentPlan) return {}
    const currentPlan = { ...current.currentPlan, status }
    return { currentPlan, plans: current.plans.map((plan) => plan.id === currentPlan.id ? currentPlan : plan) }
  }),
}))
