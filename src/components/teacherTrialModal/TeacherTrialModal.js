import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import soundEffects from '../../utils/soundEffects';
import './TeacherTrialModal.css';

function TeacherTrialModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartTrial = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    soundEffects.playClick();

    // Set trial data in localStorage
    const trialData = {
      email: email,
      role: 'Teacher_Trial',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      demoClassCreated: true
    };

    localStorage.setItem('teacher_trial', JSON.stringify(trialData));
    localStorage.setItem('O_authWEB', 'trial_token');
    localStorage.setItem('auth_role', 'Teacher');
    localStorage.setItem('isTrialMode', 'true');

    // Navigate to teacher dashboard
    navigate('/dashboard/teacher');
  };

  const handleClose = () => {
    soundEffects.playClick();
    setError('');
    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="trial-modal-overlay" onClick={handleClose}>
      <div className="trial-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="trial-modal-close" onClick={handleClose}>
          ×
        </button>
        
        <div className="trial-modal-header">
          <h2>Start Your 7-Day Teacher Trial</h2>
          <p>Test all teacher features with a demo class</p>
        </div>

        <div className="trial-modal-body">
          <div className="trial-features">
            <div className="trial-feature">
              <span className="trial-feature-icon">✓</span>
              <span>Create assignments</span>
            </div>
            <div className="trial-feature">
              <span className="trial-feature-icon">✓</span>
              <span>Pre-loaded demo students</span>
            </div>
            <div className="trial-feature">
              <span className="trial-feature-icon">✓</span>
              <span>View reports & analytics</span>
            </div>
            <div className="trial-feature">
              <span className="trial-feature-icon">✓</span>
              <span>Test all features for 7 days</span>
            </div>
          </div>

          {error && <div className="trial-error">{error}</div>}

          <div className="trial-input-group">
            <label htmlFor="trial-email">Email Address</label>
            <input
              id="trial-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="trial-input"
            />
          </div>

          <button className="trial-submit-btn" onClick={handleStartTrial}>
            Start Free Trial
          </button>

          <p className="trial-note">
            No credit card required • Full access for 7 days
          </p>
        </div>
      </div>
    </div>
  );
}

export default TeacherTrialModal;
