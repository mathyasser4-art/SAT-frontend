import React from 'react'
import '../../reusable.css'
import './DashboardLoading.css'

function DashboardLoading() {
    return (
        <div>
            <div className="dashboard-loading-item skeleton"></div>
            <div className="dashboard-loading-item skeleton"></div>
            <div className="dashboard-loading-item skeleton"></div>
            <div className="dashboard-loading-item skeleton"></div>
        </div>
    )
}

export default DashboardLoading