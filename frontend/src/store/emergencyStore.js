import { create } from 'zustand'
import { responsePlan } from '../data/mockData'

export const useEmergencyStore = create((set) => ({
  incidents: [],
  rescueTeams: [],
  hospitals: [],
  shelters: [],
  responsePlans: [responsePlan],
  activity: [],
  systemStatus: null,
  simulation: { running: false, result: null },
  setEmergencyData: (data) => set(data),
  setSimulation: (simulation) => set({ simulation }),
}))
