
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function DoctorConsultationHistory() {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [, setMessage] = useState('Loading consultation history...')

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
          'http://localhost:8080/api/consultations/doctor',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (response.status === 401) {
          throw new Error('Session expired. Please login again.')
        }

        if (response.status === 403) {
          throw new Error(
            'You are not allowed to view consultation history.'
          )
        }

        if (!response.ok) {
          throw new Error(
            `Unable to load consultation history. Error ${response.status}.`
          )
        }

        const data = await response.json()

        setConsultations(data)

        if (data.length === 0) {
          setMessage('No completed consultations found.')
        } else {
          setMessage('')
        }
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
            onClick={() => navigate('/doctor-dashboard')}
          >
            Doctor Dashboard
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>Consultation History</h1>

          <p>
            Review completed patient consultations and medical records.
          </p>

        </div>

        {loading && (
          <div className="card">

            <div className="loading-state">
              Loading consultation history...
            </div>

          </div>
        )}

        {!loading && consultations.length === 0 && (
          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                🩺
              </div>

              <h3>No Consultation History</h3>

              <p>
                Completed consultation records will appear here after
                you complete patient consultations.
              </p>

              <button
                className="btn btn-primary"
                onClick={() => navigate('/doctor-dashboard')}
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
                  COMPLETED CONSULTATIONS
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
                ✓
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

                    <span className="status-badge status-completed">
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
                          Patient ID
                        </span>

                        <strong
                          style={{
                            display: 'block',
                            marginTop: '6px',
                            color: '#123b4a'
                          }}
                        >
                          {consultation.appointment.patient?.id ||
                            consultation.appointment.patientId ||
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

      </main>

    </div>
  )
}

export default DoctorConsultationHistory

