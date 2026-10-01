import { Bell, ChevronDown, CircleHelp, Menu, Wifi } from 'lucide-react'
import { formatTime } from '../../utils/formatters'
import { useEmergencyStore } from '../../store/emergencyStore'

export default function Header({ onMenuClick }) {
  const updatedAt = useEmergencyStore((store) => store.emergencyState?.updatedAt)
  return <header className="topbar">
    <button className="mobile-menu" onClick={onMenuClick} aria-label="Open navigation"><Menu size={20} /></button>
    <div className="breadcrumb"><span>Operations</span><span className="breadcrumb-divider">/</span><strong>Command center</strong></div>
    <div className="topbar-actions">
      <div className="sync-status"><Wifi size={14} /> <span>Live sync</span><span className="sync-dot" /></div>
      <span className="header-time">{updatedAt ? `Updated ${formatTime(updatedAt)}` : 'Awaiting sync'}</span>
      <button className="icon-button" aria-label="Help"><CircleHelp size={18} /></button>
      <button className="icon-button notification" aria-label="Notifications"><Bell size={18} /><i /></button>
      <div className="user-menu"><div className="avatar">OP</div><span>Operator</span><ChevronDown size={14} /></div>
    </div>
  </header>
}
