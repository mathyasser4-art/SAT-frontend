import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/supervisor/getAssignment`;
const Token = localStorage.getItem('O_authWEB')

const getAssignment = (setLoadingOperation, setAllAsignment, setError, teacherID) => {
    setLoadingOperation(true)
    fetch(`${URL}/${teacherID}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoadingOperation(false)
                setAllAsignment(responseJson.allAssignment)
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

export default getAssignment;