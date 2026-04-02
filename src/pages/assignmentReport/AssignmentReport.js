import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar/Navbar'
import MobileNav from '../../components/mobileNav/MobileNav'
import { Link, useParams } from 'react-router-dom'
import getAnswers from '../../api/assignment/getAnswers.api'
import correctAnswer from '../../api/assignment/correctAnswer.api'
import DashboardLoading from '../../components/dashboardLoading/DashboardLoading'
import MathInput from "react-math-keyboard";
import '../../reusable.css'
import './AssignmentReport.css'

function AssignmentReport() {
  const [allAnswers, setAllAnswers] = useState([])
  const [imgURL, setImgURL] = useState('')
  const [result, setResult] = useState('')
  const [time, setTime] = useState('')
  const [assignmentData, setAssignmentData] = useState()
  const [loading, setLoading] = useState(true)
  const [loadingProcess, setLoadingProcess] = useState(false)
  const [errorOperation, setErrorOperation] = useState(null)
  const [error, setError] = useState(null)
  const [questionId, setQuestionId] = useState()
  const [grade, setGrade] = useState(0)
  const { studentID, assignmentID } = useParams()
  let number = 1
  const isAuth = localStorage.getItem('O_authWEB')

  useEffect(() => {
    const handleGetAnswer = () => {
      getAnswers(
        setAllAnswers,
        setTime,
        setAssignmentData,
        setResult,
        setError,
        setLoading,
        studentID,
        assignmentID
      )
    }
    if (isAuth) handleGetAnswer()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Fallback: if API didn't return time, try localStorage (written by MyTimer)
  useEffect(() => {
    if (!time) {
      const stored = localStorage.getItem(`time:${assignmentID}`) || localStorage.getItem('time')
      if (stored) setTime(stored)
    }
  }, [time, assignmentID])

  const openModelAnswer = (imgURL) => {
    setImgURL(imgURL)
    document.querySelector('.model-answer-popup').classList.replace('d-none', 'd-flex')
    setTimeout(() => {
      document.querySelector('.model-answer-popup').classList.remove('answer-popup-hide')
      document.querySelector('.img-popup-container').classList.remove('popup-top')
    }, 50);
  }

  const closeModelAnswer = () => {
    document.querySelector('.model-answer-popup').classList.add('answer-popup-hide')
    document.querySelector('.img-popup-container').classList.add('popup-top')
    setTimeout(() => {
      document.querySelector('.model-answer-popup').classList.replace('d-flex', 'd-none')
    }, 300);
  }

  const showeEndAlert = () => {
    document.querySelector('.alert-question-end').classList.add('alert-active')
    setTimeout(() => {
      document.querySelector('.alert-question-end').classList.remove('alert-active')
    }, 3500);
  }

  const showAlertSuccess = () => {
    document.querySelector('.alert').classList.add('alert-active')
    setTimeout(() => {
      document.querySelector('.alert').classList.remove('alert-active')
    }, 3500);
  }

  const openUpdatePopup = (questionID) => {
    setQuestionId(questionID);
    document.querySelector('.update-grade-popup').classList.replace('d-none', 'd-flex')
    setTimeout(() => {
      document.querySelector('.update-grade-popup').classList.remove('answer-popup-hide')
      document.querySelector('.update-grade').classList.remove('popup-top')
    }, 50);
    setGrade(0)
  }

  const closeUpdatePopup = () => {
    document.querySelector('.update-grade-popup').classList.add('answer-popup-hide')
    document.querySelector('.update-grade').classList.add('popup-top')
    setTimeout(() => {
      document.querySelector('.update-grade-popup').classList.replace('d-flex', 'd-none')
    }, 300);
  }

  const handleCorrectAnswer = () => {
    correctAnswer(
      grade,
      setLoadingProcess,
      closeUpdatePopup,
      setAllAnswers,
      setErrorOperation,
      studentID,
      assignmentID,
      questionId,
      showAlertSuccess,
      showeEndAlert,
      setResult
    )
  }

  return (
    <>
      <MobileNav role="Teacher" />
      <Navbar />
      <div className="assignment-report-container">
        {loading ? (
          <DashboardLoading />
        ) : error ? (
          <div className='d-flex justify-content-center'><div className="error">{error}</div></div>
        ) : (
          <div className='assignment-report-body'>

            <table>
              <thead>
                <tr>
                  <th></th>
                  {/* <th>Question Picture</th> */}
                  <th>Question</th>
                  <th>Student Answer</th>
                  {/* <th>Second Answer</th> */}
                  {/* <th>Solution Steps</th> */}
                  <th>Status</th>
                  <th>Points</th>
                </tr>
              </thead>

              <tbody>
                {allAnswers?.map(item => {
                  return (
                    <tr key={item._id}>
                      <td>{number++}</td>
                      {/* {item?.question.questionPic ? <td onClick={() => openModelAnswer(item?.question.questionPic)}><img src={item?.question.questionPic} alt=''></img></td> : <td>-</td>} */}
                      <td>
                        <div className='d-flex justify-content-center'>
                          <p className='question-assignment-title'>{item.question}</p>
                        </div>
                      </td>
                      <td>
                        {item.firstAnswer ? (
                          <div className="mcq-answer assignment-report-answer">
                            <div className="mcq-answer-layout">
                              <input className='d-none' type="radio" id="berries_1" value={item.firstAnswer} name="berries" />
                              <MathInput size="small" initialLatex={item.firstAnswer} />
                              <div className="answer-layout"></div>
                            </div>
                          </div>
                        ) : '-'}
                      </td>
                      {/* <td>{item.secondAnswer ? ... : '-'}</td> */}
                      {/* {item?.stepsPic ? <td onClick={() => openModelAnswer(item.stepsPic)}><img src={item.stepsPic} alt=''></img></td> : <td>-</td>} */}
                      {item.isCorrect ? (
                        <td className='success'>Success</td>
                      ) : item.notAnswer ? (
                        <td className='wrong'>Not Answered</td>
                      ) : (
                        <td className='wrong'>Wrong</td>
                      )}
                      <td>
                        {item.isCorrect
                          ? `${item.questionPoints} From ${item.questionPoints}`
                          : `-${item.questionPoints}`}
                      </td>
                    </tr>
                  )
                })}
              </tbody>

            </table>

            {/* Keep these if you still want them below; otherwise you can remove this block */}
            <div className='d-flex'>
              <div className="result d-flex align-items-center">
                <h4>Result:</h4>
                <p>{result}/{assignmentData?.totalPoints}</p>
              </div>
              <div className="timer d-flex align-items-center">
                <h4>Time:</h4>
                <p>{time || '—'}</p>
              </div>
            </div>

          </div>
        )}

        <div className="d-flex justify-content-center">
          <div className="alert">Congratulation! This answer is correct now</div>
        </div>
        <div className="d-flex justify-content-center">
          <div className="alert alert-question-end">{errorOperation}</div>
        </div>
      </div>

      {/* Update the grade popup start */}
      <div className="update-grade-popup answer-popup-hide d-none justify-content-center align-items-center">
        <div className="update-grade popup-top">
          <p>Enter the student's grade</p>
          <input type="number" className='grade-input' value={grade} onChange={(e) => setGrade(e.target.value)} />
          <button className='button' onClick={handleCorrectAnswer}>
            {loadingProcess ? <span className="loader"></span> : 'Correct'}
          </button>
          <button className='button popup-btn' onClick={closeUpdatePopup}>Close</button>
        </div>
      </div>
      {/* Update the grade popup end */}

      {/* model answer popup start */}
      <div className="model-answer-popup answer-popup-hide d-none justify-content-center align-items-center">
        <div className='img-popup-container popup-top'>
          <div className="popup-body">
            <div className="d-flex justify-content-center align-items-center"><img src={imgURL} alt="" /></div>
          </div>
          <button className='button popup-btn' onClick={closeModelAnswer}>Close</button>
        </div>
      </div>
      {/* model answer popup end */}
    </>
  )
}

export default AssignmentReport
