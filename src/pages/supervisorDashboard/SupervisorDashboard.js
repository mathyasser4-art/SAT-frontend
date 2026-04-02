import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import supervisorDeatails from '../../api/supervisor/supervisorDetails.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import book from '../../img/book.png'
import AssignmentLoading from '../../components/assignmentLoading/AssignmentLoading'
import getAssignment from '../../api/supervisor/getAssignment.api'
import '../../reusable.css'
import './SupervisorDashboard.css'

function SupervisorDashboard() {
    const [teacherList, setTeacherList] = useState([])
    const [allAsignment, setAllAsignment] = useState([])
    const [supervisorName, setSupervisorName] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const isAuth = localStorage.getItem('O_authWEB')

    useEffect(() => {
        const getSupervisorDeatails = () => {
            supervisorDeatails(setLoading, setSupervisorName, setTeacherList)
        }
        if (isAuth) {
            getSupervisorDeatails()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    const getAllAssignment = (teacherID) => {
        getAssignment(setLoadingOperation, setAllAsignment, setError, teacherID)
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
            <MobileNav role="Supervisor" />
            <Navbar />
            <div className="student-dashboard-container">
                {loading ? <DashboardLoading /> : supervisorName === '' ? <p className='text-red text-center'>An error is happend</p> :
                    <div className="student-dashboard-body">
                        <p>{supervisorName}</p>
                        {teacherList?.map(item => {
                            return (
                                <div key={item._id} onClick={() => openHomeWorkList(item._id)} className="teacher-item">
                                    <p>{item.userName}</p>
                                </div>
                            )
                        })}
                    </div>
                }
            </div>

            {/* assignment popup start */}
            <div className="assignment-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='assignment-popup-container popup-top'>
                    <div className="update-popup-head">
                        <p>Assignment Review</p>
                        <button onClick={closeHomeWorkList} className="popup-close-btn" aria-label="Close">
                            <i className="fa fa-times" aria-hidden="true"></i>
                        </button>
                    </div>
                        {loadingOperation ? <AssignmentLoading /> :
                            allAsignment?.map(item => {
                                return (
                                    <div key={item._id} className="popup-body assignment-popup-body">
                                        <div className="assignment-item d-flex align-items-center justify-content-space-between">
                                            <div className="assignment-content">
                                                <h2>{item.title}</h2>
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
                                                    <pre>{`◉ This exam was suspended
for a period of time and number of attempts
when you start it, the timer starts counting ${item?.timer ? `(${item.timer} Minuts)` : '(Open)'}
and you have (${item?.attemptsNumber} Attempts) to finshing exam.`}
                                                    </pre>
                                                </div>
                                            </div>
                                            <div className="assignment-poster">
                                                <img src={book} alt="" />
                                            </div>
                                        </div>
                                        <div className="assignment-footer d-flex flex-wrap align-items-center justify-content-space-between">
                                            <div className="text-footer">
                                                {item?.startDate ? <p>Start Date: {item?.startDate}</p> : null}
                                                {item?.endDate ? <p>Expiry Date: {item?.endDate}</p> : null}
                                            </div>
                                            <p className='created'>Created At: {item?.createdAt}</p>
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
        </>
    )
}

export default SupervisorDashboard