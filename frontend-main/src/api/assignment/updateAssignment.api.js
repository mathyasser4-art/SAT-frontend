import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/assignment/updateAssignment`;
const Token = localStorage.getItem('O_authWEB')

const updateAssignment = (data, setError, assignmentID, setAllAsignment,setLoadingOperation, setPocketNumber, setQuestionList, closeQuestionList, setTimer, setAttempts, setExpiryData, setStartDate) => {
    setLoadingOperation(true)
    fetch(`${URL}/${assignmentID}`, {
        method: 'put',
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
                setTimer(0)
                setAttempts(0)
                setExpiryData('')
                setStartDate('')
                closeQuestionList()
                setAllAsignment(responseJson.allAssignment)
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

export default updateAssignment;