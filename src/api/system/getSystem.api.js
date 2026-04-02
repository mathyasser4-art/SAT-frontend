import API_BASE_URL from '../../config/api.config';

const getSystem = (setLoading, setSystemData, questionTypeID) => {
    setLoading(true)
    // Load all systems without filtering by questionTypeID
    const URL = `${API_BASE_URL}/system/getAllSystem`;
    
    fetch(`${URL}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoading(false)
                setSystemData(responseJson.allSystem)
            } else {
                console.log(responseJson.message)
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setLoading(false)
        });
}

export default getSystem;