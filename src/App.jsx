
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import BookAppointment from './Pages/BookAppointment'
import MyAppointments from './Pages/MyAppointments'
import MyConsultations from './Pages/MyConsultations'
import PatientProfile from './Pages/PatientProfile'
import DoctorDashboard from './Pages/DoctorDashboard'
import DoctorConsultationHistory from './Pages/DoctorConsultationHistory'
import AISymptomChecker from './Pages/AISymptomChecker'
import Consultation from './Pages/Consultation'
import ProtectedRoute from './Pages/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="PATIENT">
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/book-appointment"
          element={
            <ProtectedRoute role="PATIENT">
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute role="PATIENT">
              <MyAppointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-consultations"
          element={
            <ProtectedRoute role="PATIENT">
              <MyConsultations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-profile"
          element={
            <ProtectedRoute role="PATIENT">
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-symptom-checker"
          element={
            <ProtectedRoute role="PATIENT">
              <AISymptomChecker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-dashboard"
          element={
            <ProtectedRoute role="DOCTOR">
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultation"
          element={
            <ProtectedRoute role="DOCTOR">
              <Consultation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor-consultation-history"
          element={
            <ProtectedRoute role="DOCTOR">
              <DoctorConsultationHistory />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App

