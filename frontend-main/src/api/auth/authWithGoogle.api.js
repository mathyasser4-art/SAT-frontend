import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/auth/google`;

const authWithGoogle = (data) => {
    fetch(`${URL}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                // Clear any trial data when logging in with Google
                localStorage.removeItem('isTrialMode')
                localStorage.removeItem('teacher_trial')
                
                localStorage.setItem('O_authWEB', responseJson.userToken)
                window.location.reload();
            } else {
                console.log(responseJson.message)
            }
        })
        .catch((error) => {
            console.log(error.message)
        });
}

export default authWithGoogle;