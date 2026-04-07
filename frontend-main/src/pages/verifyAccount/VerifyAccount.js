import React, { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import logo from '../../img/logo-login.png'
import verifyAccount from '../../api/loginSystem/verifyAccount.api'
import resendCode from '../../api/loginSystem/resendCode.api'
import '../../reusable.css'
import './VerifyAccount.css'

function VerifyAccount() {
  const [firstDigit, setFirstDigit] = useState('')
  const [secondDigit, setSecondDigit] = useState('')
  const [thirdDigit, setThirdDigit] = useState('')
  const [fourthDigit, setFourthDigit] = useState('')
  const [fifthDigit, setFifthDigit] = useState('')
  const [sixthDigit, setSixthDigit] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { email } = useParams()
  const navigate = useNavigate()

  const showAlert = () => {
    document.querySelector('.alert').classList.add('alert-active')
    setTimeout(() => {
      document.querySelector('.alert').classList.remove('alert-active')
    }, 3500);
  }

  const handleResendCode = () => {
    const data = { email }
    resendCode(data, showAlert)
  }

  const handleVerify = () => {
    if (firstDigit === '' || secondDigit === '' || thirdDigit === '' || fourthDigit === '' || fifthDigit === '' || sixthDigit === '') {
      setError('Enter the 6-digit verification code')
    } else {
      const verificationCode = firstDigit + secondDigit + thirdDigit + fourthDigit + fifthDigit + sixthDigit
      const data = { email, verificationCode }
      verifyAccount(data, setError, setLoading, navigate)
    }
  }

  return (
    <div className='verify d-flex flex-direction-column justify-content-center align-items-center'>
      <div className="verify-logo">
        <Link to={'/'}><img src={logo} alt="" /></Link>
      </div>
      <div className="verify-title">
        <p>Enter Verification Code</p>
      </div>
      {error ? <div className="error">{error}</div> : null}
      <div className="verify-input">
        <input type="text" maxLength="1" value={firstDigit} onChange={e => setFirstDigit(e.target.value)} />
        <input type="text" maxLength="1" value={secondDigit} onChange={e => setSecondDigit(e.target.value)} />
        <input type="text" maxLength="1" value={thirdDigit} onChange={e => setThirdDigit(e.target.value)} />
        <input type="text" maxLength="1" value={fourthDigit} onChange={e => setFourthDigit(e.target.value)} />
        <input type="text" maxLength="1" value={fifthDigit} onChange={e => setFifthDigit(e.target.value)} />
        <input type="text" maxLength="1" value={sixthDigit} onChange={e => setSixthDigit(e.target.value)} />
      </div>
      <div className='verify-btn d-flex justify-content-center'>
        <button onClick={handleVerify}>{loading ? <span className="loader"></span> : "Verify"}</button>
      </div>
      <div className='verify-footer'>
        <p>Didn't receive code?</p>
        <p onClick={handleResendCode}>Send verification code again</p>
      </div>
      <div className="alert">Success! Check your email We have sent you a new verification code.</div>
    </div>
  )
}

export default VerifyAccount;