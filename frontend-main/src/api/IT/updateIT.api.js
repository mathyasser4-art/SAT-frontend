import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/it/updateIT`;
const Token = localStorage.getItem('O_authWEB')

const updateIT = (data, setError, setLoadingOperation, closeUpdatePopup, setAllIt, setItNumber, itID) => {
    setLoadingOperation(true)
    fetch(`${URL}/${itID}`, {
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
                setAllIt(responseJson.allIT)
                setItNumber(responseJson.numberOfIt)
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

export default updateIT;