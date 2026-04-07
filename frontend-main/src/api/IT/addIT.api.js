import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/it/addIT`;
const Token = localStorage.getItem('O_authWEB')

const addIT = (data, setError, setLoadingOperation, closeAddPopup, setAllIt, setItNumber) => {
    setLoadingOperation(true)
    fetch(URL, {
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
                setAllIt(responseJson.allIT)
                setItNumber(responseJson.numberOfIt)
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

export default addIT;