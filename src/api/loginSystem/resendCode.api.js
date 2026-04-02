import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/user/resendVerificationCode`;

const resendCode = (data, showAlert) => {
    fetch(`${URL}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                showAlert()
            }
        })
        .catch((error) => {
            console.log(error.message)
        });
}

export default resendCode;