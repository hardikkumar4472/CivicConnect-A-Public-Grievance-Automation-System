import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./SectorHead/LoadingSpinner";
import IssueCard from "./IssueCard";
import IssueDetailsModal from "./CitizenDashboard/IssueDetailsModal";
import NewIssueModal from "./CitizenDashboard/NewIssueModal";

export default function CitizenDashboard() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [citizenName, setCitizenName] = useState("");
  const [showNewIssueModal, setShowNewIssueModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [exporting, setExporting] = useState(false);
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
          navigate("/");
          return;
        }

        const [citizenRes, issuesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/citizen/me", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get("http://localhost:5000/api/issues/my", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setCitizenName(citizenRes.data.name || "Citizen");
        const issuesData = Array.isArray(issuesRes.data)
          ? issuesRes.data
          : issuesRes.data?.issues || [];
        setIssues(issuesData);
        setFilteredIssues(issuesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // Filter issues based on active filter
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredIssues(issues);
    } else {
      const normalize = (str) => str?.toLowerCase().replace(/[\s_]+/g, "-");
      setFilteredIssues(
        issues.filter(
          (issue) => normalize(issue.status) === normalize(activeFilter)
        )
      );
    }
  }, [activeFilter, issues]);

  const handleIssueClick = (issue) => {
    setSelectedIssue(issue);
  };

  const handleCreateNewIssue = async (newIssueData) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/issues/report",
        newIssueData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIssues([response.data, ...issues]);
      setFilteredIssues([response.data, ...filteredIssues]);
      setShowNewIssueModal(false);
    } catch (error) {
      console.error("Error creating new issue:", error);
    }
  };

  const handleExportIssues = async () => {
    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/issues/export-issues",
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "my-issues-export.csv");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting issues:", error);
    } finally {
      setExporting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const closeModal = () => {
    setSelectedIssue(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0a192f",
        fontFamily: "'Poppins', sans-serif",
        color: "#ccd6f6",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 0,
        width: "100vw",
        overflowX: "hidden"
      }}
    >
      {/* Header */}
      <header
        style={{
          backgroundColor: "#112240",
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 10px rgba(0,0,0,0.2)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: "600",
              margin: 0,
              color: "#64ffda"
            }}
          >
            <i className="fas fa-user" style={{ marginRight: "10px" }}></i>
            {citizenName}'s Dashboard
          </h1>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => setShowNewIssueModal(true)}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              background: "#64ffda",
              color: "#0a192f",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className="fas fa-plus"></i> New Issue
          </button>

          <button
            onClick={handleExportIssues}
            disabled={exporting}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              background: "#1e90ff",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              opacity: exporting ? 0.7 : 1
            }}
          >
            {exporting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Exporting...
              </>
            ) : (
              <>
                <i className="fas fa-download"></i> Export Issues
              </>
            )}
          </button>

          <button
            onClick={handleLogout}
            style={{
              padding: "8px 15px",
              borderRadius: "5px",
              border: "none",
              background: "#ff6b6b",
              color: "#fff",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          width: "100%",
          overflowY: "auto",
          padding: "20px",
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "100%",
            padding: "0 20px",
            boxSizing: "border-box"
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              flexWrap: "wrap",
              gap: "15px"
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                margin: 0,
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "#ccd6f6"
              }}
            >
              <i className="fas fa-exclamation-circle"></i> Your Reported Issues
            </h2>

            {/* Status Filter Navbar */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  style={{
                    padding: "8px 15px",
                    borderRadius: "20px",
                    border: "none",
                    background:
                      activeFilter === filter.id ? "#64ffda" : "#112240",
                    color:
                      activeFilter === filter.id ? "#0a192f" : "#ccd6f6",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.8rem",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "5px"
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {filteredIssues.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "#8892b0",
                backgroundColor: "#112240",
                borderRadius: "8px",
                marginTop: "20px"
              }}
            >
              <i
                className="fas fa-check-circle"
                style={{
                  fontSize: "3rem",
                  color: "#64ffda",
                  marginBottom: "15px"
                }}
              ></i>
              <p style={{ fontSize: "1.1rem" }}>
                {activeFilter === "all"
                  ? "You haven't reported any issues yet."
                  : `No ${
                      statusFilters.find((f) => f.id === activeFilter)?.label
                    } issues found.`}
              </p>
              <button
                onClick={() => setShowNewIssueModal(true)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#64ffda",
                  color: "#0a192f",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  transition: "all 0.3s ease",
                  marginTop: "15px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <i className="fas fa-plus"></i> Report Your First Issue
              </button>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "20px",
                width: "100%"
              }}
            >
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

      {/* New Issue Modal */}
      {showNewIssueModal && (
        <NewIssueModal
          onSubmit={handleCreateNewIssue}
          onClose={() => setShowNewIssueModal(false)}
        />
      )}

      {/* Issue Details Modal */}
      {selectedIssue && (
        <IssueDetailsModal
          selectedIssue={selectedIssue}
          onClose={closeModal}
          isCitizenView={true}
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