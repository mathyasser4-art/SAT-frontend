import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/class/removeClass`;
const Token = localStorage.getItem('O_authWEB')

const removeClass = (classID, setError, setLoadingOperation, closeRemovePopup, setAllClass) => {
    setLoadingOperation(true)
    fetch(`${URL}/${classID}`, {
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
                setAllClass(responseJson.allClasses)
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

export default removeClass;