import * as Icons from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useEmergencyStore } from '../../store/emergencyStore'
import { NAV_ITEMS } from '../../utils/constants'

export default function Sidebar({ open, onClose }) {
  const activeIncidents = useEmergencyStore((store) => store.emergencyState?.incidents.filter((incident) => incident.status === 'ACTIVE').length || 0)
  const updatedAt = useEmergencyStore((store) => store.emergencyState?.updatedAt)
  return <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
    <div className="sidebar-header"><div className="system-mark"><Icons.ShieldAlert size={18} /></div><div><div className="system-title">Emergency response</div><div className="system-subtitle">Operations network</div></div><button className="sidebar-close" onClick={onClose}>×</button></div>
    <div className="nav-section-label">Workspace</div>
    <nav>{NAV_ITEMS.map((item) => { const Icon = Icons[item.icon] || Icons.Circle
      return <NavLink key={item.path} to={item.path} end={item.path === '/'} onClick={onClose} className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}><Icon size={17} strokeWidth={1.9} /><span>{item.label}</span>{item.path === '/incidents' && <span className="nav-count">{activeIncidents}</span>}</NavLink>
    })}</nav>
    <div className="sidebar-footer"><div className="status-pulse"><span />System operational</div><div className="sidebar-version">{updatedAt ? `Last sync ${new Date(updatedAt).toLocaleTimeString()}` : 'Awaiting system state'}</div></div>
  </aside>
}
