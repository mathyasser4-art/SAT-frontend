import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import addSubject from '../../api/subject/addSubject.api'
import getSubject from '../../api/subject/getSubject.api'
import updateSubject from '../../api/subject/updateSubject.api'
import removeSubject from '../../api/subject/removeSubject.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import '../../reusable.css'
import './Subject.css'

function Subject() {
    const [subjectName, setSubjectName] = useState('')
    const [subjectID, setSubjectID] = useState()
    const [allSubject, setAllSubject] = useState([])
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')

    useEffect(() => {
        const getAllSubject = async () => {
            await getSubject(setLoading, setAllSubject)
        }
        if (isAuth) {
            getAllSubject()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // add subject func start
    const openAddPopup = () => {
        setSubjectName('')
        setError(null)
        document.querySelector('.add-subject-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.add-subject-popup').classList.remove('subject-popup-hide')
            document.querySelector('.add-subject-container').classList.remove('subject-top')
        }, 50);
    }

    const closeAddPopup = () => {
        document.querySelector('.add-subject-popup').classList.add('subject-popup-hide')
        document.querySelector('.add-subject-container').classList.add('subject-top')
        setTimeout(() => {
            document.querySelector('.add-subject-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const newSubject = () => {
        if (subjectName === '') {
            setError("Subject name is required!!")
        } else {
            const data = { schoolSubjectName: subjectName }
            addSubject(data, setError, setLoadingOperation, closeAddPopup, setAllSubject)
        }
    }
    // add subject func start

    // update subject func start
    const openUpdatePopup = (subjectName, subjectID) => {
        setSubjectName(subjectName)
        setSubjectID(subjectID)
        setError(null)
        document.querySelector('.update-subject-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.update-subject-popup').classList.remove('subject-popup-hide')
            document.querySelector('.update-subject-container').classList.remove('subject-top')
        }, 50);
    }

    const closeUpdatePopup = () => {
        document.querySelector('.update-subject-popup').classList.add('subject-popup-hide')
        document.querySelector('.update-subject-container').classList.add('subject-top')
        setTimeout(() => {
            document.querySelector('.update-subject-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleUpdateSubject = () => {
        if (subjectName === '') {
            setError("Subject name is required!!")
        } else {
            const data = { schoolSubjectName: subjectName }
            updateSubject(data, subjectID, setError, setLoadingOperation, closeUpdatePopup, setAllSubject)
        }
    }
    // update subject func start

    // remove subject func start
    const openRemovePopup = (subjectName, subjectID) => {
        setSubjectName(subjectName)
        setSubjectID(subjectID)
        setError(null)
        document.querySelector('.remove-subject-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.remove-subject-popup').classList.remove('subject-popup-hide')
            document.querySelector('.remove-subject-container').classList.remove('subject-top')
        }, 50);
    }

    const closeRemovePopup = () => {
        document.querySelector('.remove-subject-popup').classList.add('subject-popup-hide')
        document.querySelector('.remove-subject-container').classList.add('subject-top')
        setTimeout(() => {
            document.querySelector('.remove-subject-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleRemoveSubject = () => {
        removeSubject(subjectID, setError, setLoadingOperation, closeRemovePopup, setAllSubject)
    }
    // remove subject func start

    return (
        <>
            <MobileNav role={role} />
            <Navbar />
            <div className="subject-container">
                <div className="subject-header d-flex align-items-center" onClick={openAddPopup}>
                    <p>+</p>
                    <p>Create New Subject</p>
                </div>
                {loading ? <DashboardLoading /> :
                    allSubject?.map(item => {
                        return (
                            <div className="subject-item d-flex justify-content-space-between align-items-center">
                                <p>{item.schoolSubjectName}</p>
                                <div className="subject-icon d-flex align-items-center">
                                    <i className="fa fa-pencil" onClick={() => openUpdatePopup(item.schoolSubjectName, item._id)} aria-hidden="true"></i>
                                    <i className="fa fa-trash" onClick={() => openRemovePopup(item.schoolSubjectName, item._id)} aria-hidden="true"></i>
                                </div>
                            </div>
                        )
                    })}
            </div>

            {/* add subject popup start */}
            <div className="add-subject-popup subject-popup-hide d-none justify-content-center align-items-center">
                <div className='add-subject-container subject-top'>
                    <div className="add-popup-head">
                        <p>Add New Subject</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>Subject Name</label>
                        <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder='Math' />
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeAddPopup}>Cancel</button>
                        <button onClick={newSubject} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Add"}</button>
                    </div>
                </div>
            </div>
            {/* add subject popup end */}

            {/* update subject popup start */}
            <div className="update-subject-popup subject-popup-hide d-none justify-content-center align-items-center">
                <div className='update-subject-container subject-top'>
                    <div className="update-popup-head">
                        <p>Update Subject</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>Subject Name</label>
                        <input type="text" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} placeholder='Math' />
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeUpdatePopup}>Cancel</button>
                        <button onClick={handleUpdateSubject} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Update"}</button>
                    </div>
                </div>
            </div>
            {/* update subject popup end */}

            {/* remove subject popup start */}
            <div className="remove-subject-popup subject-popup-hide d-none justify-content-center align-items-center">
                <div className='remove-subject-container subject-top'>
                    <div className="update-popup-head">
                        <p>Remove Subject (<span className='text-purple'>{subjectName}</span>)</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="remove-popup-body">
                        <h3 className='text-red'>WARNING!!</h3>
                        <p>Are you sure you want to delete this subject?</p>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeRemovePopup}>Cancel</button>
                        <button onClick={handleRemoveSubject} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Delete"}</button>
                    </div>
                </div>
            </div>
            {/* remove subject popup end */}
        </>
    )
}

export default Subject