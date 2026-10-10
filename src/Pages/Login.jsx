
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async e => {
    e.preventDefault()

    if (isSubmitting) {
      return
    }

    if (!email) {
      setMessage('Please enter your email.')
      return
    }

    if (!password) {
      setMessage('Please enter your password.')
      return
    }

    setIsSubmitting(true)
    setMessage('Logging in...')

    const loginData = {
      email,
      password
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
        }
      )

      const data = await response.text()

      if (response.status === 401) {
        setMessage('Invalid email or password.')
        return
      }

      if (response.status === 400) {
        setMessage(data || 'Invalid login details.')
        return
      }

      if (!response.ok) {
        setMessage(`Login failed. Error ${response.status}.`)
        return
      }

      if (!data || !data.includes('.')) {
        setMessage('Invalid login response from server.')
        return
      }

      localStorage.setItem('token', data)

      const payload = JSON.parse(atob(data.split('.')[1]))
      const role = payload.role

      localStorage.setItem('role', role)

      if (role === 'DOCTOR') {
        navigate('/doctor-dashboard')
      } else if (role === 'ADMIN') {
        navigate('/admin-dashboard')
      } else {
        navigate('/dashboard')
      }

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
              🔐
            </div>

            <h2>
              Welcome Back
            </h2>

            <p className="login-subtitle">
              Sign in to access your healthcare account
            </p>

          </div>

          <form onSubmit={handleLogin}>

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
                placeholder="Enter your password"
                value={password}
                onChange={e => {
                  setPassword(e.target.value)
                  setMessage('')
                }}
                disabled={isSubmitting}
                required
              />

            </div>

            {message && (
              <div className="login-message">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="primary-button login-button"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Signing in...'
                : 'Sign In'}
            </button>

          </form>

          <div className="register-section">

            <p>
              Don't have an account?
            </p>

            <button
              className="secondary-button"
              onClick={() => navigate('/register')}
              disabled={isSubmitting}
            >
              Create Account
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

export default Login

