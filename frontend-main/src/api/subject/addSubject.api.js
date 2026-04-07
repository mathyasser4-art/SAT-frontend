import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/schoolSubject/addSchoolSubject`;
const Token = localStorage.getItem('O_authWEB')

const addSubject = (data, setError, setLoadingOperation, closeAddPopup, setAllSubject) => {
    setLoadingOperation(true)
    fetch(`${URL}`, {
        method: 'post',
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
                setAllSubject(responseJson.allSubject)
                closeAddPopup()
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

export default addSubject;