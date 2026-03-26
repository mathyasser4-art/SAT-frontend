import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/assignment/createAssignment`;
const Token = localStorage.getItem('O_authWEB')

const createAssignment = (data, setError, setLoadingOperation, setPocketNumber, setQuestionList, closeQuestionList, setTimer, setExpiryData, setStartDate, setTitle, setClassesBox, setForceFlashMode, setAssignmentFlashSpeed) => {
    setLoadingOperation(true)
    fetch(`${URL}`, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoadingOperation(false)
                setPocketNumber(0)
                setQuestionList([])
                setTimer('')
                setExpiryData('')
                setStartDate('')
                setTitle('')
                setClassesBox([])
                if (setForceFlashMode) setForceFlashMode(false)
                if (setAssignmentFlashSpeed) setAssignmentFlashSpeed(1.0)
                closeQuestionList()
                localStorage.removeItem('cartona')
            } else {
                setError(responseJson.message)
                setLoadingOperation(false)
            }
        })
        .catch((error) => {
            setError(error.message)
            setLoadingOperation(false)
        });
}

export default createAssignment;