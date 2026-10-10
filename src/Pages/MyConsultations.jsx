
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function MyConsultations() {
  const [consultations, setConsultations] = useState([])
  const [message, setMessage] = useState('Loading consultations...')
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    const loadConsultations = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        setMessage('Please login again.')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          'https://smarthealth-backend-9tf6.onrender.com/api/consultations/patient',
          {
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
            `Unable to load consultations. Error ${response.status}.`
          )
        }

        const data = await response.json()

        setConsultations(data)
        setMessage(
          data.length === 0
            ? 'No consultation records available.'
            : ''
        )
      } catch (error) {
        console.error(error)
        setMessage(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadConsultations()
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
            onClick={() => navigate('/my-appointments')}
          >
            My Appointments
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>My Consultations</h1>

          <p>
            View your completed consultation records and medical information.
          </p>

        </div>

        {loading && (
          <div className="card">

            <div className="loading-state">
              Loading consultations...
            </div>

          </div>
        )}

        {!loading && consultations.length === 0 && (
          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                🩺
              </div>

              <h3>No Consultation Records</h3>

              <p>
                Your consultation details will appear here after your
                doctor completes an appointment.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </button>

            </div>

          </div>
        )}

        {!loading && consultations.length > 0 && (
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
                  MY CONSULTATIONS
                </div>

                <div
                  style={{
                    fontSize: '30px',
                    fontWeight: '700',
                    color: '#0b8f8f',
                    marginTop: '5px'
                  }}
                >
                  {consultations.length}
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
                🩺
              </div>

            </div>

            <div
              style={{
                display: 'grid',
                gap: '20px'
              }}
            >

              {consultations.map(consultation => (

                <div
                  className="card"
                  key={consultation.id}
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
                      flexWrap: 'wrap',
                      marginBottom: '22px'
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
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            background: '#e8f7f7',
                            fontSize: '19px'
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
                          Consultation #{consultation.id}
                        </h2>

                      </div>

                      <p
                        className="card-subtitle"
                        style={{
                          marginLeft: '50px'
                        }}
                      >
                        Appointment #
                        {consultation.appointment?.id ||
                          'Not available'}
                      </p>

                    </div>

                    <span className="status-badge status-confirmed">
                      Completed
                    </span>

                  </div>

                  {consultation.appointment && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns:
                          'repeat(auto-fit, minmax(160px, 1fr))',
                        gap: '12px',
                        marginBottom: '22px'
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
                          Doctor
                        </span>

                        <strong
                          style={{
                            display: 'block',
                            marginTop: '6px',
                            color: '#123b4a'
                          }}
                        >
                          {consultation.appointment.doctor?.name ||
                            'Not available'}
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
                            consultation.appointment.appointmentDate
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
                            consultation.appointment.appointmentTime
                          )}
                        </strong>

                      </div>

                    </div>
                  )}

                  <div className="consultation-details">

                    <div className="detail-box">

                      <span className="info-label">
                        Diagnosis
                      </span>

                      <p>
                        {consultation.diagnosis ||
                          'Not provided'}
                      </p>

                    </div>

                    <div className="detail-box">

                      <span className="info-label">
                        Notes
                      </span>

                      <p>
                        {consultation.notes ||
                          'No notes provided'}
                      </p>

                    </div>

                    <div className="detail-box">

                      <span className="info-label">
                        Prescription
                      </span>

                      <p>
                        {consultation.prescription ||
                          'No prescription provided'}
                      </p>

                    </div>

                    <div className="detail-box">

                      <span className="info-label">
                        Decision
                      </span>

                      <p>
                        {consultation.decision ||
                          'No decision recorded'}
                      </p>

                    </div>

                    <div className="detail-box">

                      <span className="info-label">
                        Specialist
                      </span>

                      <p>
                        {consultation.specialist ||
                          'No specialist referral'}
                      </p>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </>
        )}

        {!loading && message && consultations.length > 0 && (
          <div className="message message-info">
            {message}
          </div>
        )}

      </main>

    </div>
  )
}

export default MyConsultations

