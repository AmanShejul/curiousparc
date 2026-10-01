import { Navigate, Route, Routes } from 'react-router-dom'
import PageLayout from './components/layout/PageLayout'
import Dashboard from './pages/Dashboard'
import MapPage from './pages/MapPage'
import IncidentsPage from './pages/IncidentsPage'
import HospitalsPage from './pages/HospitalsPage'
import SheltersPage from './pages/SheltersPage'
import RescueTeamsPage from './pages/RescueTeamsPage'
import ResponsePlansPage from './pages/ResponsePlansPage'
import SimulationPage from './pages/SimulationPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ActivityLogPage from './pages/ActivityLogPage'

export default function App() {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/incidents" element={<IncidentsPage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/shelters" element={<SheltersPage />} />
        <Route path="/rescue-teams" element={<RescueTeamsPage />} />
        <Route path="/response-plans" element={<ResponsePlansPage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/activity" element={<ActivityLogPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
