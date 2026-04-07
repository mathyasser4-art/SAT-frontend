import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import logo from '../../img/logo-login.png'
import resetPassword from '../../api/loginSystem/resetPassword.api'
import '../../reusable.css'
import './ResetPassword.css'

function ResetPassword() {
    const [password, setPassword] = useState('')
    const [cPassword, setCpassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const { email } = useParams()
    const navigate = useNavigate()

    const handleResetPassword = () => {
        if (password === '' || cPassword === '') {
            setError('All field is required!!')
        } else {
            const data = { email, password, cPassword }
            resetPassword(data, setError, setLoading, navigate)
        }
    }

    return (
        <div className='reset-password d-flex flex-direction-column justify-content-center align-items-center'>
            <div className="reset-password-logo">
                <Link to={'/'}><img src={logo} alt="" /></Link>
            </div>
            <div className="reset-password-title">
                <p>Enter your new password</p>
            </div>
            {error ? <div className="error">{error}</div> : null}
            <div className="reset-password-input d-flex flex-direction-column justify-content-center align-items-center">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='New Password' />
                <input type="password" value={cPassword} onChange={e => setCpassword(e.target.value)} placeholder='Confirm Password' />
            </div>
            <div className="reset-password-btn-cont">
                <div onClick={handleResetPassword} className="reset-password-btn">{loading ? <span className="loader"></span> : "Reset Your Password"}
                    <div className="reset-password-btn2"></div>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword