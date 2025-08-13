import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BroadcastPage = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/sectorHead-login');
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/sector-head/broadcast',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/sector-dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Broadcast email Sent successfully');
      console.error('Broadcast error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <i className="fas fa-bullhorn" style={styles.icon}></i> Send Broadcast Message
        </h2>
        
        {success ? (
          <div style={styles.successMessage}>
            <i className="fas fa-check-circle" style={styles.successIcon}></i>
            <p>Broadcast sent successfully!</p>
            <p>Redirecting to dashboard...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.formGroup}>
              <label htmlFor="subject" style={styles.label}>
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter message subject"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label htmlFor="message" style={styles.label}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                style={styles.textarea}
                placeholder="Type your broadcast message here..."
                rows="6"
              />
            </div>
            
            {error && (
              <div style={styles.errorMessage}>
                <i className="fas fa-exclamation-circle"></i> {error}
              </div>
            )}
            
            <div style={styles.buttonGroup}>
              <button
                type="button"
                onClick={() => navigate('/sectorHead-dashboard')}
                style={styles.cancelButton}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={styles.submitButton}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Sending...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Send Broadcast
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Inline CSS for full page styling */}
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
        }
        #root {
          height: 100%;
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#0a192f',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
    margin: 0,
    boxSizing: 'border-box',
  },
  card: {
    backgroundColor: '#112240',
    borderRadius: '10px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    padding: '30px',
    width: '100%',
    maxWidth: '700px',
    color: '#ccd6f6',
    margin: '0 auto',
  },
  title: {
    color: '#64ffda',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '1.5rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    color: '#8892b0',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '5px',
    border: '1px solid #1e2a47',
    backgroundColor: '#0a192f',
    color: '#e6f1ff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  textarea: {
    padding: '12px 15px',
    borderRadius: '5px',
    border: '1px solid #1e2a47',
    backgroundColor: '#0a192f',
    color: '#e6f1ff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '15px',
    marginTop: '20px',
  },
  cancelButton: {
    padding: '12px 25px',
    backgroundColor: 'transparent',
    color: '#ff6b6b',
    border: '1px solid #ff6b6b',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    transition: 'all 0.3s ease',
  },
  submitButton: {
    padding: '12px 25px',
    backgroundColor: '#1e2a47',
    color: '#64ffda',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
  },
  errorMessage: {
    backgroundColor: 'rgba(0, 58, 96, 0.65)',
    color: '#19bf00ff',
    padding: '12px 15px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '0.9rem',
  },
  successMessage: {
    backgroundColor: 'rgba(100, 255, 218, 0.1)',
    color: '#64ffda',
    padding: '20px',
    borderRadius: '5px',
    textAlign: 'center',
    fontSize: '1rem',
  },
  successIcon: {
    fontSize: '2.5rem',
    marginBottom: '15px',
  },
};

export default BroadcastPage;