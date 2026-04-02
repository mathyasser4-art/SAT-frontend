import React from 'react'
import '../../reusable.css'
import './QuestionLoading.css'

function QuestionLoading() {
    return (
        <div className='question-loading d-flex justify-content-center flex-direction-column align-items-center'>
            <div className="d-flex flex-wrap loading-number-container">
                <div className="question-loading-number skeleton"></div>
                <div className="question-loading-number skeleton"></div>
                <div className="question-loading-number skeleton"></div>
                <div className="question-loading-number skeleton"></div>
                <div className="question-loading-number skeleton"></div>
                <div className="question-loading-number square1 skeleton"></div>
                <div className="question-loading-number square2 skeleton"></div>
                <div className="question-loading-number square3 skeleton"></div>
                <div className="question-loading-number square4 skeleton"></div>
                <div className="question-loading-number square5 skeleton"></div>
            </div>
            <div className="question-loading-body skeleton"></div>
            <div className="d-flex question-loading-btn-cont">
                <div className="question-loading-btn skeleton"></div>
            </div>
        </div>
    )
}

export default QuestionLoading