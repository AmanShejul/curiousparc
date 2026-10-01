export default function LoadingState({ label = 'Loading data' }) {
  return <div className="loading-state"><span className="loading-dot" />{label}</div>
}
