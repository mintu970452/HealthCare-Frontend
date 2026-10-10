
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    navigate('/login')
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
            onClick={() => navigate('/patient-profile')}
          >
            My Profile
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
          <h1>Patient Dashboard</h1>
          <p>
            Manage your appointments, consultations and healthcare
            information from one place.
          </p>
        </div>

        <div className="dashboard-grid">

          <div
            className="card dashboard-card"
            onClick={() => navigate('/patient-profile')}
          >
            <div className="dashboard-card-icon">👤</div>

            <h2>My Profile</h2>

            <p>
              View and manage your personal information.
            </p>

            <button className="btn btn-primary">
              View Profile
            </button>
          </div>

          <div
            className="card dashboard-card"
            onClick={() => navigate('/book-appointment')}
          >
            <div className="dashboard-card-icon">📅</div>

            <h2>Book Appointment</h2>

            <p>
              Schedule an appointment with a doctor.
            </p>

            <button className="btn btn-primary">
              Book Now
            </button>
          </div>

          <div
            className="card dashboard-card"
            onClick={() => navigate('/my-appointments')}
          >
            <div className="dashboard-card-icon">🗓️</div>

            <h2>My Appointments</h2>

            <p>
              View and manage your upcoming appointments.
            </p>

            <button className="btn btn-primary">
              View Appointments
            </button>
          </div>

          <div
            className="card dashboard-card"
            onClick={() => navigate('/my-consultations')}
          >
            <div className="dashboard-card-icon">🩺</div>

            <h2>My Consultations</h2>

            <p>
              View your consultation records and medical details.
            </p>

            <button className="btn btn-primary">
              View Consultations
            </button>
          </div>

          <div
            className="card dashboard-card"
            onClick={() => navigate('/ai-symptom-checker')}
          >
            <div className="dashboard-card-icon">🤖</div>

            <h2>AI Symptom Checker</h2>

            <p>
              Get department and urgency guidance based on symptoms.
            </p>

            <button className="btn btn-primary">
              Check Symptoms
            </button>
          </div>

        </div>

      </main>

    </div>
  )
}

export default Dashboard
