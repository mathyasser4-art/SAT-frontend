import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import QuestionType from '../questionType/QuestionType'
import ContactUS from '../contact/ContactUS'
import TeacherTrialModal from '../../components/teacherTrialModal/TeacherTrialModal'
import TutorialVideoModal from '../../components/tutorialVideoModal/TutorialVideoModal'
import soundEffects from '../../utils/soundEffects'
import { GraduationCap, Presentation } from 'lucide-react'
import hand from '../../img/hand.png'
import '../../reusable.css'
import './Home.css'

function Home() {
  const { t } = useTranslation()
  const role = localStorage.getItem('auth_role')
  const navigate = useNavigate()
  const [showTrialModal, setShowTrialModal] = useState(false)
  const [showTutorialModal, setShowTutorialModal] = useState(false)
  
  useEffect(() => {
    // Redirect students directly to their dashboard
    if (role === 'Student') {
      navigate('/dashboard/student')
    }
  }, [role, navigate])
  
  return (
    <>
      <MobileNav role={role} />
      
      {/* Floating Help Button */}
      {role === 'Teacher' && (
        <button 
          className="floating-help-btn"
          onClick={() => {
            soundEffects.playClick();
            setShowTutorialModal(true);
          }}
          aria-label="Tutorial Video"
          title="Watch Tutorial"
        >
          Help
        </button>
      )}
      
      <div className='home'>
        <Navbar />
        <div className="home-container">
          <div className="home-title">
            <h1 className='text-purple'>{t('home.welcomeTo')}</h1>
            <h1 className='text-red'>{t('home.abacusHeroes')}</h1>
          </div>
          <div className="home-paragraph">
            <p>{t('home.tagline')}</p>
          </div>
          
          {!role && (
            <div className="home-options">
              <div className="home-option-card" onClick={() => { soundEffects.playClick(); navigate('/system/65a4963482dbaac16d820fc6'); }}>
                <div className="option-icon">
                  <GraduationCap size={48} strokeWidth={2.5} />
                </div>
                <h3>{t('home.practiceAsStudent')}</h3>
                <p>{t('home.practiceDescription')}</p>
                <span className="option-badge">{t('home.noLoginRequired')}</span>
              </div>

              <div className="home-option-card" onClick={() => { soundEffects.playClick(); setShowTrialModal(true); }}>
                <div className="option-icon teacher-icon">
                  <Presentation size={48} strokeWidth={2.5} />
                </div>
                <h3>{t('home.tryTeacherFeatures')}</h3>
                <p>{t('home.tryTeacherDescription')}</p>
                <span className="option-badge trial-badge">{t('home.freeTrialBadge')}</span>
              </div>
            </div>
          )}
          
          <Link to="/pricing" className="home-btn" onClick={() => soundEffects.playClick()}>
            <span className="btn-text">{t('home.joinNow')}</span>
            <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>
      
      <TeacherTrialModal isOpen={showTrialModal} onClose={() => setShowTrialModal(false)} />
      <TutorialVideoModal isOpen={showTutorialModal} onClose={() => setShowTutorialModal(false)} />
      <div className='home-mobile'>
        <Navbar />
        <div className="home-title">
          <h1 className='text-purple'>{t('home.welcomeTo')}</h1>
          <h1 className='text-red'>{t('home.abacusHeroes')}</h1>
        </div>
      </div>
      <QuestionType />
      <ContactUS />
    </>
  )
}

export default Home