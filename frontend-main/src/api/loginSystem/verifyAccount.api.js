import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/user/verificationEmail`;

const verifyAccount = (data, setError, setLoading, navigate) => {
    setLoading(true)
    fetch(`${URL}`, {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                navigate('/auth/login')
            } else {
                setError(responseJson.message)
                setLoading(false)
            }
        })
        .catch((error) => {
            setError(error.message)
            setLoading(false)
        });
}

export default verifyAccount;