import React from 'react';
import { Link } from 'react-router-dom';
import soundEffects from '../../utils/soundEffects';
import './GuestBanner.css';

function GuestBanner() {
  return (
    <div className="guest-banner">
      <div className="guest-banner-content">
        <p className="guest-banner-text">
          📚 Practicing as guest • Your progress won't be saved
        </p>
        <Link to="/auth/register" onClick={() => soundEffects.playClick()}>
          <button className="guest-banner-btn">
            Create Account
          </button>
        </Link>
      </div>
    </div>
  );
}

export default GuestBanner;
