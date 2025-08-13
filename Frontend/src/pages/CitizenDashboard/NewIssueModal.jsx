import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewIssueModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    category: 'Water',
    description: '',
    imageUrl: '',
    latitude: '',
    longitude: '',
    address: '',
    sector: '', // Will be populated from API
    houseId: '' // Will be populated from API
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fetchingData, setFetchingData] = useState(true);

  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/citizen/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setFormData(prev => ({
          ...prev,
          sector: response.data.data.sector,
          houseId: response.data.data.houseId
        }));
      } catch (error) {
        console.error('Error fetching citizen data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchCitizenData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: '#112240',
          borderRadius: '8px',
          padding: '25px',
          textAlign: 'center'
        }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p style={{ color: '#64ffda', marginTop: '15px' }}>Loading your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        backgroundColor: '#112240',
        borderRadius: '8px',
        padding: '25px',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h2 style={{
            color: '#64ffda',
            margin: 0,
            fontSize: '1.5rem'
          }}>
            <i className="fas fa-plus-circle" style={{ marginRight: '10px' }}></i>
            Report New Issue
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ccd6f6',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {/* Category dropdown remains the same */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem'
              }}
            >
              <option value="Water">Water</option>
              <option value="Electricity">Electricity</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Roads">Roads</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Read-only Sector field */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Sector
            </label>
            <input
              type="text"
              name="sector"
              value={formData.sector}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a1a2f',
                color: '#8892b0',
                fontSize: '1rem',
                cursor: 'not-allowed'
              }}
            />
          </div>
          
          {/* Read-only House ID field */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              House ID
            </label>
            <input
              type="text"
              name="houseId"
              value={formData.houseId}
              readOnly
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a1a2f',
                color: '#8892b0',
                fontSize: '1rem',
                cursor: 'not-allowed'
              }}
            />
          </div>
          
          {/* Rest of the form remains the same */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem',
                resize: 'vertical'
              }}
            />
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Upload Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem'
              }}
            />
            {imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '200px',
                    borderRadius: '5px'
                  }}
                />
              </div>
            )}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              color: '#ccd6f6',
              fontWeight: '500'
            }}>
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a192f',
                color: '#ccd6f6',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px'
          }}>
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#ccd6f6',
                fontWeight: '500'
              }}>
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                step="any"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #233554',
                  backgroundColor: '#0a192f',
                  color: '#ccd6f6',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label style={{
                display: 'block',
                marginBottom: '5px',
                color: '#ccd6f6',
                fontWeight: '500'
              }}>
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                step="any"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #233554',
                  backgroundColor: '#0a192f',
                  color: '#ccd6f6',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '15px',
            marginTop: '20px'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                background: '#ff6b6b',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 20px',
                borderRadius: '5px',
                border: 'none',
                background: '#64ffda',
                color: '#0a192f',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i> Submit Issue
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}