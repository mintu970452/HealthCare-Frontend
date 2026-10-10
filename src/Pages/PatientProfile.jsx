
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function PatientProfile() {
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState('Loading...')

  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setMessage('Please login again.')
      return
    }

    fetch('http://localhost:8080/api/users/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error ${response.status}`)
        }

        return response.json()
      })
      .then(data => {
        setUser(data)
        setMessage('')
      })
      .catch(error => {
        console.error(error)
        setMessage(error.message)
      })
  }, [])

  return (
    <div className="dashboard-container">

      <nav className="navbar">

        <div className="navbar-brand">
          <div className="navbar-icon">+</div>
          <span>Smart Healthcare</span>
        </div>

        <div className="navbar-actions">

          <button
            className="btn btn-outline"
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>My Profile</h1>

          <p>
            View your personal account information and profile details.
          </p>

        </div>

        {message && !user && (
          <div className="message message-info">
            {message}
          </div>
        )}

        {user && (
          <div
            className="card"
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              padding: '32px'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                paddingBottom: '25px',
                marginBottom: '25px',
                borderBottom: '1px solid #edf2f5'
              }}
            >

              <div
                style={{
                  width: '72px',
                  height: '72px',
                  flexShrink: 0,
                  borderRadius: '50%',
                  background: '#e8f7f7',
                  color: '#0b8f8f',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  border: '5px solid #f4fbfb'
                }}
              >
                {user.name
                  ? user.name.charAt(0).toUpperCase()
                  : 'P'}
              </div>

              <div>

                <h2
                  style={{
                    margin: 0,
                    marginBottom: '6px',
                    color: '#123b4a',
                    fontSize: '24px'
                  }}
                >
                  {user.name || 'Patient'}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: '#64748b',
                    fontSize: '14px'
                  }}
                >
                  Patient Account
                </p>

              </div>

            </div>

            <div
              style={{
                display: 'grid',
                gap: '14px'
              }}
            >

              <div className="profile-item">

                <div className="profile-label">
                  Full Name
                </div>

                <div className="profile-value">
                  {user.name || 'Not available'}
                </div>

              </div>

              <div className="profile-item">

                <div className="profile-label">
                  Email Address
                </div>

                <div className="profile-value">
                  {user.email || 'Not available'}
                </div>

              </div>

              <div className="profile-item">

                <div className="profile-label">
                  Account Type
                </div>

                <div className="profile-value">
                  <span
                    className="status-badge status-confirmed"
                  >
                    {user.role || 'PATIENT'}
                  </span>
                </div>

              </div>

            </div>

            <div
              style={{
                marginTop: '28px',
                paddingTop: '22px',
                borderTop: '1px solid #edf2f5',
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}
            >

              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>

            </div>

          </div>
        )}

      </main>

    </div>
  )
}

export default PatientProfile

