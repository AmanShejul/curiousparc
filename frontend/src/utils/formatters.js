export const formatTime = (date) => new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit' }).format(new Date(date))

export const formatDateTime = (date) => new Intl.DateTimeFormat('en', {
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
}).format(new Date(date))

export const formatNumber = (number) => new Intl.NumberFormat('en-US').format(number)
