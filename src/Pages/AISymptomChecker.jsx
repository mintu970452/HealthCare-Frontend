
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AISymptomChecker() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const checkSymptoms = async e => {
    e.preventDefault()

    if (!symptoms.trim()) {
      setMessage('Please enter your symptoms.')
      setResult(null)
      return
    }

    setLoading(true)
    setMessage('')
    setResult(null)

    try {
      const token = localStorage.getItem('token')

      const response = await fetch(
        'https://smarthealth-backend-9tf6.onrender.com/api/ai/symptoms',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            symptoms: symptoms.trim()
          })
        }
      )

      const data = await response.json()

      if (response.status === 401) {
        setMessage('Session expired. Please login again.')
        return
      }

      if (!response.ok) {
        setMessage(
          data.message ||
            'Unable to analyze symptoms. Please try again.'
        )
        return
      }

      setResult(data)
    } catch (error) {
      console.error(error)

      setMessage(
        'Unable to connect to the server. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const clearChecker = () => {
    setSymptoms('')
    setResult(null)
    setMessage('')
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

          <h1>AI Symptom Checker</h1>

          <p>
            Get department and urgency guidance based on the symptoms
            you provide.
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
              gap: '15px',
              marginBottom: '10px'
            }}
          >

            <div
              style={{
                width: '52px',
                height: '52px',
                flexShrink: 0,
                borderRadius: '14px',
                background: '#e8f7f7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '25px'
              }}
            >
              🤖
            </div>

            <div>

              <h2
                className="card-title"
                style={{
                  marginBottom: '4px'
                }}
              >
                Describe Your Symptoms
              </h2>

              <p
                className="card-subtitle"
                style={{
                  marginBottom: 0
                }}
              >
                Enter your symptoms and the system will suggest
                a suitable medical department and urgency level.
              </p>

            </div>

          </div>

          <form
            onSubmit={checkSymptoms}
            style={{
              marginTop: '26px'
            }}
          >

            <div className="form-group">

              <label htmlFor="symptoms">
                Symptoms
              </label>

              <textarea
                id="symptoms"
                rows="6"
                value={symptoms}
                onChange={e => {
                  setSymptoms(e.target.value)
                  setMessage('')
                }}
                placeholder="Example: headache, fever, sore throat..."
                disabled={loading}
              />

              <div
                style={{
                  marginTop: '7px',
                  color: '#94a3b8',
                  fontSize: '12px'
                }}
              >
                Describe your symptoms clearly for better guidance.
              </div>

            </div>

            {message && (
              <div className="message message-info">
                {message}
              </div>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '22px',
                paddingTop: '22px',
                borderTop: '1px solid #edf2f5'
              }}
            >

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading
                  ? 'Analyzing...'
                  : 'Analyze Symptoms'}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={clearChecker}
                disabled={loading}
              >
                Clear
              </button>

            </div>

          </form>

        </div>

        {result && (
          <div
            className="card"
            style={{
              maxWidth: '850px',
              margin: '25px auto 0',
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
                  borderRadius: '12px',
                  background: '#e8f7f7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px'
                }}
              >
                ✨
              </div>

              <div>

                <h2
                  className="card-title"
                  style={{
                    marginBottom: '3px'
                  }}
                >
                  AI Assessment
                </h2>

                <p
                  className="card-subtitle"
                  style={{
                    marginBottom: 0
                  }}
                >
                  Guidance based on the symptoms you provided.
                </p>

              </div>

            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
                marginTop: '24px'
              }}
            >

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '9px',
                    background: '#e8f7f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '13px',
                    fontSize: '18px'
                  }}
                >
                  🏥
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginBottom: '7px',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}
                >
                  SUGGESTED DEPARTMENT
                </div>

                <div
                  style={{
                    fontSize: '18px',
                    color: '#123b4a',
                    fontWeight: '700'
                  }}
                >
                  {result.department ||
                    result.suggestedDepartment ||
                    'Not available'}
                </div>

              </div>

              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '20px'
                }}
              >

                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '9px',
                    background: '#e8f7f7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '13px',
                    fontSize: '18px'
                  }}
                >
                  ⚡
                </div>

                <div
                  style={{
                    fontSize: '11px',
                    color: '#64748b',
                    marginBottom: '7px',
                    fontWeight: '700',
                    letterSpacing: '0.5px'
                  }}
                >
                  URGENCY LEVEL
                </div>

                <div
                  style={{
                    fontSize: '18px',
                    color: '#123b4a',
                    fontWeight: '700'
                  }}
                >
                  {result.urgency ||
                    result.urgencyLevel ||
                    'Not available'}
                </div>

              </div>

            </div>

            <div
              style={{
                marginTop: '22px',
                padding: '17px',
                background: '#f0fafa',
                borderRadius: '10px',
                border: '1px solid #d7eeee',
                lineHeight: '1.6'
              }}
            >

              <strong
                style={{
                  color: '#123b4a'
                }}
              >
                Important:
              </strong>

              <span
                style={{
                  color: '#64748b',
                  marginLeft: '6px',
                  fontSize: '14px'
                }}
              >
                This tool provides guidance only and does not
                provide a medical diagnosis.
              </span>

            </div>

          </div>
        )}

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
              marginBottom: '15px'
            }}
          >

            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: '#f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '19px'
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
                About This Tool
              </h3>

              <p
                className="card-subtitle"
                style={{
                  marginBottom: 0
                }}
              >
                Use this feature as an initial healthcare guidance tool.
              </p>

            </div>

          </div>

          <p
            style={{
              margin: 0,
              color: '#64748b',
              fontSize: '14px',
              lineHeight: '1.7'
            }}
          >
            The AI symptom checker helps suggest an appropriate
            department and urgency level from the symptoms entered.
            It is not a replacement for professional medical advice.
          </p>

        </div>

      </main>

    </div>
  )
}

export default AISymptomChecker

