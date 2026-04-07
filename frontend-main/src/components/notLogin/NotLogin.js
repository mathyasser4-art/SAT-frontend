import React from 'react'
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import '../../reusable.css'
import './NotLogin.css'

function NotLogin() {
    return (
        <>
        <Navbar />
        <div className='not-login d-flex justify-content-center align-items-center flex-direction-column'>
            <p>You cannot access this page until you are logged in</p>
            <Link to={'/auth/login'}><div className="not-login-btn">Login
                <div className="not-login-btn2"></div>
            </div></Link>
        </div>
        </>
    )
}

export default NotLogin;