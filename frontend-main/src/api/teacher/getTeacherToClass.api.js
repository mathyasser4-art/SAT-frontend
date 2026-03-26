import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/getTeacherToClass`;
const Token = localStorage.getItem('O_authWEB')

const getTeacherToClass = (setTeacherLoading, setAllTeacher) => {
    setTeacherLoading(true)
    fetch(`${URL}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setTeacherLoading(false)
                setAllTeacher(responseJson.allTeachers)
            } else {
                console.log(responseJson.message)
                setTeacherLoading(false)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setTeacherLoading(false)
        });
}

export default getTeacherToClass;