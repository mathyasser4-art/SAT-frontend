import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import resetPassCode from '../../api/loginSystem/resetPassCode.api'
import logo from '../../img/logo-login.png'
import '../../reusable.css'
import './ResPasCode.css'

function ResPasCode() {
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

    const handleResetPassCode = () => {
        if (firstDigit === '' || secondDigit === '' || thirdDigit === '' || fourthDigit === '' || fifthDigit === '' || sixthDigit === '') {
          setError('Enter the 6-digit verification code')
        } else {
          const resetPasswordCode = firstDigit + secondDigit + thirdDigit + fourthDigit + fifthDigit + sixthDigit
          const data = { email, resetPasswordCode }
          resetPassCode(data, setError, setLoading, navigate)
        }
      }

    return (
        <div className='res-pas-code d-flex flex-direction-column justify-content-center align-items-center'>
            <div className="res-pas-code-logo">
                <Link to={'/'}><img src={logo} alt="" /></Link>
            </div>
            <div className="res-pas-code-title">
                <p>Enter Verification Code</p>
            </div>
            {error ? <div className="error">{error}</div> : null}
            <div className="res-pas-code-input">
                <input type="text" maxLength="1" value={firstDigit} onChange={e => setFirstDigit(e.target.value)} />
                <input type="text" maxLength="1" value={secondDigit} onChange={e => setSecondDigit(e.target.value)} />
                <input type="text" maxLength="1" value={thirdDigit} onChange={e => setThirdDigit(e.target.value)} />
                <input type="text" maxLength="1" value={fourthDigit} onChange={e => setFourthDigit(e.target.value)} />
                <input type="text" maxLength="1" value={fifthDigit} onChange={e => setFifthDigit(e.target.value)} />
                <input type="text" maxLength="1" value={sixthDigit} onChange={e => setSixthDigit(e.target.value)} />
            </div>
            <div className='res-pas-code-btn d-flex justify-content-center'>
                <button onClick={handleResetPassCode}>{loading ? <span className="loader"></span> : "Subment"}</button>
            </div>
        </div>
    )
}

export default ResPasCode