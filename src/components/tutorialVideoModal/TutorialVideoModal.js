import React from 'react';
import { X } from 'lucide-react';
import soundEffects from '../../utils/soundEffects';
import './TutorialVideoModal.css';

function TutorialVideoModal({ isOpen, onClose, role }) {
  const handleClose = () => {
    soundEffects.playClick();
    onClose();
  };

  if (!isOpen) return null;

  // Determine which video to show based on role
  const videoUrl = role === 'Student' 
    ? '/videos/student-tutorial.mp4' 
    : '/videos/teacher-tutorial.mp4';

  const modalTitle = role === 'Student'
    ? 'How to Use Abacus Heroes - Student Guide'
    : 'How to Use Abacus Heroes - Teacher Guide';

  const videoDescription = role === 'Student'
    ? 'Learn how to open your homework and practice questions'
    : 'Learn how to create homework and use all teacher features';

  return (
    <div className="tutorial-modal-overlay" onClick={handleClose}>
      <div className="tutorial-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="tutorial-modal-close" onClick={handleClose} aria-label="Close tutorial">
          <X size={24} />
        </button>
        
        <div className="tutorial-modal-header">
          <h2>{modalTitle}</h2>
          <p>{videoDescription}</p>
        </div>

        <div className="tutorial-modal-body">
          <div className="video-wrapper">
            <video 
              controls 
              className="tutorial-video"
              preload="metadata"
            >
              <source src={videoUrl} type="video/mp4" />
              <p className="video-fallback">
                Your browser does not support the video tag. Please try using a modern browser like Chrome, Firefox, or Safari.
              </p>
            </video>
          </div>

          <div className="tutorial-tips">
            <p className="tip-title">💡 Quick Tips:</p>
            <ul className="tips-list">
              {role === 'Student' ? (
                <>
                  <li>Check your homework regularly for new assignments</li>
                  <li>Practice questions to improve your skills</li>
                  <li>Use the timer to track your progress</li>
                </>
              ) : (
                <>
                  <li>Create engaging assignments for your students</li>
                  <li>Track student progress with detailed reports</li>
                  <li>Set timers and attempt limits for better control</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TutorialVideoModal;
