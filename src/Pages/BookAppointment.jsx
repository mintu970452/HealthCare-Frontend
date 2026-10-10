
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function BookAppointment() {
  const [doctors, setDoctors] = useState([])
  const [doctorId, setDoctorId] = useState('')
  const [appointmentDate, setAppointmentDate] = useState('')
  const [appointmentTime, setAppointmentTime] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  const selectedDoctor = doctors.find(
    doctor => doctor.id === Number(doctorId)
  )

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch('http://localhost:8080/api/doctors', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        if (response.status === 401) {
          throw new Error('Please login again.')
        }

        if (!response.ok) {
          throw new Error('Unable to load doctors.')
        }

        return response.json()
      })
      .then(data => {
        setDoctors(data)
      })
      .catch(error => {
        setMessage(error.message)
      })
  }, [])

  const convertTo12Hour = time => {
    if (!time) return ''

    const [hours, minutes] = time.split(':')
    const hour = Number(hours)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12

    return `${displayHour}:${minutes} ${period}`
  }

  const generateTimeSlots = () => {
    if (
      !selectedDoctor ||
      !selectedDoctor.shiftStart ||
      !selectedDoctor.shiftEnd
    ) {
      return []
    }

    const slots = []

    const [startHour, startMinute] =
      selectedDoctor.shiftStart.split(':').map(Number)

    const [endHour, endMinute] =
      selectedDoctor.shiftEnd.split(':').map(Number)

    let currentMinutes = startHour * 60 + startMinute
    const endMinutes = endHour * 60 + endMinute

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60)
      const minutes = currentMinutes % 60

      const time =
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

      slots.push(time)

      currentMinutes += 30
    }

    return slots
  }

  const handleDoctorChange = e => {
    setDoctorId(e.target.value)
    setAppointmentTime('')
    setMessage('')
  }

  const handleBookAppointment = async e => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!doctorId) {
      setMessage('Please select a doctor.')
      return
    }

    if (!appointmentDate) {
      setMessage('Please select an appointment date.')
      return
    }

    if (!appointmentTime) {
      setMessage('Please select an appointment time.')
      return
    }

    if (appointmentDate < today) {
      setMessage('Please select today or a future date.')
      return
    }

    if (appointmentDate === today) {
      const now = new Date()

      const currentHours = String(now.getHours()).padStart(2, '0')
      const currentMinutes = String(now.getMinutes()).padStart(2, '0')
      const currentTime = `${currentHours}:${currentMinutes}`

      if (appointmentTime <= currentTime) {
        setMessage('Please select a future time for today.')
        return
      }
    }

    setIsSubmitting(true)
    setMessage('Booking appointment...')

    const token = localStorage.getItem('token')

    const appointment = {
      doctor: {
        id: Number(doctorId)
      },
      appointmentDate,
      appointmentTime,
      status: 'Booked'
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/appointments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(appointment)
        }
      )

      const data = await response.text()

      if (response.status === 400) {
        setMessage(data || 'This appointment slot is already booked.')
        return
      }

      if (response.status === 401) {
        setMessage('Session expired. Please login again.')
        return
      }

      if (response.status === 403) {
        setMessage('You are not allowed to book an appointment.')
        return
      }

      if (!response.ok) {
        setMessage(
          `Unable to book appointment. Error ${response.status}.`
        )
        return
      }

      setMessage('Appointment booked successfully!')

      setDoctorId('')
      setAppointmentDate('')
      setAppointmentTime('')
    } catch {
      setMessage('Unable to connect to the server. Please try again.')
    } finally {
      setIsSubmitting(false)
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
            onClick={() => navigate('/my-appointments')}
          >
            My Appointments
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <div className="page-header">

          <h1>Book an Appointment</h1>

          <p>
            Choose your doctor, preferred date and available time slot.
          </p>

        </div>

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
              marginBottom: '8px'
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
                fontSize: '23px'
              }}
            >
              📅
            </div>

            <div>

              <h2
                className="card-title"
                style={{
                  marginBottom: '3px'
                }}
              >
                Appointment Details
              </h2>

              <p
                className="card-subtitle"
                style={{
                  marginBottom: 0
                }}
              >
                Select your preferred doctor and appointment time.
              </p>

            </div>

          </div>

          <form
            onSubmit={handleBookAppointment}
            style={{
              marginTop: '28px'
            }}
          >

            <div className="form-group">

              <label>Doctor</label>

              <select
                value={doctorId}
                onChange={handleDoctorChange}
                required
                disabled={isSubmitting}
              >
                <option value="">
                  Select Doctor
                </option>

                {doctors.map(doctor => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.name}
                    {doctor.specialization
                      ? ` - ${doctor.specialization}`
                      : ''}
                  </option>
                ))}

              </select>

            </div>

            {selectedDoctor && (
              <div
                style={{
                  background: '#f0fafa',
                  border: '1px solid #d7eeee',
                  borderRadius: '12px',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}
                >

                  <div>

                    <div
                      style={{
                        color: '#123b4a',
                        fontSize: '18px',
                        fontWeight: '700',
                        marginBottom: '5px'
                      }}
                    >
                      {selectedDoctor.name}
                    </div>

                    {selectedDoctor.specialization && (
                      <div
                        style={{
                          color: '#64748b',
                          fontSize: '14px'
                        }}
                      >
                        {selectedDoctor.specialization}
                      </div>
                    )}

                  </div>

                  <div
                    style={{
                      padding: '7px 11px',
                      borderRadius: '20px',
                      background: '#dff4ed',
                      color: '#16804b',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    Available
                  </div>

                </div>

                <div
                  style={{
                    marginTop: '16px',
                    paddingTop: '14px',
                    borderTop: '1px solid #d7eeee',
                    color: '#0b8f8f',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  🕐 Working Hours:{' '}
                  {convertTo12Hour(selectedDoctor.shiftStart)}
                  {' - '}
                  {convertTo12Hour(selectedDoctor.shiftEnd)}
                </div>

              </div>
            )}

            <div className="form-group">

              <label>Appointment Date</label>

              <input
                type="date"
                value={appointmentDate}
                min={today}
                onChange={e => {
                  setAppointmentDate(e.target.value)
                  setMessage('')
                }}
                required
                disabled={isSubmitting}
              />

            </div>

            <div className="form-group">

              <label>Appointment Time</label>

              <select
                value={appointmentTime}
                onChange={e => {
                  setAppointmentTime(e.target.value)
                  setMessage('')
                }}
                required
                disabled={!selectedDoctor || isSubmitting}
              >

                <option value="">
                  {selectedDoctor
                    ? 'Select Time Slot'
                    : 'Select a doctor first'}
                </option>

                {generateTimeSlots().map(time => (
                  <option
                    key={time}
                    value={time}
                  >
                    {convertTo12Hour(time)}
                  </option>
                ))}

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
                marginTop: '26px',
                paddingTop: '22px',
                borderTop: '1px solid #edf2f5',
                flexWrap: 'wrap'
              }}
            >

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Booking...'
                  : 'Confirm Appointment'}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>

        <div
          className="card"
          style={{
            maxWidth: '850px',
            margin: '25px auto 0'
          }}
        >

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '18px'
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
                background: '#f1f5f9',
                fontSize: '20px'
              }}
            >
              ℹ️
            </div>

            <div>

              <h3
                className="card-title"
                style={{
                  marginBottom: '3px'
                }}
              >
                Appointment Information
              </h3>

              <p
                className="card-subtitle"
                style={{
                  marginBottom: 0
                }}
              >
                Important information before booking.
              </p>

            </div>

          </div>

          <div
            style={{
              display: 'grid',
              gap: '10px'
            }}
          >

            <div
              style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '9px',
                color: '#475569',
                fontSize: '14px'
              }}
            >
              • Appointments are available in 30-minute slots.
            </div>

            <div
              style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '9px',
                color: '#475569',
                fontSize: '14px'
              }}
            >
              • You can select today or a future date.
            </div>

            <div
              style={{
                padding: '12px 14px',
                background: '#f8fafc',
                borderRadius: '9px',
                color: '#475569',
                fontSize: '14px'
              }}
            >
              • Already booked slots cannot be booked again.
            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

export default BookAppointment

