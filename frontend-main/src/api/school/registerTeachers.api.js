import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/school/registerTeachers`;
const Token = localStorage.getItem('O_authWEB');

const registerTeachers = (data, setError, setLoadingOperation, onSuccess) => {
    setLoadingOperation(true);
    fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setLoadingOperation(false);
                onSuccess(responseJson.data);
            } else {
                setError(responseJson.message || 'Failed to save teacher data');
                setLoadingOperation(false);
            }
        })
        .catch((error) => {
            setError(error.message || 'An error occurred');
            setLoadingOperation(false);
        });
};

export default registerTeachers;
