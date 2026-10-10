
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async e => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!name.trim()) {
      setMessage('Please enter your name.')
      return
    }

    if (!email.trim()) {
      setMessage('Please enter your email.')
      return
    }

    if (!password) {
      setMessage('Please enter a password.')
      return
    }

    if (password.length < 6) {
      setMessage('Password must contain at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    setMessage('Creating your account...')

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password
    }

    try {
      const response = await fetch(
        'https://smarthealth-backend-9tf6.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        }
      )

      const data = await response.text()

      if (!response.ok) {
        setMessage(
          data || `Registration failed. Error ${response.status}.`
        )
        return
      }

      if (data === 'Email already registered') {
        setMessage('This email is already registered.')
        return
      }

      setMessage('Account created successfully.')

      setTimeout(() => {
        navigate('/login')
      }, 1200)

    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">

      <div className="login-container">

        <div className="login-brand">

          <div className="health-icon">
            +
          </div>

          <h1>
            Smart Healthcare
          </h1>

          <p>
            Your health, our priority
          </p>

        </div>

        <div className="login-card">

          <div
            style={{
              marginBottom: '26px'
            }}
          >

            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: '#e8f7f7',
                color: '#0b8f8f',
                fontSize: '21px',
                fontWeight: '700',
                marginBottom: '15px'
              }}
            >
              👤
            </div>

            <h2>
              Create Your Account
            </h2>

            <p className="login-subtitle">
              Register to manage your healthcare appointments
            </p>

          </div>

          <form onSubmit={handleRegister}>

            <div className="form-group">

              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setMessage('')
                }}
                disabled={isSubmitting}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => {
                  setEmail(e.target.value)
                  setMessage('')
                }}
                disabled={isSubmitting}
                required
              />

            </div>

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setMessage('')
                }}
                disabled={isSubmitting}
                required
                minLength="6"
              />

              <div
                style={{
                  marginTop: '7px',
                  color: '#94a3b8',
                  fontSize: '12px'
                }}
              >
                Password must contain at least 6 characters.
              </div>

            </div>

            {message && (
              <div
                className={
                  message === 'Account created successfully.'
                    ? 'login-message success-message'
                    : 'login-message'
                }
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Creating Account...'
                : 'Create Account'}
            </button>

          </form>

          <div className="register-section">

            <p>
              Already have an account?
            </p>

            <button
              className="secondary-button"
              onClick={() => navigate('/login')}
              disabled={isSubmitting}
            >
              Back to Login
            </button>

          </div>

        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            marginTop: '18px',
            color: '#64748b',
            fontSize: '12px'
          }}
        >
          <span>
            🛡️
          </span>

          <span>
            Secure healthcare appointment management
          </span>
        </div>

      </div>

    </div>
  )
}

export default Register

