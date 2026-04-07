import React, { useState, useEffect } from 'react';
import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import './TeachersList.css';

function TeachersList() {
    const [teachers, setTeachers] = useState([]);
    const [expandedTeachers, setExpandedTeachers] = useState({});

    useEffect(() => {
        loadTeachers();
        window.addEventListener('teachersUpdated', loadTeachers);
        return () => window.removeEventListener('teachersUpdated', loadTeachers);
    }, []);

    const loadTeachers = () => {
        const savedTeachers = JSON.parse(localStorage.getItem('school_teachers') || '[]');
        setTeachers(savedTeachers);
    };

    const toggleExpand = (teacherId) => {
        setExpandedTeachers(prev => ({
            ...prev,
            [teacherId]: !prev[teacherId]
        }));
    };

    const deleteTeacher = (index) => {
        if (window.confirm('Are you sure you want to delete this teacher record?')) {
            const updatedTeachers = teachers.filter((_, i) => i !== index);
            setTeachers(updatedTeachers);
            localStorage.setItem('school_teachers', JSON.stringify(updatedTeachers));
        }
    };

    if (teachers.length === 0) {
        return (
            <div className="teachers-list-container">
                <div className="teachers-empty-state">
                    <h3>👨‍🏫 No Teachers Registered Yet</h3>
                    <p>Teachers registered by your instructors will appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="teachers-list-container">
            <h2 className="teachers-list-title">📊 Registered Teachers and Groups</h2>
            <div className="teachers-grid">
                {teachers.map((teacher, index) => {
                    const isExpanded = expandedTeachers[index];
                    return (
                        <div key={index} className="teacher-card">
                            <div className="teacher-card-header">
                                <div className="teacher-info">
                                    <h3>👨‍🏫 {teacher.teacherName}</h3>
                                    <p className="teacher-meta">
                                        {teacher.groups.length} group{teacher.groups.length !== 1 ? 's' : ''}
                                    </p>
                                    {teacher.submittedByTeacherName && (
                                        <p className="submitted-by">Submitted by: {teacher.submittedByTeacherName}</p>
                                    )}
                                </div>
                                <div className="teacher-actions">
                                    <button
                                        className="expand-btn"
                                        onClick={() => toggleExpand(index)}
                                        title={isExpanded ? 'Collapse' : 'Expand'}
                                    >
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                    </button>
                                    <button
                                        className="delete-btn"
                                        onClick={() => deleteTeacher(index)}
                                        title="Delete teacher"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {isExpanded && (
                                <div className="teacher-card-content">
                                    <div className="groups-list">
                                        {teacher.groups.map((group, groupIndex) => (
                                            <div key={groupIndex} className="group-item">
                                                <div className="group-name">
                                                    <span className="group-icon">📚</span>
                                                    <h4>{group.groupName}</h4>
                                                </div>
                                                <div className="students-list">
                                                    {group.students.map((student, studentIndex) => (
                                                        <div key={studentIndex} className="student-item">
                                                            <span className="student-icon">👤</span>
                                                            <p>{student}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {teacher.createdAt && (
                                        <div className="teacher-timestamp">
                                            <small>Created: {new Date(teacher.createdAt).toLocaleString()}</small>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default TeachersList;
