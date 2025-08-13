import React from 'react';

const AnalyticsModal = ({ analytics, onClose }) => {
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>
        
        <h2 style={styles.modalTitle}>
          <i className="fas fa-chart-bar" style={styles.icon}></i> Sector Analytics
        </h2>
        
        <div style={styles.analyticsGrid}>
          {/* Total Issues */}
          <div style={styles.analyticsCard}>
            <div style={styles.cardHeader}>
              <i className="fas fa-exclamation-circle" style={styles.cardIcon}></i>
              <h3 style={styles.cardTitle}>Total Issues</h3>
            </div>
            <div style={styles.cardValue}>{analytics.totalIssues}</div>
          </div>
          
          {/* Most Reported Category */}
          <div style={styles.analyticsCard}>
            <div style={styles.cardHeader}>
              <i className="fas fa-star" style={styles.cardIcon}></i>
              <h3 style={styles.cardTitle}>Most Reported</h3>
            </div>
            <div style={styles.cardValue}>{analytics.mostReportedCategory}</div>
          </div>
          
          {/* Average Resolution Time */}
          <div style={styles.analyticsCard}>
            <div style={styles.cardHeader}>
              <i className="fas fa-clock" style={styles.cardIcon}></i>
              <h3 style={styles.cardTitle}>Avg. Resolution Time</h3>
            </div>
            <div style={styles.cardValue}>{analytics.avgResolutionTime}</div>
          </div>
          
          {/* Average Rating */}
          <div style={styles.analyticsCard}>
            <div style={styles.cardHeader}>
              <i className="fas fa-thumbs-up" style={styles.cardIcon}></i>
              <h3 style={styles.cardTitle}>Avg. Feedback Rating</h3>
            </div>
            <div style={styles.cardValue}>
              {analytics.avgFeedbackRating}
              {analytics.avgFeedbackRating !== 'N/A' && (
                <span style={styles.ratingOutOf}>/5</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Issues by Category Chart */}
        <div style={styles.chartSection}>
          <h3 style={styles.sectionTitle}>
            <i className="fas fa-chart-pie"></i> Issues by Category
          </h3>
          <div style={styles.chartContainer}>
            {analytics.issuesByCategory.map((category) => (
              <div key={category._id} style={styles.chartBarContainer}>
                <div style={styles.chartBarLabel}>
                  {category._id}: {category.count}
                </div>
                <div style={styles.chartBarBackground}>
                  <div 
                    style={{
                      ...styles.chartBarFill,
                      width: `${(category.count / analytics.totalIssues) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(5px)',
  },
  modalContent: {
    background: '#112240',
    padding: '25px',
    borderRadius: '10px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflowY: 'auto',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    color: '#ccd6f6',
  },
  closeButton: {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#8892b0',
    transition: 'color 0.3s ease',
    padding: '5px',
  },
  modalTitle: {
    color: '#64ffda',
    marginBottom: '30px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  icon: {
    fontSize: '1.5rem',
  },
  analyticsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  analyticsCard: {
    background: '#1e2a47',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },
  cardIcon: {
    color: '#64ffda',
    fontSize: '1.2rem',
  },
  cardTitle: {
    margin: 0,
    fontSize: '1rem',
    color: '#8892b0',
  },
  cardValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#e6f1ff',
  },
  ratingOutOf: {
    fontSize: '1rem',
    color: '#8892b0',
    marginLeft: '5px',
  },
  chartSection: {
    marginTop: '30px',
  },
  sectionTitle: {
    color: '#64ffda',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  chartBarContainer: {
    marginBottom: '10px',
  },
  chartBarLabel: {
    marginBottom: '5px',
    fontSize: '0.9rem',
    color: '#8892b0',
  },
  chartBarBackground: {
    height: '10px',
    backgroundColor: '#0a192f',
    borderRadius: '5px',
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    background: 'linear-gradient(to right, #64ffda, #4d9de0)',
    borderRadius: '5px',
  },
};

export default AnalyticsModal;