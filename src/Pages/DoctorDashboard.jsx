
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([])
  const [message, setMessage] = useState('Loading...')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const loadAppointments = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setMessage('Please login again.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          'http://localhost:8080/api/appointments/doctor',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status === 401) {
          throw new Error('Session expired. Please login again.')
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load appointments. Error ${response.status}.`
          )
        }

        const data = await response.json()

        setAppointments(data)
        setMessage('')
      } catch (error) {
        console.error(error)
        setMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadAppointments()
  }, [])

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${id}/${status}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(data || 'Unable to update appointment.')
        return
      }

      setMessage(`Appointment ${status} successfully.`)

      window.location.reload()
    } catch (error) {
      console.error(error)
      setMessage('Unable to connect to the server.')
    }
  }

  const formatDate = date => {
    if (!date) return 'Not available'

    const [year, month, day] = date.split('-')

    return `${day}-${month}-${year}`
  }

  const convertTo12Hour = time => {
    if (!time) return 'Not available'

    const [hours, minutes] = time.split(':')
    const hour = Number(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12

    return `${displayHour}:${minutes} ${period}`
  }

  const getStatusClass = status => {
    if (!status) {
      return 'status-badge status-booked'
    }

    const value = status.toLowerCase()

    if (value === 'confirmed') {
      return 'status-badge status-confirmed'
    }

    if (value === 'completed') {
      return 'status-badge status-completed'
    }

    if (value === 'cancelled') {
      return 'status-badge status-cancelled'
    }

    return 'status-badge status-booked'
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')

    navigate('/login')
  }

  const activeAppointments = appointments.filter(appointment => {
    const status = appointment.status?.toLowerCase()

    return status === 'booked' || status === 'confirmed'
  })

  const historyAppointments = appointments.filter(appointment => {
    const status = appointment.status?.toLowerCase()

    return status === 'completed' || status === 'cancelled'
  })

  const completedCount = historyAppointments.filter(
    appointment =>
      appointment.status?.toLowerCase() === 'completed'
  ).length

  const cancelledCount = historyAppointments.filter(
    appointment =>
      appointment.status?.toLowerCase() === 'cancelled'
  ).length

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
            onClick={() => navigate('/consultation')}
          >
            Consultation
          </button>

          <button
            className="btn btn-outline"
            onClick={() =>
              navigate('/doctor-consultation-history')
            }
          >
            Consultation History
          </button>

          <button
            className="btn btn-outline"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>

          <button
            className="btn btn-outline"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>Doctor Dashboard</h1>

          <p>
            Manage your appointments and patient consultations.
          </p>

        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '18px',
            marginBottom: '30px'
          }}
        >

          <div className="card">
            <div
              style={{
                fontSize: '28px',
                marginBottom: '10px'
              }}
            >
              📅
            </div>

            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              ACTIVE APPOINTMENTS
            </div>

            <div
              style={{
                fontSize: '30px',
                fontWeight: '700',
                color: '#0b8f8f',
                marginTop: '6px'
              }}
            >
              {activeAppointments.length}
            </div>
          </div>

          <div className="card">
            <div
              style={{
                fontSize: '28px',
                marginBottom: '10px'
              }}
            >
              ✓
            </div>

            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              COMPLETED
            </div>

            <div
              style={{
                fontSize: '30px',
                fontWeight: '700',
                color: '#16804b',
                marginTop: '6px'
              }}
            >
              {completedCount}
            </div>
          </div>

          <div className="card">
            <div
              style={{
                fontSize: '28px',
                marginBottom: '10px'
              }}
            >
              ✕
            </div>

            <div
              style={{
                color: '#64748b',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '0.5px'
              }}
            >
              CANCELLED
            </div>

            <div
              style={{
                fontSize: '30px',
                fontWeight: '700',
                color: '#c0392b',
                marginTop: '6px'
              }}
            >
              {cancelledCount}
            </div>
          </div>

        </div>

        {message && !loading && (
          <div
            className={
              message.includes('successfully')
                ? 'message message-success'
                : 'message message-info'
            }
          >
            {message}
          </div>
        )}

        {loading && (
          <div className="card">
            <div className="loading-state">
              Loading appointments...
            </div>
          </div>
        )}

        {!loading && (
          <>

            <div className="card">

              <div className="appointment-header">

                <div>
                  <h2 className="card-title">
                    Active Appointments
                  </h2>

                  <p className="card-subtitle">
                    Manage your currently booked and confirmed appointments.
                  </p>
                </div>

                <span className="status-badge status-confirmed">
                  {activeAppointments.length} Active
                </span>

              </div>

              {activeAppointments.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-state-icon">
                    📅
                  </div>

                  <h3>No Active Appointments</h3>

                  <p>
                    You currently have no active patient appointments.
                  </p>

                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: '18px'
                  }}
                >

                  {activeAppointments.map(appointment => (

                    <div
                      key={appointment.id}
                      className="appointment-card"
                    >

                      <div className="appointment-header">

                        <div>

                          <h3
                            style={{
                              margin: 0,
                              color: '#123b4a',
                              fontSize: '19px'
                            }}
                          >
                            👤 Patient #{appointment.patientId}
                          </h3>

                          <p
                            style={{
                              margin: '6px 0 0',
                              color: '#64748b',
                              fontSize: '13px'
                            }}
                          >
                            Appointment #{appointment.id}
                          </p>

                        </div>

                        <span
                          className={getStatusClass(
                            appointment.status
                          )}
                        >
                          {appointment.status}
                        </span>

                      </div>

                      <div className="appointment-details">

                        <div className="appointment-detail">

                          <span>DATE</span>

                          <strong>
                            {formatDate(
                              appointment.appointmentDate
                            )}
                          </strong>

                        </div>

                        <div className="appointment-detail">

                          <span>TIME</span>

                          <strong>
                            {convertTo12Hour(
                              appointment.appointmentTime
                            )}
                          </strong>

                        </div>

                      </div>

                      {appointment.symptoms && (
                        <div
                          style={{
                            marginTop: '4px',
                            padding: '14px',
                            background: '#f7fafc',
                            borderRadius: '9px'
                          }}
                        >

                          <div
                            style={{
                              color: '#64748b',
                              fontSize: '11px',
                              fontWeight: '600',
                              marginBottom: '6px'
                            }}
                          >
                            PATIENT SYMPTOMS
                          </div>

                          <div
                            style={{
                              color: '#334155',
                              fontSize: '14px',
                              lineHeight: '1.5'
                            }}
                          >
                            {appointment.symptoms}
                          </div>

                        </div>
                      )}

                      {appointment.status?.toLowerCase() === 'booked' && (
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            marginTop: '18px',
                            flexWrap: 'wrap'
                          }}
                        >

                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                'confirm'
                              )
                            }
                          >
                            Confirm
                          </button>

                          <button
                            className="btn btn-danger"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                'cancel'
                              )
                            }
                          >
                            Cancel
                          </button>

                        </div>
                      )}

                      {appointment.status?.toLowerCase() === 'confirmed' && (
                        <div
                          style={{
                            marginTop: '18px'
                          }}
                        >

                          <button
                            className="btn btn-primary"
                            onClick={() =>
                              updateStatus(
                                appointment.id,
                                'complete'
                              )
                            }
                          >
                            Mark as Completed
                          </button>

                        </div>
                      )}

                    </div>

                  ))}

                </div>
              )}

            </div>

            <div
              className="card"
              style={{
                marginTop: '25px'
              }}
            >

              <div className="appointment-header">

                <div>

                  <h2 className="card-title">
                    Appointment History
                  </h2>

                  <p className="card-subtitle">
                    View your completed and cancelled appointments.
                  </p>

                </div>

                <span className="status-badge status-completed">
                  {historyAppointments.length} Records
                </span>

              </div>

              {historyAppointments.length === 0 ? (
                <div className="empty-state">

                  <div className="empty-state-icon">
                    📋
                  </div>

                  <h3>No History</h3>

                  <p>
                    Completed and cancelled appointments will appear here.
                  </p>

                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gap: '12px'
                  }}
                >

                  {historyAppointments.map(appointment => (

                    <div
                      key={appointment.id}
                      style={{
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '17px',
                        background: '#f8fafc'
                      }}
                    >

                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '15px',
                          flexWrap: 'wrap'
                        }}
                      >

                        <div>

                          <div
                            style={{
                              color: '#123b4a',
                              fontWeight: '600',
                              marginBottom: '6px'
                            }}
                          >
                            Patient #{appointment.patientId}
                          </div>

                          <div
                            style={{
                              color: '#64748b',
                              fontSize: '13px'
                            }}
                          >
                            {formatDate(
                              appointment.appointmentDate
                            )}
                            {' • '}
                            {convertTo12Hour(
                              appointment.appointmentTime
                            )}
                          </div>

                        </div>

                        <span
                          className={getStatusClass(
                            appointment.status
                          )}
                        >
                          {appointment.status}
                        </span>

                      </div>

                    </div>

                  ))}

                </div>
              )}

            </div>

          </>
        )}

      </main>

    </div>
  )
}

export default DoctorDashboard
