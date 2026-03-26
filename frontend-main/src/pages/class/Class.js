import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import addClass from '../../api/class/addClass.api'
import getClass from '../../api/class/getClass.api'
import updateClass from '../../api/class/updateClass.api'
import removeClass from '../../api/class/removeClass.api'
import getTeacherToClass from '../../api/teacher/getTeacherToClass.api'
import addTeacherToClass from '../../api/teacher/addTeacherToClass.api'
import getClassStudent from '../../api/class/getClassStudent.api'
import removeStudentFromClass from '../../api/student/removeStudentFromClass.api'
import removeTeacherFromClass from '../../api/teacher/removeTeacherFromClass.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import '../../reusable.css'
import './Class.css'

function Class() {
    const [className, setClassName] = useState('')
    const [classID, setClassID] = useState()
    const [allClass, setAllClass] = useState([])
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [teacherLoading, setTeacherLoading] = useState(true)
    const [studentLoading, setStudentLoading] = useState(true)
    const [allTeacher, setAllTeacher] = useState([])
    const [classStudent, setClassStudent] = useState([])
    const [teacherList, setTeacherList] = useState([])
    const [noStudent, setNoStudent] = useState(false)
    const [noTeacher, setNoTeacher] = useState(false)
    const [teacher, setTeacher] = useState('')
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')

    useEffect(() => {
        const getAllClass = () => {
            getClass(setLoading, setAllClass)
            getTeacherToClass(setTeacherLoading, setAllTeacher)
        }
        if (isAuth) {
            getAllClass()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // add class func start
    const openAddPopup = () => {
        setClassName('')
        setError(null)
        document.querySelector('.add-class-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.add-class-popup').classList.remove('class-popup-hide')
            document.querySelector('.add-class-container').classList.remove('class-top')
        }, 50);
    }

    const closeAddPopup = () => {
        document.querySelector('.add-class-popup').classList.add('class-popup-hide')
        document.querySelector('.add-class-container').classList.add('class-top')
        setTimeout(() => {
            document.querySelector('.add-class-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const newClass = () => {
        if (className === '') {
            setError("Class name is required!!")
        } else {
            const data = { class: className }
            addClass(data, setError, setLoadingOperation, closeAddPopup, setAllClass)
        }
    }
    // add class func end

    // update class func start
    const openUpdatePopup = (className, classID) => {
        setClassName(className)
        setClassID(classID)
        setError(null)
        document.querySelector('.update-class-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.update-class-popup').classList.remove('class-popup-hide')
            document.querySelector('.update-class-container').classList.remove('class-top')
        }, 50);
    }

    const closeUpdatePopup = () => {
        document.querySelector('.update-class-popup').classList.add('class-popup-hide')
        document.querySelector('.update-class-container').classList.add('class-top')
        setTimeout(() => {
            document.querySelector('.update-class-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleUpdateClass = () => {
        if (className === '') {
            setError("Class name is required!!")
        } else {
            const data = { class: className }
            updateClass(data, classID, setError, setLoadingOperation, closeUpdatePopup, setAllClass)
        }
    }
    // update class func end

    // remove class func start
    const openRemovePopup = (className, classID) => {
        setClassName(className)
        setClassID(classID)
        setError(null)
        document.querySelector('.remove-class-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.remove-class-popup').classList.remove('class-popup-hide')
            document.querySelector('.remove-class-container').classList.remove('class-top')
        }, 50);
    }

    const closeRemovePopup = () => {
        document.querySelector('.remove-class-popup').classList.add('class-popup-hide')
        document.querySelector('.remove-class-container').classList.add('class-top')
        setTimeout(() => {
            document.querySelector('.remove-class-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleRemoveClass = () => {
        removeClass(classID, setError, setLoadingOperation, closeRemovePopup, setAllClass)
    }
    // remove class func end

    // add to class func start
    const openAddToPopup = (className, classID) => {
        setClassName(className)
        setClassID(classID)
        setTeacher('')
        setError(null)
        document.querySelector('.add-to-class-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.add-to-class-popup').classList.remove('class-popup-hide')
            document.querySelector('.add-to-class-container').classList.remove('class-top')
        }, 50);
    }

    const closeAddToPopup = () => {
        document.querySelector('.add-to-class-popup').classList.add('class-popup-hide')
        document.querySelector('.add-to-class-container').classList.add('class-top')
        setTimeout(() => {
            document.querySelector('.add-to-class-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleAddToClass = () => {
        if (teacher === '') {
            setError("Teacher name is required!!")
        } else {
            const teacherID = allTeacher.filter(e => e.userName === teacher)[0]._id
            addTeacherToClass(setError, setLoadingOperation, closeAddToPopup, classID, teacherID, setAllClass)
        }
    }
    // add to class func end

    // student list func start
    const getStudent = (classID) => {
        getClassStudent(setStudentLoading, setClassStudent, classID, setNoStudent)
    }

    const openStudentListPopup = (classID) => {
        setClassID(classID)
        setError(null)
        getStudent(classID)
        document.querySelector('.student-list-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.student-list-popup').classList.remove('class-popup-hide')
            document.querySelector('.student-list-container').classList.remove('class-top')
        }, 50);
    }

    const closeStudentListPopup = () => {
        document.querySelector('.student-list-popup').classList.add('class-popup-hide')
        document.querySelector('.student-list-container').classList.add('class-top')
        setTimeout(() => {
            document.querySelector('.student-list-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleRemoveStudent = (studentID) => {
        removeStudentFromClass(setLoadingOperation, setError, setClassStudent, classID, studentID, setNoStudent)
    }
    // student list func end

    // teacher list func start
    const openTeacherListPopup = (classID, teacherList) => {
        setClassID(classID)
        setError(null)
        setTeacherList(teacherList)
        if (teacherList.length === 0)
            setNoTeacher(true)
        else
            setNoTeacher(false)
        document.querySelector('.teacher-list-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.teacher-list-popup').classList.remove('class-popup-hide')
            document.querySelector('.teacher-list-container').classList.remove('class-top')
        }, 50);
    }

    const closeTeacherListPopup = () => {
        document.querySelector('.teacher-list-popup').classList.add('class-popup-hide')
        document.querySelector('.teacher-list-container').classList.add('class-top')
        setTimeout(() => {
            document.querySelector('.teacher-list-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleRemoveTeacher = (teacherID) => {
        removeTeacherFromClass(setLoadingOperation, setError, setTeacherList, classID, teacherID, setAllClass)
    }
    // teacher list func end


    return (
        <>
            <MobileNav role={role} />
            <Navbar />
            <div className="class-container">
                <div className="class-header d-flex align-items-center" onClick={openAddPopup}>
                    <p>+</p>
                    <p>Create New Class</p>
                </div>
                {loading ? <DashboardLoading /> :
                    allClass?.map(item => {
                        return (
                            <div key={item._id} className="class-item d-flex justify-content-space-between align-items-center">
                                <p>{item.class}</p>
                                <div className="class-icon d-flex align-items-center">
                                    <i className="fa fa-plus" onClick={() => openAddToPopup(item.class, item._id)} aria-hidden="true"></i>
                                    <i className="fa fa-pencil" onClick={() => openUpdatePopup(item.class, item._id)} aria-hidden="true"></i>
                                    <i className="fa fa-trash" onClick={() => openRemovePopup(item.class, item._id)} aria-hidden="true"></i>
                                    <div className="dropdown">
                                        <button className="dropbtn">▼</button>
                                        <div className="dropdown-content">
                                            <p onClick={() => openStudentListPopup(item._id)}>Show Students</p>
                                            <p onClick={() => openTeacherListPopup(item._id, item.teachers)}>Show Teachers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
            </div>

            {/* add class popup start */}
            <div className="add-class-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='add-class-container class-top'>
                    <div className="add-popup-head">
                        <p>Add New Class</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>Class Name</label>
                        <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder='Class C35' />
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeAddPopup}>Cancel</button>
                        <button onClick={newClass} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Add"}</button>
                    </div>
                </div>
            </div>
            {/* add class popup end */}

            {/* update class popup start */}
            <div className="update-class-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='update-class-container class-top'>
                    <div className="update-popup-head">
                        <p>Update Class</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>Class Name</label>
                        <input type="text" value={className} onChange={(e) => setClassName(e.target.value)} placeholder='Class C35' />
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeUpdatePopup}>Cancel</button>
                        <button onClick={handleUpdateClass} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Update"}</button>
                    </div>
                </div>
            </div>
            {/* update class popup end */}

            {/* remove class popup start */}
            <div className="remove-class-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='remove-class-container class-top'>
                    <div className="update-popup-head">
                        <p>Remove Class (<span className='text-purple'>{className}</span>)</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="remove-popup-body">
                        <p>Are you sure you want to delete this class?</p>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeRemovePopup}>No</button>
                        <button onClick={handleRemoveClass} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Yes"}</button>
                    </div>
                </div>
            </div>
            {/* remove class popup end */}

            {/* add teacher to class popup start */}
            <div className="add-to-class-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='add-to-class-container class-top'>
                    <div className="update-popup-head">
                        <p>Add Teacher To Class (<span className='text-purple'>{className}</span>)</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-to-popup-body">
                        <div className="add-popup-select-class">
                            <select value={teacher} onChange={(e) => setTeacher(e.target.value)}>
                                <option>Select Teacher</option>
                                {teacherLoading ? <option>Waiting Teachers...</option> : null}
                                {allTeacher?.map(item => {
                                    return (
                                        <option key={item._id}>{item.userName}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeAddToPopup}>Cancel</button>
                        <button onClick={handleAddToClass} className='button popup-btn2'>{loadingOperation ? <span className="loader"></span> : "Add"}</button>
                    </div>
                </div>
            </div>
            {/* add teacher to class popup end */}

            {/*student list popup start */}
            <div className="add-to-class-popup student-list-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='add-to-class-container student-list-container class-top'>
                    <div className="update-popup-head">
                        <p>Students List</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-to-popup-body">
                        {studentLoading ? <DashboardLoading /> : (noStudent) ? <p>Oops!!There are no any students in this class yet.</p> :
                            classStudent.map(item => {
                                return (
                                    <div key={item._id} className="student-item d-flex align-items-center justify-content-space-between">
                                        <p>{item.userName}</p>
                                        <i className="fa fa-trash" onClick={() => handleRemoveStudent(item._id)} aria-hidden="true"></i>
                                    </div>
                                )
                            })}
                        {loadingOperation ? <div className="front-layer d-flex justify-content-center align-items-center">
                            <span className="loader-percentage"></span>
                        </div> : null}
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeStudentListPopup}>Close</button>
                    </div>
                </div>
            </div>
            {/*student list popup end */}

            {/*teacher list popup start */}
            <div className="add-to-class-popup teacher-list-popup class-popup-hide d-none justify-content-center align-items-center">
                <div className='add-to-class-container teacher-list-container class-top'>
                    <div className="update-popup-head">
                        <p>Teachers List</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-to-popup-body">
                        {noTeacher ? <p>Oops!!There are no any teachers in this class yet.</p> : 
                        teacherList.map(item => {
                            return (
                                <div key={item._id} className="student-item d-flex align-items-center justify-content-space-between">
                                    <p>{item.userName}</p>
                                    <i className="fa fa-trash" onClick={() => handleRemoveTeacher(item._id)} aria-hidden="true"></i>
                                </div>
                            )
                        })}
                        {loadingOperation ? <div className="front-layer d-flex justify-content-center align-items-center">
                            <span className="loader-percentage"></span></div> : null}
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeTeacherListPopup}>Close</button>
                    </div>
                </div>
            </div>
            {/*teacher list popup end */}
        </>
    )
}

export default Class