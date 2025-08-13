import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnalyticsModal from "./AnalyticsModal";
import LoadingSpinner from "./LoadingSpinner";
import SectorHeadHeader from "./SectorHeadHeader";
import IssueCard from "./IssueCard";
import DashboardSummaryModal from "./DashboardSummaryModal";
import IssueDetailsModal from "./IssueDetailsModal";

export default function SectorHeadDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectorName, setSectorName] = useState("");
  const [citizenDetails, setCitizenDetails] = useState({
    name: "Loading...",
    email: "Loading...",
    phone: "Loading..."
  });
  const [loadingCitizenDetails, setLoadingCitizenDetails] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalIssues: 0,
    issuesByCategory: [],
    mostReportedCategory: 'N/A',
    avgResolutionTime: 'N/A',
    avgFeedbackRating: 'N/A'
  });
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [dashboardSummary, setDashboardSummary] = useState({
    totalIssues: 0,
    openIssues: 0,
    closedIssues: 0,
    pendingIssues: 0,
    totalCitizens: 0
  });
  const [showDashboard, setShowDashboard] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const navigate = useNavigate();

  // Status options for filtering
  const statusFilters = [
    { id: "all", label: "All Issues" },
    { id: "pending", label: "Pending" },
    { id: "in-progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
    { id: "escalated", label: "Escalated" },
    { id: "closed", label: "Closed" }
  ];

  // First load all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/sectorHead-login");
          return;
        }
        
        const [sectorRes, issuesRes, summaryRes] = await Promise.all([
          axios.get("http://localhost:5000/api/sector-head/me", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/sector-head/issues", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/sector-head/dashboard-summary", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setSectorName(sectorRes.data.sector || "Unknown Sector");
        const issuesData = Array.isArray(issuesRes.data) ? issuesRes.data : issuesRes.data?.issues || [];
        setIssues(issuesData);
        setFilteredIssues(issuesData); // Initialize filtered issues with all issues
        setDashboardSummary(summaryRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/sectorHead-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter issues based on active filter
  // Update the filter logic in the useEffect
useEffect(() => {
  if (activeFilter === "all") {
    setFilteredIssues(issues);
  } else {
    const normalize = str => str?.toLowerCase().replace(/[\s_]+/g, "-"); 
    setFilteredIssues(
      issues.filter(
        issue => normalize(issue.status) === normalize(activeFilter)
      )
    );
  }
}, [activeFilter, issues]);



  const fetchCitizenDetails = async (issue) => {
    if (!issue?.raisedBy) {
      console.warn('No raisedBy field in issue:', issue);
      return;
    }
    
    setLoadingCitizenDetails(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/sector-head/citizen/${issue.raisedBy}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setCitizenDetails({
        name: response.data?.name || "Anonymous",
        email: response.data?.email || "Not provided",
        phone: response.data?.phone || "Not provided"
      });
    } catch (error) {
      console.error("Citizen details fetch failed:", error);
      setCitizenDetails({
        name: "Anonymous",
        email: "Not provided",
        phone: "Not provided"
      });
    } finally {
      setLoadingCitizenDetails(false);
    }
  };

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
    fetchCitizenDetails(issue);
  };

  const updateIssueStatus = async (issueId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/issues/${issueId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIssues(issues.map(issue => 
        issue._id === issueId ? { ...issue, status } : issue
      ));
      
      if (selectedIssue && selectedIssue._id === issueId) {
        setSelectedIssue({ ...selectedIssue, status });
      }
    } catch (error) {
      console.error("Error updating issue status:", error);
    }
  };

  const closeModal = () => {
    setSelectedIssue(null);
    setCitizenDetails({
      name: "Loading...",
      email: "Loading...",
      phone: "Loading..."
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a192f',
      fontFamily: "'Poppins', sans-serif",
      color: '#ccd6f6',
      display: 'flex',
      flexDirection: 'column',
      margin: 0,
      padding: 0,
      width: '100vw',
      overflowX: 'hidden'
    }}>
      <SectorHeadHeader 
        sectorName={sectorName} 
        onShowDashboard={() => setShowDashboard(true)}
        onShowAnalytics={() => {
          fetchAnalytics();
          setShowAnalytics(true);
        }}
        loadingAnalytics={loadingAnalytics}
      />

      {/* Main Content Area */}
      <div style={{
        flex: 1,
        width: '100%',
        overflowY: 'auto',
        padding: '20px',
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          padding: '0 20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '15px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#ccd6f6'
            }}>
              <i className="fas fa-exclamation-circle"></i> Reported Issues in Your Sector
            </h2>
            
            {/* Status Filter Navbar */}
            <div style={{
              display: 'flex',
              gap: '10px',
              flexWrap: 'wrap'
            }}>
              {statusFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '20px',
                    border: 'none',
                    background: activeFilter === filter.id ? '#64ffda' : '#112240',
                    color: activeFilter === filter.id ? '#0a192f' : '#ccd6f6',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          {filteredIssues.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#8892b0',
              backgroundColor: '#112240',
              borderRadius: '8px',
              marginTop: '20px',
            }}>
              <i className="fas fa-check-circle" style={{
                fontSize: '3rem',
                color: '#64ffda',
                marginBottom: '15px',
              }}></i>
              <p style={{ fontSize: '1.1rem' }}>
                {activeFilter === "all" 
                  ? "No issues reported in your sector yet." 
                  : `No ${statusFilters.find(f => f.id === activeFilter)?.label} issues found.`}
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              width: '100%',
            }}>
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue._id}
                  issue={issue}
                  isSelected={selectedIssue?._id === issue._id}
                  onClick={() => handleIssueClick(issue)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Summary Modal */}
      {showDashboard && (
        <DashboardSummaryModal 
          dashboardSummary={dashboardSummary} 
          onClose={() => setShowDashboard(false)} 
        />
      )}

      {/* Analytics Modal */}
      {showAnalytics && (
        <AnalyticsModal 
          analytics={analytics} 
          loading={loadingAnalytics}
          onClose={() => setShowAnalytics(false)} 
        />
      )}

      {/* Issue Details Modal */}
      {selectedIssue && (
        <IssueDetailsModal
          selectedIssue={selectedIssue}
          citizenDetails={citizenDetails}
          loadingCitizenDetails={loadingCitizenDetails}
          onClose={closeModal}
          onStatusChange={updateIssueStatus}
        />
      )}

      {/* Inline CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}