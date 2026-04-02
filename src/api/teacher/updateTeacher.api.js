import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/updateTeacher`;
const Token = localStorage.getItem('O_authWEB')

const updateTeacher = (data, setError, setLoadingOperation, closeUpdatePopup, pageNumber, setAllTeacher, setTeacherNumber, teacherID, setTotalPage) => {
    setLoadingOperation(true)
    fetch(`${URL}/${teacherID}/${pageNumber}`, {
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
                setAllTeacher(responseJson.allTeachers)
                setTeacherNumber(responseJson.numberOfTeacher)
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

export default updateTeacher;