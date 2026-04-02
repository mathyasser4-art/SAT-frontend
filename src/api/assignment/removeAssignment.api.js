import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/assignment/deleteAssignment`;
const Token = localStorage.getItem('O_authWEB')

const removeAssignment = (assignmentID, setError, setLoadingOperation, closeRemovePopup, setAllAsignment) => {
    setLoadingOperation(true)
    fetch(`${URL}/${assignmentID}`, {
        method: 'delete',
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
                closeRemovePopup()
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

export default removeAssignment;