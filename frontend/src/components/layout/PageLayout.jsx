import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useEmergencyStore } from '../../store/emergencyStore'
import Header from './Header'
import Sidebar from './Sidebar'

export default function PageLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const loadSystem = useEmergencyStore((store) => store.loadSystem)
  useEffect(() => { loadSystem() }, [loadSystem])
  return <div className="app-shell"><Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} /><div className="app-main"><Header onMenuClick={() => setSidebarOpen(true)} /><main className="page-content"><Outlet /></main></div>{sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close navigation" />}</div>
}
