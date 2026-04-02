import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../logo.png'
import register from '../../api/auth/register.api'
import '../../reusable.css'
import './Register.css'

function Register() {
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cPassword, setCpassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleRegister = () => {
        if(userName === '' || email === '' || password === '' || cPassword === ''){
            setError('All field is required!!')
        }else{
            const userData = {userName, email, password, cPassword}
            register(userData, setError, setLoading, navigate)
        }
    }

    return (
        <div className='register d-flex flex-direction-column justify-content-center align-items-center'>
            <div className="register-logo">
                <Link to={'/'}><img src={logo} alt="" /></Link>
            </div>
            <div className="register-title">
                <p>Create an Account</p>
            </div>
            {error ? <div className="error">{error}</div> : null}
            <div className="register-form">
                <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder='Enter your name' />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Email' />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
                <input type="password" value={cPassword} onChange={e => setCpassword(e.target.value)} placeholder='Confirm Password' />
            </div>
            <div className="register-btn-container">
                <div onClick={handleRegister} className="register-btn">{loading ? <span className="loader"></span> : "Sign Up"}
                    <div className="register-btn2"></div>
                </div>
            </div>
            <div className="register-footer">
                <p>Already have an account? <Link to={'/auth/login'}><span className='text-purple'>Login</span></Link></p>
            </div>
        </div>
    )
}

export default Register