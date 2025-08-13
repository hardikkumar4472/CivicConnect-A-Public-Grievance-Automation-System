import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardSummaryModal = ({ dashboardSummary, onClose }) => {
  const navigate = useNavigate();

  const handleViewAllIssues = () => {
    onClose();
    navigate('/sectorHead-dashboard');
  };

  // Prepare data for charts
  const statusData = {
    labels: ['Pending', 'In Progress', 'Resolved', 'Escalated', 'Closed'],
    datasets: [
      {
        label: 'Issues by Status',
        data: [
          dashboardSummary.pendingIssues,
          dashboardSummary.inProgressIssues || 0,
          dashboardSummary.resolvedIssues || 0,
          dashboardSummary.escalatedIssues || 0,
          dashboardSummary.closedIssues
        ],
        backgroundColor: [
          'rgba(255, 193, 7, 0.7)',
          'rgba(33, 150, 243, 0.7)',
          'rgba(76, 175, 80, 0.7)',
          'rgba(156, 39, 176, 0.7)',
          'rgba(244, 67, 54, 0.7)'
        ],
        borderColor: [
          'rgba(255, 193, 7, 1)',
          'rgba(33, 150, 243, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(156, 39, 176, 1)',
          'rgba(244, 67, 54, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: dashboardSummary.issuesByCategory?.map(item => item.category) || [],
    datasets: [
      {
        label: 'Issues by Category',
        data: dashboardSummary.issuesByCategory?.map(item => item.count) || [],
        backgroundColor: 'rgba(100, 255, 218, 0.7)',
        borderColor: 'rgba(100, 255, 218, 1)',
        borderWidth: 1,
      },
    ],
  };

  const resolutionRate = dashboardSummary.totalIssues > 0 
    ? Math.round((dashboardSummary.closedIssues / dashboardSummary.totalIssues) * 100)
    : 0;

  return (
    <div style={{
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
    }} onClick={onClose}>
      <div style={{
        background: '#112240',
        padding: '25px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        color: '#ccd6f6',
      }} onClick={(e) => e.stopPropagation()}>
        <button
          style={{
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
          }}
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>
        
        <h2 style={{ color: '#64ffda', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fas fa-tachometer-alt"></i> Sector Dashboard Summary
        </h2>
        
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <SummaryCard 
            icon="fa-exclamation-circle"
            title="Total Issues"
            value={dashboardSummary.totalIssues}
            color="#64ffda"
          />
          
          <SummaryCard 
            icon="fa-clock"
            title="Pending Issues"
            value={dashboardSummary.pendingIssues}
            color="#ffc107"
          />
          
          <SummaryCard 
            icon="fa-spinner"
            title="In Progress"
            value={dashboardSummary.inProgressIssues || 0}
            color="#2196f3"
          />
          
          <SummaryCard 
            icon="fa-check-circle"
            title="Resolved Issues"
            value={dashboardSummary.resolvedIssues || 0}
            color="#4caf50"
          />
          
          <SummaryCard 
            icon="fa-exclamation-triangle"
            title="Escalated Issues"
            value={dashboardSummary.escalatedIssues || 0}
            color="#9c27b0"
          />
          
          <SummaryCard 
            icon="fa-check-square"
            title="Closed Issues"
            value={dashboardSummary.closedIssues}
            color="#f44336"
          />
          
          <SummaryCard 
            icon="fa-users"
            title="Total Citizens"
            value={dashboardSummary.totalCitizens}
            color="#64ffda"
          />
          
          <SummaryCard 
            icon="fa-chart-line"
            title="Resolution Rate"
            value={`${resolutionRate}%`}
            color="#4d9de0"
          />
        </div>
        
        {/* Charts Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr', 
          gap: '30px',
          marginBottom: '30px',
          '@media (min-width: 768px)': {
            gridTemplateColumns: '1fr 1fr'
          }
        }}>
          <div style={{ 
            background: '#1e2a47',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#64ffda', marginTop: 0, marginBottom: '20px' }}>
              <i className="fas fa-chart-pie"></i> Issues by Status
            </h3>
            <div style={{ height: '300px' }}>
              <Pie 
                data={statusData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: '#8892b0',
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      backgroundColor: '#112240',
                      titleColor: '#64ffda',
                      bodyColor: '#ccd6f6',
                      borderColor: '#64ffda',
                      borderWidth: 1
                    }
                  }
                }}
              />
            </div>
          </div>
          
          <div style={{ 
            background: '#1e2a47',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#64ffda', marginTop: 0, marginBottom: '20px' }}>
              <i className="fas fa-chart-bar"></i> Issues by Category
            </h3>
            <div style={{ height: '300px' }}>
              <Bar 
                data={categoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: '#8892b0'
                      },
                      grid: {
                        color: 'rgba(136, 146, 176, 0.1)'
                      }
                    },
                    x: {
                      ticks: {
                        color: '#8892b0'
                      },
                      grid: {
                        color: 'rgba(136, 146, 176, 0.1)'
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    },
                    tooltip: {
                      backgroundColor: '#112240',
                      titleColor: '#64ffda',
                      bodyColor: '#ccd6f6',
                      borderColor: '#64ffda',
                      borderWidth: 1
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div style={{ 
          background: '#1e2a47',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#64ffda', marginTop: 0, marginBottom: '15px' }}>
            <i className="fas fa-info-circle"></i> Additional Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <MetricItem 
              label="Avg. Resolution Time"
              value={dashboardSummary.avgResolutionTime || 'N/A'}
              icon="fa-clock"
            />
            <MetricItem 
              label="Avg. Feedback Rating"
              value={dashboardSummary.avgFeedbackRating ? `${dashboardSummary.avgFeedbackRating}/5` : 'N/A'}
              icon="fa-star"
            />
            <MetricItem 
              label="Most Reported Category"
              value={dashboardSummary.mostReportedCategory || 'N/A'}
              icon="fa-tag"
            />
            <MetricItem 
              label="Recent Activity"
              value={dashboardSummary.lastUpdated ? new Date(dashboardSummary.lastUpdated).toLocaleDateString() : 'N/A'}
              icon="fa-calendar"
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
          <button 
            onClick={handleViewAllIssues}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1e2a47',
              color: '#64ffda',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              ':hover': {
                backgroundColor: '#64ffda',
                color: '#0a192f'
              }
            }}
          >
            <i className="fas fa-list"></i> View All Issues
          </button>
        </div>
        
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #1e2a47', textAlign: 'center' }}>
          <p style={{ color: '#8892b0', fontSize: '0.9rem', margin: 0 }}>
            Last updated: {dashboardSummary.lastUpdated ? new Date(dashboardSummary.lastUpdated).toLocaleString() : 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ icon, title, value, color }) => (
  <div style={{ 
    background: '#1e2a47', 
    borderRadius: '8px', 
    padding: '20px', 
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
      <i className={`fas ${icon}`} style={{ color, fontSize: '1.2rem' }}></i>
      <h3 style={{ margin: 0, fontSize: '1rem', color: '#8892b0' }}>{title}</h3>
    </div>
    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#e6f1ff', textAlign: 'center' }}>
      {value}
    </div>
  </div>
);

const MetricItem = ({ label, value, icon }) => (
  <div style={{ 
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
    background: 'rgba(100, 255, 218, 0.1)',
    borderRadius: '5px'
  }}>
    <i className={`fas ${icon}`} style={{ color: '#64ffda', fontSize: '1rem' }}></i>
    <div>
      <div style={{ fontSize: '0.8rem', color: '#8892b0' }}>{label}</div>
      <div style={{ fontSize: '1rem', color: '#e6f1ff', fontWeight: '500' }}>{value}</div>
    </div>
  </div>
);

export default DashboardSummaryModal;