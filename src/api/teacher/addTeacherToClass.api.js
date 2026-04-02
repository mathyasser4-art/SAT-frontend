import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/addTeacherToClass`;
const Token = localStorage.getItem('O_authWEB')

const addTeacherToClass = (setError, setLoadingOperation, closeAddToPopup, classID, teacherID, setAllClass) => {
    setLoadingOperation(true)
    fetch(`${URL}/${classID}/${teacherID}`, {
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
                setAllClass(responseJson.allClasses)
                closeAddToPopup()
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

export default addTeacherToClass;