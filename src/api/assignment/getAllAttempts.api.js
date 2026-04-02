import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/answer/getAllAttempts`;
const Token = localStorage.getItem('O_authWEB');

const getAllAttempts = async (assignmentID) => {
    try {
        const response = await fetch(`${URL}/${assignmentID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'authrization': `pracYas09${Token}`
            }
        });
        
        const responseJson = await response.json();
        
        if (responseJson.message === 'success') {
            return {
                success: true,
                attempts: responseJson.attempts,
                statistics: responseJson.statistics
            };
        } else {
            return {
                success: false,
                message: responseJson.message || 'Failed to fetch attempts'
            };
        }
    } catch (error) {
        console.error('Error fetching attempts:', error);
        return {
            success: false,
            message: error.message
        };
    }
};

export default getAllAttempts;
