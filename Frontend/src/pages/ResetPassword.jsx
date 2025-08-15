import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.width = '100%';
    document.body.style.overflowX = 'hidden';
    document.body.style.backgroundColor = '#0f172a'; // Dark background
  }, []);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/citizen/reset-password/${token}`,
        { password: formData.password }
      );
      
      toast.success(response.data.message || 'Password reset successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      if (err.response?.status === 400) {
        setIsValidToken(false);
        toast.error('Invalid or expired token. Please request a new password reset link.');
      } else {
        toast.error(err.response?.data?.message || 'Error resetting password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2 style={styles.title}>Invalid Token</h2>
          <p style={styles.subtitle}>The password reset link is invalid or has expired</p>
          <button 
            onClick={() => navigate('/forgot-password')} 
            style={styles.button}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Reset Your Password</h2>
          <p style={styles.subtitle}>Create a new password for your account</p>
        </div>
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>New Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password"
              style={{
                ...styles.input,
                ...(errors.password && styles.inputError)
              }}
              required
            />
            {errors.password && <span style={styles.errorText}>{errors.password}</span>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              style={{
                ...styles.input,
                ...(errors.confirmPassword && styles.inputError)
              }}
              required
            />
            {errors.confirmPassword && <span style={styles.errorText}>{errors.confirmPassword}</span>}
          </div>
          
          <button 
            type="submit" 
            style={styles.button} 
            disabled={isLoading}
          >
            {isLoading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <button 
            onClick={() => navigate('/')} 
            style={styles.secondaryButton}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    width: '100vw',
    padding: '20px',
    backgroundColor: '#0f172a', // Dark slate background
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: '#1e293b', // Darker slate for card
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
    width: '100%',
    maxWidth: '450px',
    textAlign: 'center',
    border: '1px solid #334155', // Subtle border
  },
  header: {
    marginBottom: '32px',
  },
  title: {
    color: '#f8fafc', // Light text
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#94a3b8', // Lighter text
    fontSize: '14px',
    marginBottom: '0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    textAlign: 'left',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#e2e8f0', // Light label
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    border: '1px solid #334155', // Dark border
    borderRadius: '8px',
    fontSize: '14px',
    color: '#f8fafc', // Light text
    backgroundColor: '#1e293b', // Dark input background
    transition: 'all 0.2s ease',
    outline: 'none',
    ':focus': {
      borderColor: '#3b82f6', // Blue focus
      boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
    },
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#1e293b',
  },
  errorText: {
    display: 'block',
    marginTop: '6px',
    color: '#ef4444',
    fontSize: '12px',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#3b82f6', // Blue button
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '8px',
    ':hover': {
      backgroundColor: '#2563eb', // Darker blue on hover
    },
    ':disabled': {
      backgroundColor: '#1e40af', // Even darker when disabled
      cursor: 'not-allowed',
    },
  },
  secondaryButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: 'transparent',
    color: '#94a3b8', // Light gray text
    border: '1px solid #334155', // Dark border
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    ':hover': {
      backgroundColor: '#334155', // Slightly lighter on hover
      color: '#e2e8f0',
    },
  },
  footer: {
    marginTop: '24px',
    paddingTop: '24px',
    borderTop: '1px solid #334155', // Dark border
  },
};

export default ResetPassword;