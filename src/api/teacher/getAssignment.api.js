import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/teacher/getAssignment`;
const Token = localStorage.getItem('O_authWEB')

const getAssignment = (setLoading, setAllAsignment, setError) => {
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
                setAllAsignment(responseJson.allAssignment)
            } else {
                setError(responseJson.message)
                setLoading(false)
            }
        })
        .catch((error) => {
            setError(error.message)
            setLoading(false)
        });
}

export default getAssignment;