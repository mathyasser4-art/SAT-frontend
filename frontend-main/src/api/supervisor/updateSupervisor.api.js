import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/supervisor/updateSupervisor`;
const Token = localStorage.getItem('O_authWEB')

const updateSupervisor = (data, setError, setLoadingOperation, closeUpdatePopup, setAllSupervisor, setSupervisorNumber, supervisorID) => {
    setLoadingOperation(true)
    fetch(`${URL}/${supervisorID}`, {
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
                setAllSupervisor(responseJson.allSupervisor)
                setSupervisorNumber(responseJson.numberOfSupervisor)
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

export default updateSupervisor;