import React, { useState, useEffect } from 'react';
import getAllAttempts from '../../api/assignment/getAllAttempts.api';
import './AttemptHistory.css';

function AttemptHistory({ assignmentID, onClose }) {
    const [loading, setLoading] = useState(true);
    const [attempts, setAttempts] = useState([]);
    const [statistics, setStatistics] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAttempts = async () => {
            setLoading(true);
            const result = await getAllAttempts(assignmentID);
            
            if (result.success) {
                setAttempts(result.attempts);
                setStatistics(result.statistics);
            } else {
                setError(result.message);
            }
            
            setLoading(false);
        };

        fetchAttempts();
    }, [assignmentID]);

    const formatDate = (dateString) => {
        if (!dateString) return 'In Progress';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="attempt-history-modal">
                <div className="attempt-history-content">
                    <div className="loading">Loading attempt history...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="attempt-history-modal">
                <div className="attempt-history-content">
                    <div className="error-message">{error}</div>
                    <button onClick={onClose} className="close-button">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="attempt-history-modal" onClick={onClose}>
            <div className="attempt-history-content" onClick={(e) => e.stopPropagation()}>
                <div className="attempt-history-header">
                    <h2>Attempt History</h2>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>

                {statistics && (
                    <div className="statistics-section">
                        <div className="stat-card">
                            <div className="stat-label">Current Attempt</div>
                            <div className="stat-value">{statistics.currentAttempt}/{statistics.maxAttempts}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Remaining</div>
                            <div className="stat-value highlight-green">{statistics.remainingAttempts}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Best Score</div>
                            <div className="stat-value highlight-blue">
                                {statistics.bestScore}/{statistics.totalPossiblePoints}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Average Score</div>
                            <div className="stat-value">{statistics.averageScore.toFixed(1)}</div>
                        </div>
                    </div>
                )}

                <div className="attempts-list">
                    <h3>All Attempts</h3>
                    {attempts.length === 0 ? (
                        <p className="no-attempts">No attempts yet</p>
                    ) : (
                        <div className="attempts-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Attempt</th>
                                        <th>Score</th>
                                        <th>Time</th>
                                        <th>Completed</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attempts.map((attempt) => (
                                        <tr 
                                            key={attempt._id}
                                            className={attempt.attemptNumber === statistics?.currentAttempt ? 'current-attempt' : ''}
                                        >
                                            <td>
                                                <span className="attempt-number">#{attempt.attemptNumber}</span>
                                                {attempt.attemptNumber === statistics?.currentAttempt && (
                                                    <span className="current-badge">Current</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className={`score ${attempt.total !== undefined ? 'completed-score' : 'in-progress-score'}`}>
                                                    {attempt.total !== undefined ? `${attempt.total}/${statistics.totalPossiblePoints}` : '-'}
                                                </span>
                                            </td>
                                            <td>{attempt.time || '-'}</td>
                                            <td className="date-cell">{formatDate(attempt.completedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="attempt-history-footer">
                    <button onClick={onClose} className="button">Close</button>
                </div>
            </div>
        </div>
    );
}

export default AttemptHistory;
