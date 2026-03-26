import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/class/getStudent`;
const Token = localStorage.getItem('O_authWEB')

const getClassStudent = (setStudentLoading, setClassStudent, classID, setNoStudent) => {
    setStudentLoading(true)
    fetch(`${URL}/${classID}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setStudentLoading(false)
                setNoStudent(false)
                setClassStudent(responseJson.allStudent)
            } else {
                console.log(responseJson.message)
                setStudentLoading(false)
                setNoStudent(true)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setStudentLoading(false)
            setNoStudent(true)
        });
}

export default getClassStudent;