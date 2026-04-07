import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/supervisor/deleteSupervisor`;
const Token = localStorage.getItem('O_authWEB')

const removeSupervisor = (supervisorID, setError, setLoadingOperation, closeRemovePopup, setAllSupervisor, setSupervisorNumber) => {
    setLoadingOperation(true)
    fetch(`${URL}/${supervisorID}`, {
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
                setAllSupervisor(responseJson.allSupervisor)
                setSupervisorNumber(responseJson.numberOfSupervisor)
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

export default removeSupervisor;