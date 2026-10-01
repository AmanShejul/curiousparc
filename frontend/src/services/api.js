const API_URL = import.meta.env.VITE_API_URL || ''

async function request(path, options = {}) {
  if (!API_URL) throw new Error('API URL is not configured')
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export const api = {
  getSystem: () => request('/system'),
  getIncidents: () => request('/incidents'),
  getResources: () => request('/resources'),
  getHospitals: () => request('/hospitals'),
  getShelters: () => request('/shelters'),
  getResponsePlans: () => request('/response-plans'),
  getActivity: () => request('/activity'),
  approvePlan: (id) => request(`/response-plans/${id}/approve`, { method: 'POST' }),
  rejectPlan: (id) => request(`/response-plans/${id}/reject`, { method: 'POST' }),
  runSimulation: (payload) => request('/simulation', { method: 'POST', body: JSON.stringify(payload) }),
  runWhatIf: (payload) => request('/what-if', { method: 'POST', body: JSON.stringify(payload) }),
}
