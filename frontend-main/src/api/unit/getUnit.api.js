import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/unit/getUnit`;

const getUnit = (setLoading, setUnitData, questionTypeID, subjectID) => {
    setLoading(true)
    fetch(`${URL}/${questionTypeID}/${subjectID}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoading(false)
                setUnitData(responseJson.allUnit)
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

export default getUnit;