import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/supervisor/addSupervisor`;
const Token = localStorage.getItem('O_authWEB')

const addSupervisor = (data, setError, setLoadingOperation, closeAddPopup, setAllSupervisor, setSupervisorNumber) => {
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
                setAllSupervisor(responseJson.allSupervisor)
                setSupervisorNumber(responseJson.numberOfSupervisor)
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

export default addSupervisor;