import API_BASE_URL from '../../config/api.config';

const getStudentHistory = async (studentID) => {
    const Token = localStorage.getItem('O_authWEB');
    const URL = `${API_BASE_URL}/teacher/student/${studentID}/history`;
    
    try {
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authrization': `pracYas09${Token}`
            },
        });
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching student history:', error);
        throw error;
    }
};

export default getStudentHistory;
