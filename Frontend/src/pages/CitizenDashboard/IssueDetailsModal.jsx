import React, { useState } from "react";

export default function IssueDetailsModal({ selectedIssue, onClose, isCitizenView }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [addingComment, setAddingComment] = useState(false);

  const statusColors = {
    'pending': '#FFA500',
    'in-progress': '#1E90FF',
    'resolved': '#32CD32',
    'escalated': '#FF4500',
    'closed': '#808080'
  };

  const normalizeStatus = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  const status = normalizeStatus(selectedIssue.status);
  const statusColor = statusColors[status] || '#CCCCCC';

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    
    setAddingComment(true);
    try {
      // In a real app, you would call an API to add the comment
      const newComment = {
        id: Date.now(),
        text: comment,
        createdAt: new Date().toISOString(),
        author: "You"
      };
      
      setComments([...comments, newComment]);
      setComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setAddingComment(false);
    }
  };

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
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          borderBottom: '1px solid #233554',
          paddingBottom: '15px'
        }}>
          <h2 style={{
            color: '#64ffda',
            margin: 0,
            fontSize: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className="fas fa-exclamation-circle"></i>
            Issue Details
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
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div>
            <h3 style={{ color: '#ccd6f6', marginBottom: '10px' }}>Basic Information</h3>
            <div style={{ marginBottom: '15px' }}>
              <p style={{ color: '#8892b0', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong style={{ color: '#ccd6f6' }}>Category:</strong> {selectedIssue.category}
              </p>
              <p style={{ color: '#8892b0', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong style={{ color: '#ccd6f6' }}>Sector:</strong> {selectedIssue.sector}
              </p>
              <p style={{ color: '#8892b0', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong style={{ color: '#ccd6f6' }}>House ID:</strong> {selectedIssue.houseId}
              </p>
              <p style={{ color: '#8892b0', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong style={{ color: '#ccd6f6' }}>Reported On:</strong> {new Date(selectedIssue.createdAt).toLocaleString()}
              </p>
            </div>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '15px'
            }}>
              <span style={{
                backgroundColor: statusColor,
                color: '#fff',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'capitalize'
              }}>
                {selectedIssue.status}
              </span>
              
              {isCitizenView && selectedIssue.status.toLowerCase() === 'pending' && (
                <button
                  style={{
                    padding: '4px 10px',
                    borderRadius: '20px',
                    border: 'none',
                    background: '#ff6b6b',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}
                >
                  Request Escalation
                </button>
              )}
            </div>
          </div>
          
          <div>
            <h3 style={{ color: '#ccd6f6', marginBottom: '10px' }}>Location Details</h3>
            <p style={{ color: '#8892b0', margin: '5px 0', fontSize: '0.9rem' }}>
              <strong style={{ color: '#ccd6f6' }}>Address:</strong> {selectedIssue.address || 'Not specified'}
            </p>
            {selectedIssue.latitude && selectedIssue.longitude && (
              <p style={{ color: '#8892b0', margin: '5px 0', fontSize: '0.9rem' }}>
                <strong style={{ color: '#ccd6f6' }}>Coordinates:</strong> {selectedIssue.latitude}, {selectedIssue.longitude}
              </p>
            )}
            
            {selectedIssue.imageUrl && (
              <div style={{ marginTop: '15px' }}>
                <h4 style={{ color: '#ccd6f6', marginBottom: '10px', fontSize: '0.9rem' }}>
                  Attached Image:
                </h4>
                <img 
                  src={selectedIssue.imageUrl} 
                  alt="Issue" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '150px',
                    borderRadius: '5px',
                    border: '1px solid #233554'
                  }}
                />
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#ccd6f6', marginBottom: '10px' }}>Description</h3>
          <div style={{
            backgroundColor: '#0a192f',
            padding: '15px',
            borderRadius: '5px',
            color: '#ccd6f6',
            lineHeight: '1.5'
          }}>
            {selectedIssue.description}
          </div>
        </div>
        
        <div>
          <h3 style={{ color: '#ccd6f6', marginBottom: '10px' }}>Comments & Updates</h3>
          <div style={{
            backgroundColor: '#0a192f',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '15px',
            maxHeight: '200px',
            overflowY: 'auto'
          }}>
            {comments.length === 0 ? (
              <p style={{ color: '#8892b0', textAlign: 'center' }}>No comments yet</p>
            ) : (
              comments.map(comment => (
                <div key={comment.id} style={{
                  marginBottom: '10px',
                  paddingBottom: '10px',
                  borderBottom: '1px solid #233554'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '5px'
                  }}>
                    <strong style={{ color: '#64ffda' }}>{comment.author}</strong>
                    <span style={{ color: '#8892b0', fontSize: '0.8rem' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p style={{ color: '#ccd6f6', margin: 0 }}>{comment.text}</p>
                </div>
              ))
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              style={{
                flex: 1,
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #233554',
                backgroundColor: '#0a192f',
                color: '#ccd6f6',
                fontSize: '0.9rem'
              }}
            />
            <button
              onClick={handleAddComment}
              disabled={addingComment || !comment.trim()}
              style={{
                padding: '10px 15px',
                borderRadius: '5px',
                border: 'none',
                background: '#64ffda',
                color: '#0a192f',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: addingComment || !comment.trim() ? 0.7 : 1
              }}
            >
              {addingComment ? 'Adding...' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}