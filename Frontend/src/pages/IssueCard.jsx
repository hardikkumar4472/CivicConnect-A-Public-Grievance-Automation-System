import React from "react";

export default function IssueCard({ issue, isSelected, onClick }) {
  const statusColors = {
    'pending': '#FFA500',      // Orange
    'in-progress': '#1E90FF',  // Dodger Blue
    'resolved': '#32CD32',     // Lime Green
    'escalated': '#FF4500',    // Orange Red
    'closed': '#808080'        // Gray
  };

  const normalizeStatus = (status) => {
    return status.toLowerCase().replace(/\s+/g, '-');
  };

  const status = normalizeStatus(issue.status);
  const statusColor = statusColors[status] || '#CCCCCC';

  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: isSelected ? '#233554' : '#112240',
        borderRadius: '8px',
        padding: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        borderLeft: `4px solid ${statusColor}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 8px rgba(0,0,0,0.15)'
        }
      }}
    >
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
      }}>
        <h3 style={{
          margin: 0,
          color: '#64ffda',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          {issue.category}
        </h3>
        <span style={{
          backgroundColor: statusColor,
          color: '#fff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.7rem',
          fontWeight: '600',
          textTransform: 'capitalize'
        }}>
          {issue.status}
        </span>
      </div>
      
      <p style={{
        color: '#8892b0',
        fontSize: '0.9rem',
        margin: '8px 0',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {issue.description}
      </p>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '15px',
        fontSize: '0.8rem',
        color: '#64ffda'
      }}>
        <span>
          <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
        <span>
          <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i>
          {issue.sector}
        </span>
      </div>
    </div>
  );
}