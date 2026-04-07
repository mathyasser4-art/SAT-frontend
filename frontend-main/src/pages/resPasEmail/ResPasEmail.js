import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../img/logo-login.png'
import resetPassEmail from '../../api/loginSystem/resetPassEmail.api'
import '../../reusable.css'
import './ResPasEmail.css'

function ResPasEmail() {
    const [email, setEmail] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleResetPassEmail = () => {
        if (email === '') {
            setError('Email is required!!')
        } else {
            const data = { email }
            resetPassEmail(data, setError, setLoading, navigate)
        }
    }

    return (
        <div className='res-pas-email d-flex flex-direction-column justify-content-center align-items-center'>
            <div className="res-pas-email-logo">
                <Link to={'/'}><img src={logo} alt="" /></Link>
            </div>
            <div className="res-pas-email-title">
                <p>Reset your password</p>
            </div>
            {error ? <div className="error">{error}</div> : null}
            <div className="res-pas-email-input">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email' />
            </div>
            <div className="res-pas-email-btn">
                <div onClick={handleResetPassEmail} className="res-email-btn">{loading ? <span className="loader"></span> : "Reset Your Password"}
                    <div className="res-email-btn2"></div>
                </div>
            </div>
        </div>
    )
}

export default ResPasEmail