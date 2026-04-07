import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import student from '../../img/avatar-profile.png'
import addStudent from '../../api/student/addStudent.api'
import getStudent from '../../api/student/getStudent.api'
import getClass from '../../api/class/getClass.api'
import updateStudent from '../../api/student/updateStudent.api'
import removeStudent from '../../api/student/removeStudent.api'
import searchStudent from '../../api/student/searchStudent.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import '../../reusable.css'
import './Student.css'

function Student() {
    const [studentName, setStudentName] = useState('')
    const [studentEmail, setStudentEmail] = useState('')
    const [studentPassword, setStudentPassword] = useState('')
    const [studentClass, setStudentClass] = useState('')
    const [searchValue, setSearchValue] = useState('')
    const [studentID, setStudentID] = useState('')
    const [allClass, setAllClass] = useState([])
    let [pageNumber, setPageNumber] = useState(1)
    const [totalPage, setTotalPage] = useState()
    const [studentNumber, setStudentNumber] = useState(0)
    const [allStudent, setAllStudent] = useState([])
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [classLoading, setClassLoading] = useState(true)
    let number = 1
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')

    useEffect(() => {
        const getAllStudent = () => {
            getStudent(setLoading, setAllStudent, pageNumber, setStudentNumber, setTotalPage)
            getClass(setClassLoading, setAllClass)
        }
        if (isAuth) {
            getAllStudent()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // add student func start
    const openAddPopup = () => {
        setStudentName('')
        setStudentEmail('')
        setStudentPassword('')
        setError(null)
        setStudentClass('')
        document.querySelector('.add-student-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.add-student-popup').classList.remove('student-popup-hide')
            document.querySelector('.add-student-container').classList.remove('update-top')
        }, 50);
    }

    const closeAddPopup = () => {
        document.querySelector('.add-student-popup').classList.add('student-popup-hide')
        document.querySelector('.add-student-container').classList.add('update-top')
        setTimeout(() => {
            document.querySelector('.add-student-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const newStudent = () => {
        if (studentName === '' || studentEmail === '' || studentPassword === '') {
            setError('All field is required!!')
        } else {
            let data = {}
            if (studentClass !== '' && studentClass !== 'Select Class') {
                const classID = allClass.filter(e => e.class === studentClass)[0]._id
                data = { userName: studentName, email: studentEmail, password: studentPassword, class: classID }
            } else {
                data = { userName: studentName, email: studentEmail, password: studentPassword }
            }
            addStudent(data, setError, setLoadingOperation, closeAddPopup, pageNumber, setAllStudent, setStudentNumber, setTotalPage)
        }
    }
    // add student func start

    // update student func start
    const openUpdatePopup = (studentID, studentName, studentEmail, studentClass) => {
        setStudentID(studentID)
        setStudentName(studentName)
        setStudentEmail(studentEmail)
        if (studentClass)
            setStudentClass(studentClass.class)
        else
            setStudentClass('')
        setStudentPassword('')
        setError(null)
        document.querySelector('.update-student-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.update-student-popup').classList.remove('student-popup-hide')
            document.querySelector('.update-student-container').classList.remove('update-top')
        }, 50);
    }

    const closeUpdatePopup = () => {
        document.querySelector('.update-student-popup').classList.add('student-popup-hide')
        document.querySelector('.update-student-container').classList.add('update-top')
        setTimeout(() => {
            document.querySelector('.update-student-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleUpdateStudent = () => {
        if (studentName === '' || studentEmail === '') {
            setError('All field is required!!')
        } else {
            let data = {}
            if (studentClass !== '' && studentClass !== 'Select Class') {
                const classID = allClass.filter(e => e.class === studentClass)[0]._id
                data = { userName: studentName, email: studentEmail, password: studentPassword !== '' ? studentPassword : undefined, class: classID }
            } else {
                data = { userName: studentName, email: studentEmail, password: studentPassword !== '' ? studentPassword : undefined }
            }
            updateStudent(data, setError, setLoadingOperation, closeUpdatePopup, pageNumber, setAllStudent, setStudentNumber, studentID, setTotalPage)
        }
    }
    // update student func start

    // remove student func start
    const openRemovePopup = (studentID) => {
        setStudentID(studentID)
        setError(null)
        document.querySelector('.remove-student-popup').classList.replace('d-none', 'd-flex')
        setTimeout(() => {
            document.querySelector('.remove-student-popup').classList.remove('student-popup-hide')
            document.querySelector('.remove-student-container').classList.remove('update-top')
        }, 50);
    }

    const closeRemovePopup = () => {
        document.querySelector('.remove-student-popup').classList.add('student-popup-hide')
        document.querySelector('.remove-student-container').classList.add('update-top')
        setTimeout(() => {
            document.querySelector('.remove-student-popup').classList.replace('d-flex', 'd-none')
        }, 300);
    }

    const handleRemoveStudent = () => {
        removeStudent(studentID, setError, setLoadingOperation, closeRemovePopup, pageNumber, setAllStudent, setStudentNumber, setTotalPage)
    }
    // remove student func start

    const search = (searchKey) => {
        setSearchValue(searchKey)
        if (searchKey === '') {
            getStudent(setLoading, setAllStudent, pageNumber, setStudentNumber, setTotalPage)
        } else {
            searchStudent(setLoading, setAllStudent, searchKey)
        }
    }


    const showPassword = () => {
        const inputPassword = document.querySelector('.input-password')
        if (inputPassword.type === 'password')
            inputPassword.type = 'text'
        else
            inputPassword.type = 'password'
    }

    const showUpdatePassword = () => {
        const inputPassword = document.querySelector('.input-password-update')
        if (inputPassword.type === 'password')
            inputPassword.type = 'text'
        else
            inputPassword.type = 'password'
    }

    const next = () => {
        if (pageNumber !== totalPage) {
            const lastPage = pageNumber + 1
            setPageNumber(lastPage)
            getStudent(setLoading, setAllStudent, lastPage, setStudentNumber, setTotalPage)
        }
    }

    const previous = () => {
        if (pageNumber !== 1) {
            const lastPage = pageNumber - 1
            setPageNumber(lastPage)
            getStudent(setLoading, setAllStudent, lastPage, setStudentNumber, setTotalPage)
        }
    }

    return (
        <>
            <MobileNav role={role} />
            <Navbar />
            <div className="student-container">
                <div className="student-header d-flex align-items-center">
                    <input type="text" onChange={(e) => search(e.target.value)} placeholder='Enter student name...' />
                    <div className='add-squer d-flex justify-content-space-around align-items-center' onClick={openAddPopup}><p>+</p></div>
                </div>
                <div className="student-body">
                    {loading ? <DashboardLoading /> : <table>
                        <tbody className='student-header-body'>
                            <tr>
                                <td className='text-purple'>{studentNumber}</td>
                                <td>Name ⌄</td>
                                <td>Email ⌄</td>
                                <td>Class ⌄</td>
                                <td>Action ⌄</td>
                            </tr>
                        </tbody>
                        {allStudent?.map(item => {
                            return (
                                <React.Fragment key={item._id}>
                                    <tbody className='student-row'>
                                        <tr>
                                            <td>{number++}</td>
                                            <td className='d-flex student-name align-items-center'>
                                                <img src={student} alt="" />
                                                <p>{item.userName}</p>
                                            </td>
                                            <td>{item.email}</td>
                                            <td>{item.class ? item.class.class : '______'}</td>
                                            <td className="student-action">
                                                <i className="fa fa-pencil" onClick={() => openUpdatePopup(item._id, item.userName, item.email, item.class)} aria-hidden="true"></i>
                                                <i className="fa fa-trash" onClick={() => openRemovePopup(item._id)} aria-hidden="true"></i>
                                            </td>
                                        </tr>
                                    </tbody><br />
                                </React.Fragment>
                            )
                        })}
                    </table>}
                </div>
                {loading ? null : (searchValue !== '') ? null : (allStudent.length === 0) ? (pageNumber === 1) ? null : <div className="student-footer d-flex align-items-center">
                    <button onClick={previous}>Previous</button>
                    <button onClick={next}>Next</button>
                </div> : <div className="student-footer d-flex align-items-center">
                    <button onClick={previous}>Previous</button>
                    <button onClick={next}>Next</button>
                </div>}
            </div>

            {/* add student popup start */}
            <div className="add-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='add-student-container update-top'>
                    <div className="add-popup-head">
                        <p>Add New Student</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>Student Name</label>
                        <input type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder='Mahmoud Mohamed Atta' />
                        <label>Student Email</label>
                        <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder='mahmoudmohamed@elrwad.com' />
                        <label>Student Password</label>
                        <input className='input-password' value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} type="password" placeholder='M1803cz@vv' />
                        <div className="show-password d-flex align-items-center">
                            <input type="checkbox" onClick={showPassword} />
                            <p>Show Password</p>
                        </div>
                        <div className="add-popup-select-class">
                            <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
                                <option>Select Class</option>
                                {classLoading ? <option>Waiting Classes...</option> : null}
                                {allClass?.map(item => {
                                    return (
                                        <option key={item._id}>{item.class}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeAddPopup}>Cancel</button>
                        <button className='button popup-btn2' onClick={newStudent}>{loadingOperation ? <span className="loader"></span> : "Add"}</button>
                    </div>
                </div>
            </div>
            {/* add student popup end */}

            {/* update student popup start */}
            <div className="update-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='update-student-container update-top'>
                    <div className="update-popup-head">
                        <p>Update Student</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="update-popup-body">
                        <label>Student Name</label>
                        <input value={studentName} onChange={(e) => setStudentName(e.target.value)} type="text" placeholder='Mahmoud Mohamed Atta' />
                        <label>Student Email</label>
                        <input value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} type="email" placeholder='mahmoudmohamed@elrwad.com' />
                        <label>Student Password</label>
                        <input value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} className='input-password input-password-update' type="password" placeholder='●●●●●●●●●●●●●●●●●●●●●●●' />
                        <div className="show-password d-flex align-items-center">
                            <input type="checkbox" onClick={showUpdatePassword} />
                            <p>Show Password</p>
                        </div>
                        <div className="update-popup-select-class">
                            <select value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
                                {studentClass !== '' ? <option>{studentClass}</option> : <option>Select Class</option>}
                                {classLoading ? <option>Waiting Classes...</option> : null}
                                {allClass?.map(item => {
                                    return (
                                        <option key={item._id}>{item.class}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeUpdatePopup}>Cancel</button>
                        <button className='button popup-btn2' onClick={handleUpdateStudent}>{loadingOperation ? <span className="loader"></span> : "Update"}</button>
                    </div>
                </div>
            </div>
            {/* update student popup end */}

            {/* remove student popup start */}
            <div className="remove-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='remove-student-container update-top'>
                    <div className="update-popup-head">
                        <p>Remove Student</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="remove-popup-body">
                        <p>Are you sure you want to delete this student?</p>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeRemovePopup}>No</button>
                        <button className='button popup-btn2' onClick={handleRemoveStudent}>{loadingOperation ? <span className="loader"></span> : "Yes"}</button>
                    </div>
                </div>
            </div>
            {/* remove student popup end */}
        </>
    )
}

export default Student