import React from 'react'
import '../../reusable.css'
import './ProfileLoading.css'

function ProfileLoading() {
    return (
        <div className='profile-loading d-flex justify-content-center align-items-center flex-direction-column'>
            <div className="profile-loading-img skeleton"></div>
            <div className="profile-loading-name skeleton"></div>
            <div className="profile-loading-paragraph1 skeleton"></div>
            <div className="profile-loading-paragraph2 skeleton"></div>
            <div className="profile-loading-body skeleton"></div>
            <div className="profile-loading-button skeleton"></div>
            <div className="profile-loading-paragraph1 skeleton"></div>
            <div className="profile-loading-paragraph2 skeleton"></div>
        </div>
    )
}

export default ProfileLoading