import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link } from 'react-router-dom'
import student from '../../img/avatar-profile.png'
import addIT from '../../api/IT/addIT.api'
import getIT from '../../api/IT/getIT.api'
import updateIT from '../../api/IT/updateIT.api'
import removeIT from '../../api/IT/removeIT.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import '../../reusable.css'
import './IT.css'

function IT() {
    const [itName, setItName] = useState('')
    const [itEmail, setItEmail] = useState('')
    const [itPassword, setItPassword] = useState('')
    const [itID, setItID] = useState('')
    const [itNumber, setItNumber] = useState(0)
    const [allIt, setAllIt] = useState([])
    const [loadingOperation, setLoadingOperation] = useState(false)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    let number = 1
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')

    useEffect(() => {
        const getAllIt = () => {
            getIT(setLoading, setAllIt, setItNumber)
        }
        if (isAuth) {
            getAllIt()
        }
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // add IT func start
    const openAddPopup = () => {
        setItName('')
        setItEmail('')
        setItPassword('')
        setError(null)
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

    const newIT = () => {
        if (itName === '' || itEmail === '' || itPassword === '') {
            setError('All field is required!!')
        } else {
            const data = { userName: itName, email: itEmail, password: itPassword }
            addIT(data, setError, setLoadingOperation, closeAddPopup, setAllIt, setItNumber)
        }
    }
    // add IT func start

    // update IT func start
    const openUpdatePopup = (itID, itName, itEmail) => {
        setItID(itID)
        setItName(itName)
        setItEmail(itEmail)
        setItPassword('')
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

    const handleUpdateIT = () => {
        if (itName === '' || itEmail === '') {
            setError('All field is required!!')
        } else {
            const data = { userName: itName, email: itEmail, password: itPassword !== '' ? itPassword : undefined }
            updateIT(data, setError, setLoadingOperation, closeUpdatePopup, setAllIt, setItNumber, itID)
        }
    }
    // update IT func start

    // remove IT func start
    const openRemovePopup = (itID) => {
        setItID(itID)
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

    const handleRemoveIT = () => {
        removeIT(itID, setError, setLoadingOperation, closeRemovePopup, setAllIt, setItNumber)
    }
    // remove IT func start

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

    return (
        <>
            <MobileNav role={role} />
            <Navbar />
            <div className="student-container">
                <div className="class-header d-flex align-items-center" onClick={openAddPopup}>
                    <p>+</p>
                    <p>Create IT Account</p>
                </div>
                <div className="student-body">
                    {loading ? <DashboardLoading /> : <table>
                        <tbody className='student-header-body'>
                            <tr>
                                <td className='text-purple'>{itNumber}</td>
                                <td>Name ⌄</td>
                                <td>Email ⌄</td>
                                <td>Action ⌄</td>
                            </tr>
                        </tbody>
                        {allIt?.map(item => {
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
                                                <i className="fa fa-pencil" onClick={() => openUpdatePopup(item._id, item.userName, item.email)} aria-hidden="true"></i>
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

            {/* add IT popup start */}
            <div className="add-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='add-student-container update-top'>
                    <div className="add-popup-head">
                        <p>Add New IT</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="add-popup-body">
                        <label>IT Name</label>
                        <input type="text" value={itName} onChange={(e) => setItName(e.target.value)} placeholder='Mahmoud Mohamed Atta' />
                        <label>IT Email</label>
                        <input type="email" value={itEmail} onChange={(e) => setItEmail(e.target.value)} placeholder='mahmoudmohamed@elrwad.com' />
                        <label>IT Password</label>
                        <input className='input-password' value={itPassword} onChange={(e) => setItPassword(e.target.value)} type="password" placeholder='M1803cz@vv' />
                        <div className="show-password d-flex align-items-center">
                            <input type="checkbox" onClick={showPassword} />
                            <p>Show Password</p>
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeAddPopup}>Cancel</button>
                        <button className='button popup-btn2' onClick={newIT}>{loadingOperation ? <span className="loader"></span> : "Add"}</button>
                    </div>
                </div>
            </div>
            {/* add IT popup end */}

            {/* update IT popup start */}
            <div className="update-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='update-student-container update-top'>
                    <div className="update-popup-head">
                        <p>Update IT</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="update-popup-body">
                        <label>IT Name</label>
                        <input value={itName} onChange={(e) => setItName(e.target.value)} type="text" placeholder='Mahmoud Mohamed Atta' />
                        <label>IT Email</label>
                        <input value={itEmail} onChange={(e) => setItEmail(e.target.value)} type="email" placeholder='mahmoudmohamed@elrwad.com' />
                        <label>IT Password</label>
                        <input value={itPassword} onChange={(e) => setItPassword(e.target.value)} className='input-password input-password-update' type="password" placeholder='●●●●●●●●●●●●●●●●●●●●●●●' />
                        <div className="show-password d-flex align-items-center">
                            <input type="checkbox" onClick={showUpdatePassword} />
                            <p>Show Password</p>
                        </div>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeUpdatePopup}>Cancel</button>
                        <button className='button popup-btn2' onClick={handleUpdateIT}>{loadingOperation ? <span className="loader"></span> : "Update"}</button>
                    </div>
                </div>
            </div>
            {/* update IT popup end */}

            {/* remove IT popup start */}
            <div className="remove-student-popup student-popup-hide d-none justify-content-center align-items-center">
                <div className='remove-student-container update-top'>
                    <div className="update-popup-head">
                        <p>Remove IT</p>
                    </div>
                    {error ? <div className="error error-dengare">{error}</div> : null}
                    <div className="remove-popup-body">
                        <p>Are you sure you want to delete this IT?</p>
                    </div>
                    <div className="update-popup-footer">
                        <button className='button popup-btn' onClick={closeRemovePopup}>No</button>
                        <button className='button popup-btn2' onClick={handleRemoveIT}>{loadingOperation ? <span className="loader"></span> : "Yes"}</button>
                    </div>
                </div>
            </div>
            {/* remove IT popup end */}
        </>
    )
}

export default IT