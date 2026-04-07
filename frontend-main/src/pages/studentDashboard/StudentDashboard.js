import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import getClass from '../../api/student/getClass.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import boyPointing from '../../img/boy-pointing.svg'
import AssignmentLoading from '../../components/assignmentLoading/AssignmentLoading'
import getAssignment from '../../api/student/getAssignment.api'
import TutorialVideoModal from '../../components/tutorialVideoModal/TutorialVideoModal'
import AttemptHistory from '../../components/attemptHistory/AttemptHistory'
import { NotebookPen, Brain, ChevronRight, HelpCircle, History, CircleCheck } from 'lucide-react'
import API_BASE_URL from '../../config/api.config'
import soundEffects from '../../utils/soundEffects'
import '../../reusable.css'
import './StudentDashboard.css'

function StudentDashboard() {
    const { t } = useTranslation()
    const [teacherList, setTeacherList] = useState([])
    const [allAsignment, setAllAsignment] = useState([])
    const [className, setClassName] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const [showHomework, setShowHomework] = useState(false)
    const [showPracticeOptions, setShowPracticeOptions] = useState(false)
    const [totalAssignments, setTotalAssignments] = useState(0)
    const [unsolvedAssignments, setUnsolvedAssignments] = useState(0)
    const [showTutorialModal, setShowTutorialModal] = useState(false)
    const [showAttemptHistory, setShowAttemptHistory] = useState(false)
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null)
    const isAuth = localStorage.getItem('O_authWEB')

    useEffect(() => {
        const handleGetClass = () => {
            getClass(setLoading, setClassName, setTeacherList)
        }
        if (isAuth) {
            handleGetClass()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch unsolved assignment counts for all teachers
    useEffect(() => {
        const fetchAssignmentCounts = async () => {
            if (teacherList && teacherList.length > 0) {
                let totalCount = 0
                let unsolvedCount = 0

                // Create promises for all teachers
                const promises = teacherList.map(teacher => {
                    const Token = localStorage.getItem('O_authWEB')
                    return fetch(`${API_BASE_URL}/student/getAssignment/${teacher._id}`, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                            'authrization': `pracYas09${Token}`
                        },
                    })
                    .then(response => response.json())
                    .then(responseJson => {
                        if (responseJson.message === 'success' && responseJson.allAssignment) {
                            const assignments = responseJson.allAssignment
                            totalCount += assignments.length
                            
                            // Count unsolved assignments (those not completed or not submitted)
                            const unsolved = assignments.filter(assignment => {
                                // Assignment is unsolved if student hasn't completed it
                                // This depends on your API structure - adjust the condition as needed
                                return !assignment.isCompleted && !assignment.isSubmitted
                            }).length
                            
                            unsolvedCount += unsolved
                        }
                    })
                    .catch(error => {
                        console.log('Error fetching assignments:', error)
                    })
                })

                // Wait for all promises to complete
                await Promise.all(promises)
                
                setTotalAssignments(totalCount)
                setUnsolvedAssignments(unsolvedCount)
            }
        }

        fetchAssignmentCounts()
    }, [teacherList])

    const getAllAssignment = (teacherID) => {
        getAssignment(setLoadingOperation, setAllAsignment, setError, teacherID)
    }

    const openHomeworkSection = () => {
        setShowHomework(true)
    }

    const backToMainMenu = () => {
        setShowHomework(false)
        setShowPracticeOptions(false)
        setError(null)
    }

    const openPracticeOptions = () => {
        setShowPracticeOptions(true)
    }

    const openHomeWorkList = (teacherID) => {
        getAllAssignment(teacherID)
        document.querySelector('.assignment-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.assignment-popup').classList.remove('class-popup-hide')
            document.querySelector('.assignment-popup-container').classList.remove('popup-top')
        }, 50);
    }

    const closeHomeWorkList = () => {
        setError(null)
        document.querySelector('.assignment-popup').classList.add('class-popup-hide')
        document.querySelector('.assignment-popup-container').classList.add('popup-top')
        setTimeout(() => {
            document.querySelector('.assignment-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    return (
        <>
            <MobileNav role="Student" />
            <Navbar />
            
            {/* Floating Help Button */}
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

            <div className="student-dashboard-container">
                {loading ? <DashboardLoading /> : 
                    !showHomework && !showPracticeOptions ? (
                        // Main Menu - Two Card Layout
                        <div className="dashboard-main-menu">
                            <div className="welcome-header">
                                {className && <h2 className="class-name">Welcome to {className}! 👋</h2>}
                            </div>
                            
                            <div className="dashboard-cards">
                                {/* Homework Card - Orange */}
                                <div className="dashboard-card homework-card" onClick={openHomeworkSection}>
                                    <div className="card-icon-wrapper">
                                        <NotebookPen size={48} strokeWidth={2} />
                                    </div>
                                    
                                    <div className="card-stats">
                                        {teacherList && teacherList.length > 0 ? (
                                            <>
                                                <div className="stat-item">
                                                    <span className="stat-number">{unsolvedAssignments > 0 ? unsolvedAssignments : totalAssignments}</span>
                                                    <span className="stat-label">{unsolvedAssignments > 0 ? 'Unsolved' : 'Total'}</span>
                                                </div>
                                                <div className="stat-item">
                                                    <span className="stat-number">{teacherList.length}</span>
                                                    <span className="stat-label">Teachers</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="no-data">No assignments yet</div>
                                        )}
                                    </div>

                                    <button className={`card-button ${unsolvedAssignments > 0 ? 'pulse-animation' : ''}`}>
                                        <span className="homework-text">Homework</span>
                                    </button>
                                </div>

                                {/* Practice Card - Blue */}
                                <div onClick={openPracticeOptions} className="dashboard-card practice-card">
                                    <div className="card-icon-wrapper">
                                        <Brain size={48} strokeWidth={2} />
                                    </div>
                                    
                                    <div className="card-stats">
                                        <div className="stat-item">
                                            <span className="stat-label">{t('academy.freeWorksheets')}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">{t('academy.masterMinds')}</span>
                                        </div>
                                    </div>

                                    <button className="card-button">
                                        <span className="practice-text">Practice</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : showPracticeOptions ? (
                        // Practice Options Section
                        <div className="practice-options-section">
                            <div className="section-header">
                                <button onClick={backToMainMenu} className="back-button">
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                    <span>Back</span>
                                </button>
                                <h2>{t('academy.chooseYourAcademy')}</h2>
                            </div>

                            <div className="practice-options-grid">
                                <Link to="/system/65a4963482dbaac16d820fc6" className="practice-option mental-math">
                                    <div className="practice-option-icon">⚡</div>
                                    <h3>{t('academy.freeWorksheets')}</h3>
                                    <p>{t('academy.freeWorksheetsDesc')}</p>
                                    <button className="practice-option-btn">
                                        <span>{t('academy.start')}</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </Link>

                                <Link to="/system/65a4964b82dbaac16d820fc8" className="practice-option masterminds">
                                    <div className="practice-option-icon">🧠</div>
                                    <h3>{t('academy.masterMinds')}</h3>
                                    <p>{t('academy.masterMindsDesc')}</p>
                                    <button className="practice-option-btn">
                                        <span>{t('academy.start')}</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        // Homework Section - Teacher List
                        <div className="homework-section">
                            <div className="section-header">
                                <button onClick={backToMainMenu} className="back-button">
                                    <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                    <span>Back</span>
                                </button>
                                <h2>My Homework</h2>
                            </div>

                            {className === '' ? (
                                <p className='text-red text-center'>You are not placed in any class yet</p>
                            ) : (
                                <div className="student-dashboard-body">
                                    <p className="class-info">{className}</p>
                                    {teacherList?.map(item => {
                                        return (
                                            <div key={item._id} onClick={() => openHomeWorkList(item._id)} className="teacher-item">
                                                <div className="teacher-info">
                                                    <p className="teacher-name">{item.userName}</p>
                                                    <p className="subject-name">{item?.subject?.schoolSubjectName}</p>
                                                </div>
                                                <ChevronRight size={24} />
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )
                }
            </div>

            {/* assignment popup start */}
            <div className="assignment-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='assignment-popup-container popup-top'>
                    <div className="update-popup-head">
                        <p>HomeWork</p>
                        <button onClick={closeHomeWorkList} className="popup-close-btn" aria-label="Close">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                        {loadingOperation ? <AssignmentLoading /> :
                            allAsignment?.map(item => {
                                const isCompleted = item.isCompleted || item.isSubmitted;
                                return (
                                    <div key={item._id} className={`popup-body assignment-popup-body ${isCompleted ? 'completed-assignment' : ''}`}>
                                        <div className="assignment-item d-flex align-items-center justify-content-space-between">
                                            <div className="assignment-content">
                                                <div className="d-flex align-items-center" style={{ gap: '10px' }}>
                                                    <h2>{item.title}</h2>
                                                    {isCompleted && (
                                                        <CircleCheck size={32} style={{ color: '#4CAF50', flexShrink: 0 }} strokeWidth={2.5} />
                                                    )}
                                                </div>
                                                <div className='d-flex align-items-center assignment-body-container'>
                                                    <div className='assignment-body d-flex align-items-center'>
                                                        <i className="fa fa-clock-o" aria-hidden="true"></i>
                                                        <p>{item?.timer ? `${item.timer} Minuts` : 'Open'}</p>
                                                    </div>
                                                    <div className='assignment-body d-flex align-items-center'>
                                                        <i className="fa fa-recycle" aria-hidden="true"></i>
                                                        <p>{item?.attemptsNumber} Attempts</p>
                                                    </div>
                                                </div>
                                                <div className="assignment-text">
                                                    <p style={{ fontSize: '16px', color: '#555', lineHeight: '1.6' }}>
                                                        📝 <strong>{item?.questionsNumber || 'Multiple'} Questions</strong>
                                                        <br />
                                                        ⏱️ <strong>Duration:</strong> {item?.timer ? `${item.timer} Minutes` : 'No time limit'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="assignment-poster">
                                                <img src={boyPointing} alt="Boy pointing illustration from souandresantana on Pixabay" style={{ width: '180px', height: 'auto', transform: 'scaleX(-1)' }} />
                                            </div>
                                        </div>
                                        <div className="assignment-footer d-flex flex-wrap align-items-center justify-content-space-between">
                                            <div className="text-footer">
                                                {item?.startDate ? <p>Start Date: {item?.startDate}</p> : null}
                                                {item?.endDate ? <p>Expiry Date: {item?.endDate}</p> : null}
                                            </div>
                                             <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                {isCompleted ? (
                                                    <button 
                                                        disabled 
                                                        style={{
                                                            padding: '1.2rem 2.5rem',
                                                            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
                                                            border: '4px solid #fff',
                                                            color: '#fff',
                                                            fontSize: '20px',
                                                            fontWeight: '700',
                                                            borderRadius: '50px',
                                                            cursor: 'not-allowed',
                                                            boxShadow: '0 8px 0 #388E3C, 0 12px 24px rgba(76, 175, 80, 0.4)',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '1px',
                                                            opacity: '0.7'
                                                        }}
                                                    >
                                                        ✓ Completed
                                                    </button>
                                                ) : (
                                                    <Link to={`/student/assignment/${item._id}`}><button>🚀 Start Assignment!</button></Link>
                                                )}
                                                {item?.attemptsNumber > 1 && !isCompleted && (
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setSelectedAssignmentId(item._id);
                                                            setShowAttemptHistory(true);
                                                        }}
                                                        style={{
                                                            background: 'transparent',
                                                            border: '2px solid #0284c7',
                                                            color: '#0284c7',
                                                            padding: '8px 16px',
                                                            borderRadius: '8px',
                                                            cursor: 'pointer',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '6px',
                                                            fontWeight: '500'
                                                        }}
                                                    >
                                                        <History size={16} />
                                                        View Attempts
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    {error ? <p className='text-center'>{error}</p> : null}
                    <button className='button popup-btn' onClick={closeHomeWorkList}>Close</button>
                </div>
            </div>
            {/* assignment popup end */}

            {/* Tutorial Video Modal */}
            <TutorialVideoModal 
                isOpen={showTutorialModal} 
                onClose={() => setShowTutorialModal(false)}
                role="Student"
            />

            {/* Attempt History Modal */}
            {showAttemptHistory && selectedAssignmentId && (
                <AttemptHistory 
                    assignmentID={selectedAssignmentId}
                    onClose={() => {
                        setShowAttemptHistory(false);
                        setSelectedAssignmentId(null);
                    }}
                />
            )}
        </>
    )
}

export default StudentDashboard