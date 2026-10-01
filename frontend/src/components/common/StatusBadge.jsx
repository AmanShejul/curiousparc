import { Circle } from 'lucide-react'
import { STATUS_COLORS } from '../../utils/constants'

export default function StatusBadge({ children, tone, dot = true }) {
  const color = tone || STATUS_COLORS[String(children).toLowerCase()] || 'slate'
  return <span className={`status-badge status-${color}`}>{dot && <Circle size={7} fill="currentColor" />}{children}</span>
}
