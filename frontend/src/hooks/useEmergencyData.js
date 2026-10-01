import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { activity, hospitals, incidents, rescueTeams, responsePlan, shelters, systemStatus } from '../data/mockData'

export function useEmergencyData() {
  const [data, setData] = useState({ incidents, hospitals, shelters, rescueTeams, responsePlan, activity, systemStatus })
  const [source, setSource] = useState('mock')

  useEffect(() => {
    if (!import.meta.env.VITE_API_URL) return undefined
    let cancelled = false
    Promise.allSettled([api.getSystem(), api.getIncidents(), api.getResources(), api.getHospitals(), api.getShelters(), api.getResponsePlans(), api.getActivity()]).then((results) => {
      if (cancelled || results.every((result) => result.status === 'rejected')) return
      const values = results.map((result) => result.status === 'fulfilled' ? result.value : null)
      setData((current) => ({
        systemStatus: values[0] || current.systemStatus,
        incidents: values[1] || current.incidents,
        rescueTeams: values[2]?.rescueTeams || current.rescueTeams,
        hospitals: values[3] || current.hospitals,
        shelters: values[4] || current.shelters,
        responsePlan: values[5]?.[0] || values[5] || current.responsePlan,
        activity: values[6] || current.activity,
      }))
      setSource('api')
    })
    return () => { cancelled = true }
  }, [])

  return { ...data, source }
}
