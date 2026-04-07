import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/getTeachers`;
const Token = localStorage.getItem('O_authWEB')

const getTeacher = (setLoading, setAllTeacher, pageNumber, setTeacherNumber, setTotalPage) => {
    setLoading(true)
    fetch(`${URL}/${pageNumber}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoading(false)
                setAllTeacher(responseJson.allTeachers)
                setTeacherNumber(responseJson.numberOfTeacher)
                setTotalPage(responseJson.totalPage)
            } else {
                console.log(responseJson.message)
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setLoading(false)
        });
}

export default getTeacher;