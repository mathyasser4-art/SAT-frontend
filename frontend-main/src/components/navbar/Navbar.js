import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../../logo.png'
import profileImg from '../../img/avatar-profile.png'
import school from '../../img/school-avatar.png'
import soundEffects from '../../utils/soundEffects'
import TeacherRegistration from '../teacherRegistration/TeacherRegistration'
import '../../reusable.css'
import './Navbar.css'

const Navbar = () => {
    const { t } = useTranslation();
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')
    const [showTeacherForm, setShowTeacherForm] = useState(false)

    const openTeacherForm = () => {
        soundEffects.playClick()
        setShowTeacherForm(true)
    }

    const closeTeacherForm = () => {
        setShowTeacherForm(false)
    }

    const handleSaveTeacher = (data) => {
        // Save to school account with teacher attribution
        // Append teacher ID to identify which teacher submitted the data
        const teacherID = localStorage.getItem('pp_id')
        const dataWithTeacherId = {
            ...data,
            submittedByTeacherId: teacherID,
            submittedByTeacherName: localStorage.getItem('pp_name')
        }
        
        // Store in a combined key that includes teacher data
        const existingTeachers = JSON.parse(localStorage.getItem('school_teachers') || '[]')
        existingTeachers.push(dataWithTeacherId)
        localStorage.setItem('school_teachers', JSON.stringify(existingTeachers))
        
        soundEffects.playClick()
        setShowTeacherForm(false)
        // Dispatch both events so both teacher and school dashboards update
        window.dispatchEvent(new CustomEvent('teachersUpdated'))
        window.dispatchEvent(new CustomEvent('teacherDataUpdated'))
    }

    return (

        <nav>
            <div className='nav-container d-flex justify-content-space-between align-items-center'>
                <Link to={'/'} onClick={() => soundEffects.playClick()}><img src={logo} alt="" /></Link>
                <div className='nav-right-side d-flex align-items-center'>
                    {role === 'School' ? <Link to={'/dashboard-school'} onClick={() => soundEffects.playClick()}><div className="homework-btn"><span>📚</span> HOMEWORK</div></Link> : null}
                    {role === 'Teacher' ? <div className="teachers-btn" onClick={openTeacherForm}><span>👨‍🏫</span> TEACHERS</div> : null}
                    {role === 'Teacher' ? <Link to={'/dashboard/teacher'} onClick={() => soundEffects.playClick()}><div className="homework-btn"><span>📚</span> HOMEWORK</div></Link> : null}
                    {role === 'Student' ? <Link to={'/dashboard/student'} onClick={() => soundEffects.playClick()}><div className="homework-btn"><span>📚</span> HOMEWORK</div></Link> : null}
                    {role === 'IT' ? <Link to={'/dashboard-school'} onClick={() => soundEffects.playClick()}><div className="homework-btn"><span>📚</span> HOMEWORK</div></Link> : null}
                    {role === 'Supervisor' ? <Link to={'/dashboard/supervisor'} onClick={() => soundEffects.playClick()}><div className="homework-btn"><span>📚</span> HOMEWORK</div></Link> : null}
                    {isAuth ? role === 'School' ? <Link to={'/user/info'} onClick={() => soundEffects.playClick()}><img className='school-avatar' src={school} alt="" /></Link> : <Link to={'/user/info'} onClick={() => soundEffects.playClick()}><img src={profileImg} alt="" /></Link> : (
                        <>
                            <Link to={'/auth/register'} onClick={() => soundEffects.playClick()}>
                                <div className="nav-btn nav-btn-signup" style={{ marginRight: '15px' }}>
                                    {t('auth.signUp')}
                                    <div className="nav-btn2"></div>
                                </div>
                            </Link>
                            <Link to={'/auth/login'} onClick={() => soundEffects.playClick()}>
                                <div className="nav-btn">
                                    {t('common.login')}
                                    <div className="nav-btn2"></div>
                                </div>
                            </Link>
                        </>
                    )}
                    
                </div>
            </div>
            {showTeacherForm && (
                <TeacherRegistration
                    onClose={closeTeacherForm}
                    onSave={handleSaveTeacher}
                />
            )}
        </nav >
    );
}

export default Navbar;
