import React from 'react'
import '../../reusable.css'
import './SystemLoading.css'

function SystemLoading() {
    return (
        <div className='system-loading'>
            <div className="system-loading-item skeleton"></div>
            <div className="system-loading-item skeleton"></div>
        </div>
    )
}

export default SystemLoading;