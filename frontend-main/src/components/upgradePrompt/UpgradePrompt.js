import React from 'react';
import { Link } from 'react-router-dom';
import soundEffects from '../../utils/soundEffects';
import './UpgradePrompt.css';

function UpgradePrompt({ message, ctaText = "Upgrade Now" }) {
  return (
    <div className="upgrade-prompt">
      <div className="upgrade-prompt-icon">
        <span>🎓</span>
      </div>
      <div className="upgrade-prompt-content">
        <h3 className="upgrade-prompt-title">Upgrade to Get Started</h3>
        <p className="upgrade-prompt-message">
          {message || "Create your first class and start assigning homework to real students"}
        </p>
        <div className="upgrade-prompt-features">
          <div className="upgrade-feature-item">
            <span className="upgrade-check">✓</span>
            <span>Create unlimited classes</span>
          </div>
          <div className="upgrade-feature-item">
            <span className="upgrade-check">✓</span>
            <span>Add real students</span>
          </div>
          <div className="upgrade-feature-item">
            <span className="upgrade-check">✓</span>
            <span>Track progress & reports</span>
          </div>
        </div>
        <Link to="/pricing" onClick={() => soundEffects.playClick()}>
          <button className="upgrade-prompt-btn">
            {ctaText}
          </button>
        </Link>
        <p className="upgrade-prompt-note">
          Full access starts at just $9.99/month
        </p>
      </div>
    </div>
  );
}

export default UpgradePrompt;
