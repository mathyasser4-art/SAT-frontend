import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/supervisor/getAllTeachers`;
const Token = localStorage.getItem('O_authWEB')

const getTeacher = (setAllTecaher) => {
    fetch(`${URL}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setAllTecaher(responseJson.allTeachers)
            } else {
                console.log(responseJson.message)
            }
        })
        .catch((error) => {
            console.log(error.message)
        });
}

export default getTeacher;