import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/it/deleteIT`;
const Token = localStorage.getItem('O_authWEB')

const removeIT = (itID, setError, setLoadingOperation, closeRemovePopup, setAllIt, setItNumber) => {
    setLoadingOperation(true)
    fetch(`${URL}/${itID}`, {
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
                setAllIt(responseJson.allIT)
                setItNumber(responseJson.numberOfIt)
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

export default removeIT;