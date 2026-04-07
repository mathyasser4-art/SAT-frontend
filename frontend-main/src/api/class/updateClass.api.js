import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/class/updateClass`;
const Token = localStorage.getItem('O_authWEB')

const updateClass = (data, classID, setError, setLoadingOperation, closeUpdatePopup, setAllClass) => {
    setLoadingOperation(true)
    fetch(`${URL}/${classID}`, {
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
                setAllClass(responseJson.allClasses)
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

export default updateClass;