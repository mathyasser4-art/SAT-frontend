import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/student/getClass`;
const Token = localStorage.getItem('O_authWEB')

const getClass = (setLoading, setClassName, setTeacherList) => {
    setLoading(true)
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
                setLoading(false)
                setClassName(responseJson.studentData?.class?.class)
                setTeacherList(responseJson.studentData?.class?.teachers)
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

export default getClass;