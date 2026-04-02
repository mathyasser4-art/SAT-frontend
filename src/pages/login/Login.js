import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../logo.png'
import google from '../../img/google-icon.png'
import login from '../../api/auth/login.api'
import { useGoogleLogin } from '@react-oauth/google';
import authWithGoogle from '../../api/auth/authWithGoogle.api'
import '../../reusable.css'
import './Login.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const showAlert = () => {
        document.querySelector('.alert').classList.add('alert-active')
        setTimeout(() => {
            document.querySelector('.alert').classList.remove('alert-active')
        }, 3500);
    }

    const handleLogin = () => {
        if (email === '' || password === '') {
            setError('All field is required!!')
        } else {
            const userData = { email, password }
            login(userData, setError, setLoading, navigate, showAlert)
        }
    }

    const loginWithGoogle = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            const { access_token } = tokenResponse
            const data = { access_token }
            authWithGoogle(data)
        }
    });

    return (
        <div className='login d-flex flex-direction-column justify-content-center align-items-center'>
            <div className="login-logo">
                <Link to={'/'}><img src={logo} alt="" /></Link>
            </div>
            <div className="login-title">
                <p>Sign in to your account</p>
            </div>
            {error ? <div className="error">{error}</div> : null}
            <div className="login-form">
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder='Enter your email or username' />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder='Password' />
                <Link to={'/resetPassword/email'}><p className='text-purple'>Forget Your Password?</p></Link>
            </div>
            <div className="login-btn-container">
                <div onClick={handleLogin} className="login-btn">{loading ? <span className="loader"></span> : "Login"}
                    <div className="login-btn2"></div>
                </div>
            </div>
            <div className="login-or d-flex justify-content-center align-items-center">
                <div className='or-line'></div>
                <p className='or-text'>OR</p>
                <div className='or-line'></div>
            </div>
            <div onClick={() => loginWithGoogle()} className="google-btn d-flex justify-content-center align-items-center">
                <img src={google} alt="" />
                <p>Sign in with Google</p>
            </div>
            <div className="login-footer">
                <p>Don't have account? <Link to={'/auth/register'}><span className='text-purple'>Sign up</span></Link></p>
            </div>

        </div>
    )
}

export default Login