const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, { headers: { 'Content-Type': 'application/json' }, ...options })
  if (!response.ok) throw new Error(`Request failed: ${response.status}`)
  return response.json()
}

export const api = {
  getSystem: () => request('/api/system'),
  runSimulation: ({ state, event, targetId }) => {
    const payload = { state, event, targetId }
    if (event === 'BLOCK_ROAD') payload.roadId = targetId
    if (event === 'HOSPITAL_OVERLOAD') payload.hospitalId = targetId
    if (event === 'TEAM_UNAVAILABLE') payload.teamId = targetId
    return request('/api/simulation', { method: 'POST', body: JSON.stringify(payload) })
  },
}
