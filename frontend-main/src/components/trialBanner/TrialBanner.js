import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import soundEffects from '../../utils/soundEffects';
import './TrialBanner.css';

function TrialBanner() {
  const [daysLeft, setDaysLeft] = useState(7);

  useEffect(() => {
    const trialData = localStorage.getItem('teacher_trial');
    if (trialData) {
      const trial = JSON.parse(trialData);
      const expiryDate = new Date(trial.expiryDate);
      const now = new Date();
      const daysRemaining = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24));
      setDaysLeft(Math.max(0, daysRemaining));
    }
  }, []);

  return (
    <div className="trial-banner">
      <div className="trial-banner-content">
        <p className="trial-banner-text">
          🎉 Free Trial • {daysLeft} {daysLeft === 1 ? 'day' : 'days'} remaining
        </p>
        <Link to="/pricing" onClick={() => soundEffects.playClick()}>
          <button className="trial-banner-btn">
            Upgrade Now
          </button>
        </Link>
      </div>
    </div>
  );
}

export default TrialBanner;
