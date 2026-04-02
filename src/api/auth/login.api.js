import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/auth/login`;

const login = (userData, setError, setLoading, navigate, showAlert) => {
    setLoading(true)
    fetch(`${URL}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                // Clear any trial data when logging in with real account
                localStorage.removeItem('isTrialMode')
                localStorage.removeItem('teacher_trial')
                
                localStorage.setItem('O_authWEB', responseJson.userToken)
                localStorage.setItem('auth_role', responseJson.role)
                localStorage.setItem('pp_name', responseJson.userName)
                window.location.reload();
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

export default login;