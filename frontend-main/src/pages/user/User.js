import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import ProfileLoading from '../../components/profileLoading/ProfileLoading'
import NotLogin from '../../components/notLogin/NotLogin'
import avatar from '../../img/avatar.png'
import userInfo from '../../api/authorize/userInfo.api'
import '../../reusable.css'
import './User.css'

function User() {
    const [userData, setUserData] = useState()
    const [loading, setLoading] = useState(true)
    const isAuth = localStorage.getItem('O_authWEB')
    const role = localStorage.getItem('auth_role')

    useEffect(() => {
        const userToken = localStorage.getItem('O_authWEB')
        const getUserInfo = async () => {
            await userInfo(userToken, setLoading, setUserData)
        }
        if (userToken) {
            getUserInfo()
        }
    }, [])

    const logOut = () => {
        localStorage.removeItem('O_authWEB')
        localStorage.removeItem('auth_role')
        localStorage.removeItem('pp_name')
        window.location.reload();
    }

    if (!isAuth) return (<>
        <MobileNav role={role} />
        <NotLogin />
    </>)

    return (
        <>
            <Navbar />
            <MobileNav role={role} />
            {loading ? <ProfileLoading /> : <div className="user-container d-flex justify-content-center align-items-center flex-direction-column">
                <div className="profile-avataer">
                    <img src={avatar} alt="" />
                </div>
                <div className="user-name">
                    <h2>{userData?.userName}</h2>
                    <p>From abacus heroes to our user</p>
                    <p>We help you to remember your information</p>
                </div>
                <div className="user-info">
                    <div className="info d-flex align-items-center">
                        <i className="fa fa-user-o" aria-hidden="true"></i>
                        <p>{userData?.userName}</p>
                    </div>
                    <div className="info d-flex align-items-center">
                        <i className="fa fa-envelope-o" aria-hidden="true"></i>
                        <p>{userData?.email}</p>
                    </div>
                    <div className="info d-flex align-items-center">
                        <i className="fa fa-id-card-o" aria-hidden="true"></i>
                        <p>{userData?.role}</p>
                    </div>
                    {(userData?.role !== 'User') ? userData?.role !== 'School' ? <div className="info d-flex align-items-center">
                        <i className="fa fa-university" aria-hidden="true"></i>
                        <p>{userData?.createdBy?.userName}</p>
                    </div> : null : null}
                </div>
                <div onClick={logOut} className="user-btn">LogOut
                    <div className="user-btn2"></div>
                </div>
                <div className="user-footer">
                    <p>Abacus heroes mangament</p>
                    <p>Wishing you continued progress and success</p>
                </div>
            </div>
            }
        </>
    )
}

export default User