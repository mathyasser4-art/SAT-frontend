import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import student from '../../img/avatar-profile.png'
import addSupervisor from '../../api/supervisor/addSupervisor.api'
import getSupervisor from '../../api/supervisor/getSupervisor.api'
import getTeacher from '../../api/supervisor/getTeacher.api'
import updateSupervisor from '../../api/supervisor/updateSupervisor.api'
import removeSupervisor from '../../api/supervisor/removeSupervisor.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import '../../reusable.css'
import './Supervisor.css'

function Supervisor() {
    const [supervisorName, setSupervisorName] = useState('')
    const [supervisorEmail, setSupervisorEmail] = useState('')
    const [supervisorPassword, setSupervisorPassword] = useState('')
    const [supervisorID, setSupervisorID] = useState('')
    let [teacherSelector, setTeacherSelector] = useState('')
    const [allTecaher, setAllTecaher] = useState([])
    const [supervisorNumber, setSupervisorNumber] = useState(0)
    const [allSupervisor, setAllSupervisor] = useState([])
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [teachersBox, setTeachersBox] = useState([])
    let number = 1
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')

    useEffect(() => {
        const getAllSupervisor = () => {
            getSupervisor(setLoading, setAllSupervisor, setSupervisorNumber)
            getTeacher(setAllTecaher)
        }
        if (isAuth) {
            getAllSupervisor()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // add supervisor func start
    const openAddPopup = () => {
        setSupervisorName('')
        setSupervisorEmail('')
        setSupervisorPassword('')
        setError(null)
        setTeachersBox([])
        setTeacherSelector('')
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

    const newSupervisor = () => {
        if (supervisorName === '' || supervisorEmail === '' || supervisorPassword === '') {
            setError('All field is required!!')
        } else if (teachersBox.length === 0) {
            setError('You must select teacher first!!')
        } else {
            const teacherPocket = []
            for (let index = 0; index < teachersBox.length; index++) {
                const element = teachersBox[index];
                teacherPocket.push(element._id)
            }
            const data = { userName: supervisorName, email: supervisorEmail, password: supervisorPassword, teacherList: teacherPocket }
            addSupervisor(data, setError, setLoadingOperation, closeAddPopup, setAllSupervisor, setSupervisorNumber)
        }
    }
    // add supervisor func start

    // update supervisor func start
    const openUpdatePopup = (supervisorID, supervisorName, supervisorEmail, teacherList) => {
        setSupervisorID(supervisorID)
        setSupervisorName(supervisorName)
        setSupervisorEmail(supervisorEmail)
        setSupervisorPassword('')
        setError(null)
        setTeachersBox(teacherList)
        setTeacherSelector('')
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

    const handleUpdateSupervisor = () => {
        if (supervisorName === '' || supervisorEmail === '') {
            setError('All field is required!!')
        } else if (teachersBox.length === 0) {
            setError('You must select teacher first!!')
        } else {
            const teacherPocket = []
            for (let index = 0; index < teachersBox.length; index++) {
                const element = teachersBox[index];
                teacherPocket.push(element._id)
            }
            const data = { userName: supervisorName, email: supervisorEmail, teacherList: teacherPocket, password: supervisorPassword !== '' ? supervisorPassword : undefined }
            updateSupervisor(data, setError, setLoadingOperation, closeUpdatePopup, setAllSupervisor, setSupervisorNumber, supervisorID)
        }
    }
    // update supervisor func start

    // remove supervisor func start
    const openRemovePopup = (studentID) => {
        setSupervisorID(studentID)
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

    const handleRemoveSupervisor = () => {
        removeSupervisor(supervisorID, setError, setLoadingOperation, closeRemovePopup, setAllSupervisor, setSupervisorNumber)
    }
    // remove supervisor func start

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

    const addTeacherToBox = () => {
        if (teacherSelector === '' || teacherSelector === 'Select Tecaher' || teacherSelector === 'There is no tecaher now') {
            setError('You must select teacher first')
        } else {
            setError(null)
            if (teacherSelector === 'All Teachers') {
                setTeachersBox(allTecaher)
            } else {
                const findTeacher = teachersBox.filter(e => e.userName === teacherSelector)[0]
                if (findTeacher) {
                    setError('This teacher is already added')
                } else {
                    const getTeacher = allTecaher.filter(e => e.userName === teacherSelector)[0]
                    setTeachersBox(teachersBox => [...teachersBox, getTeacher]);
                }
            }
        }
    }

    const removeTeacherFromBox = (thisTeacher) => {
        const newArray = teachersBox.filter(e => e.userName !== thisTeacher)
        setTeachersBox(newArray)
    }

    return (
        <>
            <MobileNav role={role} />
            <Navbar />
            <div className="student-container">
                <div className="class-header d-flex align-items-center" onClick={openAddPopup}>
                    <p>+</p>
                    <p>Create Supervisor Account</p>
                </div>
                <div className="student-body">
                    {loading ? <DashboardLoading /> : <table>
                        <tbody className='student-header-body'>
                            <tr>
                                <td className='text-purple'>{supervisorNumber}</td>
                                <td>Name ⌄</td>
                                <td>Email ⌄</td>
                                <td>Action ⌄</td>
                            </tr>
                        </tbody>
                        {allSupervisor?.map(item => {
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
                                            <td className="student-action">
                                                <i className="fa fa-pencil" onClick={() => openUpdatePopup(item._id, item.userName, item.email, item.teacherList)} aria-hidden="true"></i>
                                                <i className="fa fa-trash" onClick={() => openRemovePopup(item._id)} aria-hidden="true"></i>
                                            </td>
                                        </tr>
                                    </tbody><br />
                                </React.Fragment>
                            )
                        })}
                    </table>}
                </div>
            </div>

            {/* add supervisor popup start */}
            <div className="add-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='add-student-container update-top'>
                    <div className="add-popup-head">
                        <p>Add New Supervisor</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>Supervisor Name</label>
                        <input type="text" value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} placeholder='Sup Mahmoud Mohamed' />
                        <label>Supervisor Email</label>
                        <input type="email" value={supervisorEmail} onChange={(e) => setSupervisorEmail(e.target.value)} placeholder='mahmoudmohamed@elrwad.com' />
                        <label>Supervisor Password</label>
                        <input className='input-password' value={supervisorPassword} onChange={(e) => setSupervisorPassword(e.target.value)} type="password" placeholder='M1803cz@vv' />
                        <div className="show-password d-flex align-items-center">
                            <input type="checkbox" onClick={showPassword} />
                            <p>Show Password</p>
                        </div>
                        <div className="select-container d-flex">
                            <div className="select-class">
                                <select value={teacherSelector} onChange={(e) => setTeacherSelector(e.target.value)}>
                                    <option>Select Tecaher</option>
                                    {allTecaher?.length === 0 ? <option>There is no tecaher now</option> : <option>All Teachers</option>}
                                    {allTecaher?.map(item => {
                                        return (
                                            <option key={item._id}>{item.userName}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <button onClick={addTeacherToBox}>Add</button>
                        </div>
                        <div className='class-selector-container d-flex flex-wrap align-items-center'>
                            {teachersBox?.map(item => {
                                return (
                                    <div key={item._id} className="class-selector">
                                        <p>{item.userName}</p>
                                        <div onClick={() => removeTeacherFromBox(item.userName)}>
                                            <p>x</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeAddPopup}>Cancel</button>
                        <button className='button popup-btn2' onClick={newSupervisor}>{loadingOperation ? <span className="loader"></span> : "Add"}</button>
                    </div>
                </div>
            </div>
            {/* add supervisor popup end */}

            {/* update supervisor popup start */}
            <div className="update-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='update-student-container update-top'>
                    <div className="update-popup-head">
                        <p>Update Supervisor</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="update-popup-body">
                        <label>Supervisor Name</label>
                        <input value={supervisorName} onChange={(e) => setSupervisorName(e.target.value)} type="text" placeholder='Sup Mahmoud Mohamed' />
                        <label>Supervisor Email</label>
                        <input value={supervisorEmail} onChange={(e) => setSupervisorEmail(e.target.value)} type="email" placeholder='mahmoudmohamed@elrwad.com' />
                        <label>Supervisor Password</label>
                        <input value={supervisorPassword} onChange={(e) => setSupervisorPassword(e.target.value)} className='input-password input-password-update' type="password" placeholder='●●●●●●●●●●●●●●●●●●●●●●●' />
                        <div className="show-password d-flex align-items-center">
                            <input type="checkbox" onClick={showUpdatePassword} />
                            <p>Show Password</p>
                        </div>
                        <div className="select-container d-flex">
                            <div className="select-class">
                                <select value={teacherSelector} onChange={(e) => setTeacherSelector(e.target.value)}>
                                    <option>Select Teacher</option>
                                    {allTecaher?.length === 0 ? <option>There is no tecaher now</option> : <option>All Teachers</option>}
                                    {allTecaher?.map(item => {
                                        return (
                                            <option key={item._id}>{item.userName}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <button onClick={addTeacherToBox}>Add</button>
                        </div>
                        <div className='class-selector-container d-flex flex-wrap align-items-center'>
                            {teachersBox?.map(item => {
                                return (
                                    <div key={item._id} className="class-selector">
                                        <p>{item.userName}</p>
                                        <div onClick={() => removeTeacherFromBox(item.userName)}>
                                            <p>x</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeUpdatePopup}>Cancel</button>
                        <button className='button popup-btn2' onClick={handleUpdateSupervisor}>{loadingOperation ? <span className="loader"></span> : "Update"}</button>
                    </div>
                </div>
            </div>
            {/* update supervisor popup end */}

            {/* remove supervisor popup start */}
            <div className="remove-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='remove-student-container update-top'>
                    <div className="update-popup-head">
                        <p>Remove Supervisor</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="remove-popup-body">
                        <p>Are you sure you want to delete this supervisor?</p>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeRemovePopup}>No</button>
                        <button className='button popup-btn2' onClick={handleRemoveSupervisor}>{loadingOperation ? <span className="loader"></span> : "Yes"}</button>
                    </div>
                </div>
            </div>
            {/* remove supervisor popup end */}
        </>
    )
}

export default Supervisor