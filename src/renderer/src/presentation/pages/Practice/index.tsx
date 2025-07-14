import { useLocation } from 'react-router-dom'

export default function PracticePage() {
  const location = useLocation()
  const type = location.pathname.split('/')[2] || ''

  let title = ''
  switch (type) {
    case 'reading':
      title = 'Practice: Reading'
      break
    case 'listening':
      title = 'Practice: Listening'
      break
    case 'writing':
      title = 'Practice: Writing'
      break
    case 'speaking':
      title = 'Practice: Speaking'
      break
    default:
      title = 'Practice'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full p-8">
      <h1 className="text-3xl font-bold mb-4">{title}</h1>
      <p className="text-gray-500 text-lg">
        This is the <b>{type}</b> practice page.
      </p>
    </div>
  )
}
