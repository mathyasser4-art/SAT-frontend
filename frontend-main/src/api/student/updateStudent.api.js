import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/student/updateStudent`;
const Token = localStorage.getItem('O_authWEB')

const updateStudent = (data, setError, setLoadingOperation, closeUpdatePopup, pageNumber, setAllStudent, setStudentNumber, studentID, setTotalPage) => {
    setLoadingOperation(true)
    fetch(`${URL}/${studentID}/${pageNumber}`, {
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
                setAllStudent(responseJson.allStudent)
                setStudentNumber(responseJson.numberOfStudent)
                setTotalPage(responseJson.totalPage)
                closeUpdatePopup()
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

export default updateStudent;