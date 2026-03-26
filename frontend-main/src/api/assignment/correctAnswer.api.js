import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/answer/correctAnswer`;
const Token = localStorage.getItem('O_authWEB')

const correctAnswer = (grade, setLoadingProcess, closeUpdatePopup, setAllAnswers, setErrorOperation, studentID, assignmentID, questionID, showAlertSuccess, showeEndAlert, setResult) => {
    setLoadingProcess(true)
    fetch(`${URL}/${studentID}/${assignmentID}/${questionID}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
        body: JSON.stringify({ grade })
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllAnswers(responseJson.answers.questions)
                setResult(responseJson.answers.total)
                showAlertSuccess()
                setLoadingProcess(false)
                closeUpdatePopup()
            } else {
                setErrorOperation(responseJson.message)
                showeEndAlert()
                setLoadingProcess(false)
            }
        })
        .catch((error) => {
            setErrorOperation(error.message)
            setLoadingProcess(false)
        });
}

export default correctAnswer;