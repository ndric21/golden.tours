import { STATUS_COLORS } from '../../data/constants'

export default function StatusBadge({ status }) {
  const classes = STATUS_COLORS[status] ?? 'bg-ink-100 text-ink-700'
  return <span className={`badge capitalize ${classes}`}>{status}</span>
}
