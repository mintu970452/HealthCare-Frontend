
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyAppointments() {
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
          'http://localhost:8080/api/appointments',
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

  const cancelAppointment = async id => {
    const token = localStorage.getItem('token')

    if (
      !window.confirm(
        'Are you sure you want to cancel this appointment?'
      )
    ) {
      return
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(data || 'Unable to cancel appointment.')
        return
      }

      setMessage('Appointment cancelled successfully.')

      const refreshedResponse = await fetch(
        'http://localhost:8080/api/appointments',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (refreshedResponse.ok) {
        const refreshedData = await refreshedResponse.json()
        setAppointments(refreshedData)
      }
    } catch (error) {
      console.error(error)
      setMessage('Unable to connect to the server.')
    }
  }

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

          <button
            className="btn btn-outline"
            onClick={() => navigate('/book-appointment')}
          >
            Book Appointment
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>My Appointments</h1>

          <p>
            View and manage your upcoming and previous appointments.
          </p>

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
              Loading your appointments...
            </div>

          </div>
        )}

        {!loading && appointments.length === 0 && !message && (
          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                📅
              </div>

              <h3>No Appointments Yet</h3>

              <p>
                You haven't booked an appointment yet.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate('/book-appointment')}
              >
                Book Appointment
              </button>

            </div>

          </div>
        )}

        {!loading && appointments.length > 0 && (
          <>

            <div
              className="card"
              style={{
                marginBottom: '22px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '15px',
                flexWrap: 'wrap'
              }}
            >

              <div>

                <div
                  style={{
                    color: '#64748b',
                    fontSize: '12px',
                    fontWeight: '600',
                    letterSpacing: '0.5px'
                  }}
                >
                  TOTAL APPOINTMENTS
                </div>

                <div
                  style={{
                    fontSize: '30px',
                    fontWeight: '700',
                    color: '#0b8f8f',
                    marginTop: '5px'
                  }}
                >
                  {appointments.length}
                </div>

              </div>

              <div
                style={{
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  background: '#e8f7f7',
                  fontSize: '24px'
                }}
              >
                📅
              </div>

            </div>

            <div
              style={{
                display: 'grid',
                gap: '20px'
              }}
            >

              {appointments.map(appointment => (

                <div
                  className="card"
                  key={appointment.id}
                  style={{
                    padding: '28px'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '15px',
                      marginBottom: '22px',
                      flexWrap: 'wrap'
                    }}
                  >

                    <div>

                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '7px'
                        }}
                      >

                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            background: '#e8f7f7',
                            fontSize: '20px'
                          }}
                        >
                          🩺
                        </div>

                        <h2
                          className="card-title"
                          style={{
                            margin: 0
                          }}
                        >
                          {appointment.doctorName || 'Doctor'}
                        </h2>

                      </div>

                      <p
                        className="card-subtitle"
                        style={{
                          marginLeft: '52px'
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
                      {appointment.status || 'Booked'}
                    </span>

                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px'
                    }}
                  >

                    <div
                      style={{
                        padding: '15px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px'
                      }}
                    >

                      <span className="info-label">
                        Date
                      </span>

                      <strong
                        style={{
                          display: 'block',
                          marginTop: '6px',
                          color: '#123b4a'
                        }}
                      >
                        {formatDate(
                          appointment.appointmentDate
                        )}
                      </strong>

                    </div>

                    <div
                      style={{
                        padding: '15px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px'
                      }}
                    >

                      <span className="info-label">
                        Time
                      </span>

                      <strong
                        style={{
                          display: 'block',
                          marginTop: '6px',
                          color: '#123b4a'
                        }}
                      >
                        {convertTo12Hour(
                          appointment.appointmentTime
                        )}
                      </strong>

                    </div>

                    <div
                      style={{
                        padding: '15px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px'
                      }}
                    >

                      <span className="info-label">
                        Doctor ID
                      </span>

                      <strong
                        style={{
                          display: 'block',
                          marginTop: '6px',
                          color: '#123b4a'
                        }}
                      >
                        {appointment.doctorId || 'N/A'}
                      </strong>

                    </div>

                  </div>

                  {appointment.symptoms && (
                    <div
                      style={{
                        marginTop: '20px',
                        padding: '16px',
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px'
                      }}
                    >

                      <span
                        className="info-label"
                        style={{
                          display: 'block',
                          marginBottom: '7px'
                        }}
                      >
                        Symptoms
                      </span>

                      <p
                        style={{
                          margin: 0,
                          color: '#334155',
                          fontSize: '14px',
                          lineHeight: '1.6'
                        }}
                      >
                        {appointment.symptoms}
                      </p>

                    </div>
                  )}

                  {appointment.status &&
                    appointment.status.toLowerCase() !==
                      'cancelled' &&
                    appointment.status.toLowerCase() !==
                      'completed' && (

                      <div
                        style={{
                          marginTop: '22px',
                          paddingTop: '20px',
                          borderTop: '1px solid #edf2f5',
                          display: 'flex',
                          justifyContent: 'flex-end'
                        }}
                      >

                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            cancelAppointment(
                              appointment.id
                            )
                          }
                        >
                          Cancel Appointment
                        </button>

                      </div>

                    )}

                </div>

              ))}

            </div>

          </>
        )}

      </main>

    </div>
  )
}

export default MyAppointments

