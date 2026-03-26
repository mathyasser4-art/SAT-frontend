import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/addTeacher`;
const Token = localStorage.getItem('O_authWEB')

const addTeacher = (data, setError, setLoadingOperation, closeAddPopup, pageNumber, setAllTeacher, setTeacherNumber, setTotalPage) => {
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
                setAllTeacher(responseJson.allTeachers)
                setTeacherNumber(responseJson.numberOfTeacher)
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

export default addTeacher;