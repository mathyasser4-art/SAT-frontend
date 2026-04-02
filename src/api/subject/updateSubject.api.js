import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/schoolSubject/updateSchoolSubject`;
const Token = localStorage.getItem('O_authWEB')

const updateSubject = (data, subjectID, setError, setLoadingOperation, closeUpdatePopup, setAllSubject) => {
    setLoadingOperation(true)
    fetch(`${URL}/${subjectID}`, {
        method: 'put',
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
                closeUpdatePopup()
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

export default updateSubject;