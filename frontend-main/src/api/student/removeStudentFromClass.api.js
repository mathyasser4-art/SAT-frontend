import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/student/removeStudentFromClass`;
const Token = localStorage.getItem('O_authWEB')

const removeStudentFromClass = (setLoadingOperation, setError, setClassStudent, classID, studentID, setNoStudent) => {
    setLoadingOperation(true)
    fetch(`${URL}/${studentID}/${classID}`, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoadingOperation(false)
                setNoStudent(false)
                setClassStudent(responseJson.allStudent)
            } else {
                setError(responseJson.message)
                setLoadingOperation(false)
                setNoStudent(true)
            }
        })
        .catch((error) => {
            setError(error.message)
            setLoadingOperation(false)
            setNoStudent(true)
        });
}

export default removeStudentFromClass;