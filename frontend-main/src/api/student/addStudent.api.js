import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/student/addStudent`;
const Token = localStorage.getItem('O_authWEB')

const addStudent = (data, setError, setLoadingOperation, closeAddPopup, pageNumber, setAllStudent, setStudentNumber, setTotalPage) => {
    setLoadingOperation(true)
    fetch(`${URL}/${pageNumber}`, {
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
                setAllStudent(responseJson.allStudent)
                setStudentNumber(responseJson.numberOfStudent)
                setTotalPage(responseJson.totalPage)
                closeAddPopup()
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

export default addStudent;