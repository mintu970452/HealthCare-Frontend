
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token')
  const userRole = localStorage.getItem('role')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (role && userRole !== role) {
    if (userRole === 'PATIENT') {
      return <Navigate to="/dashboard" replace />
    }

    if (userRole === 'DOCTOR') {
      return <Navigate to="/doctor-dashboard" replace />
    }

    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute

