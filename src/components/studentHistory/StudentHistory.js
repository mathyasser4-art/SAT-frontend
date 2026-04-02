import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { History, ArrowLeft, FileText, Clock, Award, Calendar } from 'lucide-react';
import getStudentHistory from '../../api/teacher/getStudentHistory.api';
import API_BASE_URL from '../../config/api.config';
import '../../reusable.css';
import './StudentHistory.css';

function StudentHistory() {
  const [studentData, setStudentData] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { studentID } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentHistory = async () => {
      try {
        setLoading(true);
        console.log('📊 Fetching history for student:', studentID);

        const token = localStorage.getItem('O_authWEB');
        if (!token) {
          setError({
            type: 'auth',
            message: 'You are not logged in. Please login as a teacher to view student history.'
          });
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/teacher/student/${studentID}/history`, {
          headers: {
            'authrization': 'pracYas09' + token,
          }
        });

        const data = await response.json();
        console.log('📦 Student history data:', data);

        if (response.status === 502 || response.status === 401 || response.status === 403) {
          setError({
            type: 'auth',
            message: 'Authentication failed. Your session may have expired.',
            details: data.message
          });
          setLoading(false);
          return;
        }

        if (data.message === 'success') {
          setStudentData(data.student);
          setAssignments(data.assignments || []);
        } else {
          setError({
            type: 'api',
            message: 'Failed to load student history',
            details: data.message
          });
        }
      } catch (error) {
        console.error('❌ Error fetching student history:', error);
        setError({
          type: 'network',
          message: 'Network error occurred',
          details: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentHistory();
  }, [studentID]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#28a745';
    if (percentage >= 80) return '#17a2b8';
    if (percentage >= 70) return '#ffc107';
    if (percentage >= 60) return '#fd7e14';
    return '#dc3545';
  };

  const calculateStats = () => {
    if (assignments.length === 0) return null;

    const totalScore = assignments.reduce((sum, a) => sum + a.score, 0);
    const totalPossible = assignments.reduce((sum, a) => sum + a.totalPossible, 0);
    // Calculate average as the mean of individual assignment percentages
    const averagePercentage = assignments.length > 0 
      ? Math.round(assignments.reduce((sum, a) => sum + a.percentage, 0) / assignments.length)
      : 0;
    const highestPercentage = Math.max(...assignments.map(a => a.percentage));
    const lowestPercentage = Math.min(...assignments.map(a => a.percentage));

    return {
      totalAssignments: assignments.length,
      averagePercentage,
      highestPercentage,
      lowestPercentage,
      totalScore,
      totalPossible
    };
  };

  if (loading) {
    return (
      <div className="student-history-container">
        <nav>
          <div className='nav-container d-flex justify-content-space-between align-items-center'>
            <Link to={'/'}><img src="/logo-Photoroom.png" alt="Logo" /></Link>
            <div className='nav-right-side d-flex align-items-center'>
              <Link to={'/dashboard/teacher'} className="back-btn">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <div className="history-content">
          <div className="loading-state">
            <i className="fa fa-spinner fa-spin"></i>
            <h2>Loading student history...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-history-container">
        <nav>
          <div className='nav-container d-flex justify-content-space-between align-items-center'>
            <Link to={'/'}><img src="/logo-Photoroom.png" alt="Logo" /></Link>
            <div className='nav-right-side d-flex align-items-center'>
              <Link to={'/dashboard/teacher'} className="back-btn">
                <ArrowLeft size={16} /> Back to Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <div className="history-content">
          <div className="error-state">
            <i className="fa fa-exclamation-triangle"></i>
            <h2>{error.type === 'auth' ? '🔒 Authentication Error' : '⚠️ Error Loading History'}</h2>
            <p>{error.message}</p>
            {error.details && <p className="error-details">{error.details}</p>}
            
            {error.type === 'auth' && (
              <div className="error-actions">
                <button onClick={handleLogout} className="btn-logout">
                  <i className="fa fa-sign-out"></i> Logout & Login Again
                </button>
                <button onClick={() => window.location.reload()} className="btn-retry">
                  <i className="fa fa-refresh"></i> Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="student-history-container">
      <nav>
        <div className='nav-container d-flex justify-content-space-between align-items-center'>
          <Link to={'/'}><img src="/logo-Photoroom.png" alt="Logo" /></Link>
          <div className='nav-right-side d-flex align-items-center'>
            <Link to={'/dashboard/teacher'} className="back-btn">
              <ArrowLeft size={16} /> Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="history-content">
        {/* Student Header */}
        <div className="history-header">
          <div className="student-header-info">
            <History size={32} className="history-icon" />
            <div>
              <h1>{studentData?.userName || 'Student'}'s Assignment History</h1>
              <p className="student-email">{studentData?.email || ''}</p>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        {stats && (
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">
                <FileText size={24} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Total Assignments</p>
                <p className="stat-value">{stats.totalAssignments}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#e3f2fd' }}>
                <Award size={24} style={{ color: '#1976d2' }} />
              </div>
              <div className="stat-info">
                <p className="stat-label">Average Score</p>
                <p className="stat-value">{stats.averagePercentage}%</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#e8f5e9' }}>
                <i className="fa fa-arrow-up" style={{ color: '#388e3c', fontSize: '20px' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Highest Score</p>
                <p className="stat-value">{stats.highestPercentage}%</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: '#fff3e0' }}>
                <i className="fa fa-arrow-down" style={{ color: '#f57c00', fontSize: '20px' }}></i>
              </div>
              <div className="stat-info">
                <p className="stat-label">Lowest Score</p>
                <p className="stat-value">{stats.lowestPercentage}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div className="assignments-history">
          <h2><FileText size={24} /> Assignment Records</h2>
          
          {assignments.length === 0 ? (
            <div className="no-assignments">
              <i className="fa fa-inbox"></i>
              <h3>No Assignments Completed Yet</h3>
              <p>This student hasn't completed any assignments.</p>
            </div>
          ) : (
            <div className="assignments-list">
              {assignments.map((assignment, index) => {
                const gradeColor = getGradeColor(assignment.percentage);
                const gradeLetter = getGradeLetter(assignment.percentage);
                
                return (
                  <div key={assignment._id || index} className="assignment-history-card">
                    <div className="assignment-number">#{index + 1}</div>
                    
                    <div className="assignment-main-info">
                      <h3 className="assignment-title">
                        {assignment.assignmentTitle || 'Untitled Assignment'}
                      </h3>
                      
                      <div className="assignment-meta">
                        <span className="meta-item">
                          <Calendar size={14} />
                          Completed: {formatDateTime(assignment.completedAt)}
                        </span>
                        <span className="meta-item">
                          <Clock size={14} />
                          Time: {assignment.timeSpent || '0:00'}
                        </span>
                      </div>

                      <div className="assignment-details-row">
                        <div className="detail-item">
                          <span className="detail-label">Questions:</span>
                          <span className="detail-value">
                            {assignment.answeredQuestions || 0} / {assignment.totalQuestions || 'N/A'}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Points:</span>
                          <span className="detail-value">
                            {assignment.score} / {assignment.totalPossible}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="assignment-score-section">
                      <div className="score-circle" style={{ borderColor: gradeColor }}>
                        <div className="percentage" style={{ color: gradeColor }}>
                          {assignment.percentage}%
                        </div>
                        <div className="grade-letter" style={{ color: gradeColor }}>
                          {gradeLetter}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/teacher/assignmentReport/${studentID}/${assignment.assignmentID}`}
                        className="view-details-btn"
                      >
                        <FileText size={16} /> View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default StudentHistory;
