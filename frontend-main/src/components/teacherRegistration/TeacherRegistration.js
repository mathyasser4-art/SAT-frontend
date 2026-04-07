import React, { useState } from 'react';
import { X } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';
import './TeacherRegistration.css';

function TeacherRegistration({ onClose, onSave }) {
    const [teacherName, setTeacherName] = useState('');
    const [groups, setGroups] = useState([
        { id: 1, groupName: '', students: [''], groupId: Date.now() }
    ]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGroupNameChange = (index, value) => {
        const newGroups = [...groups];
        newGroups[index].groupName = value;
        setGroups(newGroups);
    };

    const handleStudentNameChange = (groupIndex, studentIndex, value) => {
        const newGroups = [...groups];
        newGroups[groupIndex].students[studentIndex] = value;
        setGroups(newGroups);
    };

    const addStudentField = (groupIndex) => {
        const newGroups = [...groups];
        newGroups[groupIndex].students.push('');
        setGroups(newGroups);
    };

    const removeStudentField = (groupIndex, studentIndex) => {
        const newGroups = [...groups];
        if (newGroups[groupIndex].students.length > 1) {
            newGroups[groupIndex].students.splice(studentIndex, 1);
            setGroups(newGroups);
        }
    };

    const addGroup = () => {
        setGroups([...groups, {
            id: groups.length + 1,
            groupName: '',
            students: [''],
            groupId: Date.now()
        }]);
    };

    const removeGroup = (index) => {
        if (groups.length > 1) {
            const newGroups = groups.filter((_, i) => i !== index);
            setGroups(newGroups);
        }
    };

    const handleSave = () => {
        setError(null);

        if (!teacherName.trim()) {
            setError('Teacher name is required!');
            return;
        }

        const filteredGroups = groups.filter(group => group.groupName.trim());
        if (filteredGroups.length === 0) {
            setError('Please add at least one group with a name!');
            return;
        }

        for (let group of filteredGroups) {
            const validStudents = group.students.filter(s => s.trim());
            if (validStudents.length === 0) {
                setError(`Group "${group.groupName}" must have at least one student!`);
                return;
            }
        }

        setLoading(true);
        const formattedGroups = filteredGroups.map(group => ({
            groupName: group.groupName,
            students: group.students.filter(s => s.trim())
        }));

        const data = {
            teacherName: teacherName.trim(),
            groups: formattedGroups,
            createdAt: new Date().toISOString()
        };

        onSave(data);
        setLoading(false);
    };

    return (
        <div className="teacher-registration-modal">
            <div className="teacher-registration-container">
                <div className="teacher-registration-header">
                    <h2>📚 Teacher Registration Form</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {error && <div className="error error-dengare">{error}</div>}

                <div className="teacher-registration-body">
                    <div className="teacher-name-section">
                        <label>Teacher's Name <span className="required">*</span></label>
                        <input
                            type="text"
                            placeholder="Enter teacher's name"
                            value={teacherName}
                            onChange={(e) => setTeacherName(e.target.value)}
                            className="teacher-name-input"
                        />
                    </div>

                    <div className="groups-section">
                        <h3>📊 Groups and Students</h3>
                        {groups.map((group, groupIndex) => (
                            <div key={group.groupId} className="group-card">
                                <div className="group-header">
                                    <input
                                        type="text"
                                        placeholder="Enter group name (e.g., Class 1A, Group 1)"
                                        value={group.groupName}
                                        onChange={(e) => handleGroupNameChange(groupIndex, e.target.value)}
                                        className="group-name-input"
                                    />
                                    {groups.length > 1 && (
                                        <button
                                            className="remove-group-btn"
                                            onClick={() => removeGroup(groupIndex)}
                                            title="Remove group"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="students-section">
                                    <label>Students in this group:</label>
                                    {group.students.map((student, studentIndex) => (
                                        <div key={studentIndex} className="student-input-row">
                                            <input
                                                type="text"
                                                placeholder={`Student ${studentIndex + 1} name`}
                                                value={student}
                                                onChange={(e) => handleStudentNameChange(groupIndex, studentIndex, e.target.value)}
                                                className="student-name-input"
                                            />
                                            {group.students.length > 1 && (
                                                <button
                                                    className="remove-student-btn"
                                                    onClick={() => removeStudentField(groupIndex, studentIndex)}
                                                    title="Remove student"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        className="add-student-btn"
                                        onClick={() => addStudentField(groupIndex)}
                                    >
                                        + Add Student
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button className="add-group-btn" onClick={addGroup}>
                            + Add New Group
                        </button>
                    </div>
                </div>

                <div className="teacher-registration-footer">
                    <button className="button popup-btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="button popup-btn2" 
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? <span className="loader"></span> : 'Save Teacher Data'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TeacherRegistration;
