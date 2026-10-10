
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Consultation() {
  const [appointments, setAppointments] = useState([])
  const [appointmentId, setAppointmentId] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [prescription, setPrescription] = useState('')
  const [decision, setDecision] = useState('')
  const [specialist, setSpecialist] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

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
          'https://smarthealth-backend-9tf6.onrender.com/api/appointments/doctor',
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
            `Unable to load appointments. Error ${response.status}.`
          )
        }

        const data = await response.json()

        const activeAppointments = data.filter(
          appointment =>
            appointment.status &&
            (appointment.status.toLowerCase() === 'confirmed' ||
              appointment.status.toLowerCase() === 'booked')
        )

        setAppointments(activeAppointments)
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

  const saveConsultation = async e => {
    e.preventDefault()

    if (!appointmentId) {
      setMessage('Please select an appointment.')
      return
    }

    if (saving) {
      return
    }

    setSaving(true)
    setMessage('Saving consultation...')

    const token = localStorage.getItem('token')

    const consultation = {
      appointment: {
        id: Number(appointmentId)
      },
      diagnosis,
      notes,
      prescription,
      decision,
      specialist
    }

    try {
      const response = await fetch(
        'https://smarthealth-backend-9tf6.onrender.com/api/consultations',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(consultation)
        }
      )

      const data = await response.text()

      if (response.status === 401) {
        setMessage('Session expired. Please login again.')
        return
      }

      if (response.status === 403) {
        setMessage(
          data || 'You are not allowed to add this consultation.'
        )
        return
      }

      if (!response.ok) {
        setMessage(
          data || `Unable to save consultation. Error ${response.status}.`
        )
        return
      }

      setMessage('Consultation saved. Completing appointment...')

      const completeResponse = await fetch(
        `https://smarthealth-backend-9tf6.onrender.com/api/appointments/${appointmentId}/complete`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const completeData = await completeResponse.text()

      if (completeResponse.status === 401) {
        setMessage('Consultation saved, but session expired.')
        return
      }

      if (completeResponse.status === 403) {
        setMessage(
          'Consultation saved, but you are not allowed to complete this appointment.'
        )
        return
      }

      if (!completeResponse.ok) {
        setMessage(
          `Consultation saved, but appointment could not be completed. ${completeData}`
        )
        return
      }

      setMessage(
        'Consultation saved and appointment completed successfully.'
      )

      setAppointments(prev =>
        prev.filter(
          appointment => appointment.id !== Number(appointmentId)
        )
      )

      setAppointmentId('')
      setDiagnosis('')
      setNotes('')
      setPrescription('')
      setDecision('')
      setSpecialist('')
    } catch (error) {
      console.error(error)
      setMessage('Unable to connect to the server.')
    } finally {
      setSaving(false)
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
            onClick={() => navigate('/doctor-dashboard')}
          >
            Doctor Dashboard
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>Doctor Consultation</h1>

          <p>
            Record consultation details for your patient's appointment.
          </p>

        </div>

        {loading && (
          <div className="card">

            <div className="loading-state">
              Loading appointments...
            </div>

          </div>
        )}

        {!loading && appointments.length === 0 && !message && (
          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                🩺
              </div>

              <h3>No Active Appointments</h3>

              <p>
                There are no booked or confirmed appointments available
                for consultation.
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

        {!loading && appointments.length > 0 && (
          <div
            className="card"
            style={{
              maxWidth: '850px',
              margin: '0 auto',
              padding: '32px'
            }}
          >

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                marginBottom: '10px'
              }}
            >

              <div
                style={{
                  width: '48px',
                  height: '48px',
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

              <div>

                <h2
                  className="card-title"
                  style={{
                    marginBottom: '3px'
                  }}
                >
                  Consultation Details
                </h2>

                <p
                  className="card-subtitle"
                  style={{
                    marginBottom: 0
                  }}
                >
                  Enter the patient's consultation information.
                </p>

              </div>

            </div>

            <form
              onSubmit={saveConsultation}
              style={{
                marginTop: '28px'
              }}
            >

              <div className="form-group">

                <label>Appointment</label>

                <select
                  value={appointmentId}
                  onChange={e => {
                    setAppointmentId(e.target.value)
                    setMessage('')
                  }}
                  required
                  disabled={saving}
                >

                  <option value="">
                    Select Appointment
                  </option>

                  {appointments.map(appointment => (

                    <option
                      key={appointment.id}
                      value={appointment.id}
                    >
                      Appointment #{appointment.id}
                      {' - '}
                      Patient ID: {appointment.patientId}
                      {' - '}
                      {formatDate(appointment.appointmentDate)}
                      {' '}
                      {convertTo12Hour(
                        appointment.appointmentTime
                      )}
                    </option>

                  ))}

                </select>

              </div>

              <div className="form-group">

                <label>Diagnosis</label>

                <textarea
                  rows="3"
                  value={diagnosis}
                  onChange={e => {
                    setDiagnosis(e.target.value)
                    setMessage('')
                  }}
                  placeholder="Enter diagnosis"
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label>Notes</label>

                <textarea
                  rows="4"
                  value={notes}
                  onChange={e => {
                    setNotes(e.target.value)
                    setMessage('')
                  }}
                  placeholder="Enter consultation notes"
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label>Prescription</label>

                <textarea
                  rows="4"
                  value={prescription}
                  onChange={e => {
                    setPrescription(e.target.value)
                    setMessage('')
                  }}
                  placeholder="Enter prescription details"
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label>Decision</label>

                <select
                  value={decision}
                  onChange={e => {
                    setDecision(e.target.value)
                    setMessage('')
                  }}
                  disabled={saving}
                >

                  <option value="">
                    Select Decision
                  </option>

                  <option value="Treatment Started">
                    Treatment Started
                  </option>

                  <option value="Follow-up Required">
                    Follow-up Required
                  </option>

                  <option value="Specialist Referral">
                    Specialist Referral
                  </option>

                  <option value="No Further Action">
                    No Further Action
                  </option>

                </select>

              </div>

              <div className="form-group">

                <label>Specialist</label>

                <select
                  value={specialist}
                  onChange={e => {
                    setSpecialist(e.target.value)
                    setMessage('')
                  }}
                  disabled={saving}
                >

                  <option value="">
                    Select Specialist
                  </option>

                  <option value="Cardiologist">
                    Cardiologist
                  </option>

                  <option value="Neurologist">
                    Neurologist
                  </option>

                  <option value="Gastroenterologist">
                    Gastroenterologist
                  </option>

                  <option value="Dermatologist">
                    Dermatologist
                  </option>

                  <option value="Orthopedic Specialist">
                    Orthopedic Specialist
                  </option>

                  <option value="General Physician">
                    General Physician
                  </option>

                  <option value="Psychiatrist">
                    Psychiatrist
                  </option>

                  <option value="ENT Specialist">
                    ENT Specialist
                  </option>

                  <option value="Ophthalmologist">
                    Ophthalmologist
                  </option>

                  <option value="Gynecologist">
                    Gynecologist
                  </option>

                  <option value="Pediatrician">
                    Pediatrician
                  </option>

                </select>

              </div>

              {message && (
                <div
                  className={
                    message.includes('successfully')
                      ? 'message message-success'
                      : 'message message-info'
                  }
                  style={{
                    marginTop: '20px'
                  }}
                >
                  {message}
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap',
                  marginTop: '26px',
                  paddingTop: '22px',
                  borderTop: '1px solid #edf2f5'
                }}
              >

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving Consultation...'
                    : 'Save Consultation'}
                </button>

                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() =>
                    navigate('/doctor-dashboard')
                  }
                  disabled={saving}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>
        )}

        {!loading && appointments.length === 0 && message && (
          <div className="card">

            <div className="empty-state">

              <div className="empty-state-icon">
                🩺
              </div>

              <h3>No Active Appointments</h3>

              <p>
                {message}
              </p>

              <button
                className="btn btn-primary"
                onClick={() =>
                  navigate('/doctor-dashboard')
                }
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

export default Consultation
