import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/it/getIT`;
const Token = localStorage.getItem('O_authWEB')

const getIT = (setLoading, setAllIt, setItNumber) => {
    setLoading(true)
    fetch(URL, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoading(false)
                setAllIt(responseJson.allIT)
                setItNumber(responseJson.numberOfIt)
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

export default getIT;