import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/deleteTeacher`;
const Token = localStorage.getItem('O_authWEB')

const removeTeacher = (teacherID, setError, setLoadingOperation, closeRemovePopup, pageNumber, setAllTeacher, setTeacherNumber, setTotalPage) => {
    setLoadingOperation(true)
    fetch(`${URL}/${teacherID}/${pageNumber}`, {
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
                setAllTeacher(responseJson.allTeachers)
                setTeacherNumber(responseJson.numberOfTeacher)
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

export default removeTeacher;