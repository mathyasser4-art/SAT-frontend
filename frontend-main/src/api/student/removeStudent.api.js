import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/student/deleteStudent`;
const Token = localStorage.getItem('O_authWEB')

const removeStudent = (studentID, setError, setLoadingOperation, closeRemovePopup, pageNumber, setAllStudent, setStudentNumber, setTotalPage) => {
    setLoadingOperation(true)
    fetch(`${URL}/${studentID}/${pageNumber}`, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoadingOperation(false)
                setAllStudent(responseJson.allStudent)
                setStudentNumber(responseJson.numberOfStudent)
                setTotalPage(responseJson.totalPage)
                closeRemovePopup()
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

export default removeStudent;