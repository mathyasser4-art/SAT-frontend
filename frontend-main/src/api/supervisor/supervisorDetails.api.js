import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/supervisor/supervisorDeatails`;
const Token = localStorage.getItem('O_authWEB')

const supervisorDeatails = (setLoading, setSupervisorName, setTeacherList) => {
    setLoading(true)
    fetch(URL, {
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
                setSupervisorName(responseJson.supervisor?.userName)
                setTeacherList(responseJson.supervisor?.teacherList)
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

export default supervisorDeatails;