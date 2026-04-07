import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/answer/getResult`;
const Token = localStorage.getItem('O_authWEB')

const getResult = (setResult, setResultLoading, setResultError, assignmentID, openResulPopup, setTotalSummation, setLoading, setOperationError, time = "0:00") => {
    setResultLoading(true)
    
    console.log('Sending time to backend:', time);
    
    fetch(`${URL}/${assignmentID}?time=${encodeURIComponent(time)}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('getResult API response:', responseJson);
            if (responseJson.message === 'success') {
                setResult(responseJson.result)
                setTotalSummation(responseJson.totalSummation)
                setResultLoading(false)
                openResulPopup()
            } else {
                setResultLoading(false)
                setLoading(false)
                setOperationError(responseJson.message)
            }
        })
        .catch((error) => {
            setResultError(error.message)
            setResultLoading(false)
        });
}

export default getResult;