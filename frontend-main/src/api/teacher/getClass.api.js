import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/getClass`;
const Token = localStorage.getItem('O_authWEB')

const getClass = (setLoading, setClassesList) => {
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
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
                setClassesList(responseJson.teacherClasess?.classList)
            } else {
                console.log(responseJson.message)
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
            }
        })
        .catch((error) => {
            console.log(error.message)
            setLoading(false)
        });
}

export default getClass;