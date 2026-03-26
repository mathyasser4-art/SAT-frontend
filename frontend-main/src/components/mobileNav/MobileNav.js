import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import soundEffects from '../../utils/soundEffects';
import './MobileNav.css';

function MobileNav({ role }) {
  const { t } = useTranslation();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Hide navigation for students
  if (role === 'Student') {
    return null;
  }

  const getDashboardLink = () => {
    switch (role) {
      case 'School':
      case 'IT':
        return '/dashboard-school';
      case 'Teacher':
        return '/dashboard/teacher';
      case 'Student':
        return '/dashboard/student';
      case 'Supervisor':
        return '/dashboard/supervisor';
      default:
        return null;
    }
  };

  const dashboardLink = getDashboardLink();

  return (
    <nav className='nav-mobile'>
      <div className='nav-mobile-container'>
        <Link 
          to={'/'} 
          onClick={() => soundEffects.playClick()}
          className={`nav-item ${isActive('/') ? 'active' : ''}`}
        >
          <i className="fa fa-home" aria-hidden="true"></i>
          <span className="nav-label">{t('mobileNav.home')}</span>
        </Link>

        <Link 
          to={'/system/65a4963482dbaac16d820fc6'} 
          onClick={() => soundEffects.playClick()}
          className={`nav-item ${isActive('/system/65a4963482dbaac16d820fc6') ? 'active' : ''}`}
        >
          <i className="fa fa-tasks" aria-hidden="true"></i>
          <span className="nav-label">{t('mobileNav.worksheets')}</span>
        </Link>

        <Link 
          to={'/system/65a4964b82dbaac16d820fc8'} 
          onClick={() => soundEffects.playClick()}
          className={`nav-item ${isActive('/system/65a4964b82dbaac16d820fc8') ? 'active' : ''}`}
        >
          <i className="fa fa-file-text-o" aria-hidden="true"></i>
          <span className="nav-label">{t('mobileNav.masterminds')}</span>
        </Link>

        {dashboardLink && (
          <Link 
            to={dashboardLink} 
            onClick={() => soundEffects.playClick()}
            className={`nav-item ${isActive(dashboardLink) ? 'active' : ''}`}
          >
            <i className="fa fa-graduation-cap" aria-hidden="true"></i>
            <span className="nav-label">{t('mobileNav.homework')}</span>
          </Link>
        )}

        <Link 
          to={'/contact'} 
          onClick={() => soundEffects.playClick()}
          className={`nav-item ${isActive('/contact') ? 'active' : ''}`}
        >
          <i className="fa fa-headphones" aria-hidden="true"></i>
          <span className="nav-label">{t('mobileNav.help')}</span>
        </Link>

        <Link 
          to={'/user/info'} 
          onClick={() => soundEffects.playClick()}
          className={`nav-item ${isActive('/user/info') ? 'active' : ''}`}
        >
          <i className="fa fa-user" aria-hidden="true"></i>
          <span className="nav-label">{t('mobileNav.profile')}</span>
        </Link>
      </div>
    </nav>
  );
}

export default MobileNav;
