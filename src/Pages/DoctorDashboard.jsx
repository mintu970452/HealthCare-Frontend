import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'https://smarthealth-backend-9tf6.onrender.com'

function DoctorDashboard() {
  const navigate = useNavigate()

  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState('Loading appointments...')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const token = localStorage.getItem('token')

  const loadAppointments = async () => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`${API_URL}/api/appointments/doctor`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 401 || response.status === 403) {
        setMessage('Your session is invalid or you do not have doctor access.')
        return
      }

      if (!response.ok) {
        throw new Error(`Failed to load appointments. Status: ${response.status}`)
      }

      const data = await response.json()

      setAppointments(Array.isArray(data) ? data : [])
      setMessage(
        Array.isArray(data) && data.length === 0
          ? 'No appointments found.'
          : ''
      )
    } catch (error) {
      console.error('Load appointments error:', error)
      setMessage('Unable to load appointments. Please try again.')
    } finally {
      setLoading(false)
    }
  }
useEffect(() => {
  const fetchAppointments = async () => {
    await loadAppointments()
  }

  fetchAppointments()
}, [])
  

  const updateStatus = async (id, action) => {
    if (!token) {
      navigate('/login')
      return
    }

    try {
      setUpdatingId(id)
      setMessage('')

      const response = await fetch(
        `${API_URL}/api/appointments/${id}/${action}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      const responseText = await response.text()

      if (!response.ok) {
        throw new Error(
          responseText || `Unable to update appointment. Status: ${response.status}`
        )
      }

      setMessage(responseText || 'Appointment updated successfully.')

      await loadAppointments()
    } catch (error) {
      console.error('Update appointment error:', error)
      setMessage(error.message || 'Unable to update appointment.')
    } finally {
      setUpdatingId(null)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const getStatusStyle = (status) => {
    const normalizedStatus = (status || '').toLowerCase()

    if (normalizedStatus === 'confirmed') {
      return {
        backgroundColor: '#dcfce7',
        color: '#166534',
      }
    }

    if (normalizedStatus === 'completed') {
      return {
        backgroundColor: '#dbeafe',
        color: '#1d4ed8',
      }
    }

    if (normalizedStatus === 'cancelled') {
      return {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
      }
    }

    return {
      backgroundColor: '#fef3c7',
      color: '#92400e',
    }
  }

  const formatDate = (date) => {
    if (!date) return 'Not available'

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return date
    }

    return parsedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatTime = (time) => {
    if (!time) return 'Not available'

    const parts = String(time).split(':')
    const hours = Number(parts[0])
    const minutes = parts[1] || '00'

    if (Number.isNaN(hours)) return time

    const period = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12

    return `${formattedHours}:${minutes} ${period}`
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f4f7fb',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <header
        style={{
          backgroundColor: '#0f766e',
          color: '#ffffff',
          padding: '20px 6%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '15px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: '25px' }}>
            Smart Healthcare
          </h1>

          <p style={{ margin: '6px 0 0', fontSize: '14px' }}>
            Doctor Dashboard
          </p>
        </div>

        <button
          onClick={logout}
          style={{
            backgroundColor: '#ffffff',
            color: '#0f766e',
            border: 'none',
            borderRadius: '6px',
            padding: '10px 18px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </header>

      <main
        style={{
          maxWidth: '1200px',
          margin: '30px auto',
          padding: '0 20px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px',
            marginBottom: '25px',
          }}
        >
          <div>
            <h2 style={{ color: '#163047', marginBottom: '8px' }}>
              Manage Appointments
            </h2>

            <p style={{ color: '#64748b', margin: 0 }}>
              View patient appointments and update their status.
            </p>
          </div>

          <button
            onClick={loadAppointments}
            disabled={loading}
            style={{
              backgroundColor: '#0f766e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '11px 18px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            Refresh
          </button>
        </div>

        {message && (
          <div
            role="status"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #dbe4ee',
              borderRadius: '8px',
              padding: '15px',
              marginBottom: '20px',
              color: '#334155',
              overflowWrap: 'anywhere',
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '18px',
            marginBottom: '25px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ color: '#64748b', margin: '0 0 10px' }}>
              Total Appointments
            </p>

            <h2 style={{ color: '#0f766e', margin: 0, fontSize: '30px' }}>
              {appointments.length}
            </h2>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ color: '#64748b', margin: '0 0 10px' }}>
              Confirmed
            </p>

            <h2 style={{ color: '#15803d', margin: 0, fontSize: '30px' }}>
              {
                appointments.filter(
                  (appointment) =>
                    (appointment.status || '').toLowerCase() === 'confirmed'
                ).length
              }
            </h2>
          </div>

          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '10px',
              padding: '22px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <p style={{ color: '#64748b', margin: '0 0 10px' }}>
              Pending
            </p>

            <h2 style={{ color: '#b45309', margin: 0, fontSize: '30px' }}>
              {
                appointments.filter(
                  (appointment) =>
                    (appointment.status || '').toLowerCase() === 'booked'
                ).length
              }
            </h2>
          </div>
        </div>

        {appointments.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {appointments.map((appointment) => {
              const status = (appointment.status || '').toLowerCase()
              const isUpdating = updatingId === appointment.id

              return (
                <article
                  key={appointment.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    padding: '22px',
                    boxShadow: '0 3px 12px rgba(0,0,0,0.06)',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '10px',
                      marginBottom: '18px',
                    }}
                  >
                    <h3
                      style={{
                        margin: 0,
                        color: '#163047',
                        fontSize: '19px',
                      }}
                    >
                      Appointment #{appointment.id}
                    </h3>

                    <span
                      style={{
                        ...getStatusStyle(appointment.status),
                        padding: '6px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {appointment.status || 'Unknown'}
                    </span>
                  </div>

                  <div style={{ color: '#475569', lineHeight: 1.9 }}>
                    <p style={{ margin: '6px 0' }}>
                      <strong>Patient ID:</strong>{' '}
                      {appointment.patientId ?? 'Not available'}
                    </p>

                    <p style={{ margin: '6px 0' }}>
                      <strong>Doctor:</strong>{' '}
                      {appointment.doctorName || 'Not available'}
                    </p>

                    <p style={{ margin: '6px 0' }}>
                      <strong>Date:</strong>{' '}
                      {formatDate(appointment.appointmentDate)}
                    </p>

                    <p style={{ margin: '6px 0' }}>
                      <strong>Time:</strong>{' '}
                      {formatTime(appointment.appointmentTime)}
                    </p>

                    <p style={{ margin: '6px 0' }}>
                      <strong>Symptoms:</strong>{' '}
                      {appointment.symptoms || 'Not provided'}
                    </p>
                  </div>

                  {status === 'booked' && (
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        marginTop: '20px',
                      }}
                    >
                      <button
                        onClick={() =>
                          updateStatus(appointment.id, 'confirm')
                        }
                        disabled={isUpdating}
                        style={{
                          flex: 1,
                          backgroundColor: '#15803d',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '11px',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          opacity: isUpdating ? 0.6 : 1,
                        }}
                      >
                        {isUpdating ? 'Updating...' : 'Confirm'}
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(appointment.id, 'cancel')
                        }
                        disabled={isUpdating}
                        style={{
                          flex: 1,
                          backgroundColor: '#dc2626',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '11px',
                          cursor: isUpdating ? 'not-allowed' : 'pointer',
                          opacity: isUpdating ? 0.6 : 1,
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {status === 'confirmed' && (
                    <button
                      onClick={() =>
                        updateStatus(appointment.id, 'complete')
                      }
                      disabled={isUpdating}
                      style={{
                        width: '100%',
                        marginTop: '20px',
                        backgroundColor: '#2563eb',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '12px',
                        cursor: isUpdating ? 'not-allowed' : 'pointer',
                        opacity: isUpdating ? 0.6 : 1,
                      }}
                    >
                      {isUpdating ? 'Updating...' : 'Mark as Completed'}
                    </button>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

export default DoctorDashboard