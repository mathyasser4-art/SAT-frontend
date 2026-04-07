import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/answer/getAnswer`;
const Token = localStorage.getItem('O_authWEB')

const getAnswers = (setAllAnswers, setTime, setAssignmentData, setResult, setError, setLoading, studentID, assignmentID) => {
    console.log('=== getAnswers API START ===');
    console.log('Student ID:', studentID);
    console.log('Assignment ID:', assignmentID);
    console.log('Token exists:', !!Token);
    
    setLoading(true)
    const apiUrl = `${URL}/${studentID}/${assignmentID}`;
    console.log('Fetching from:', apiUrl);
    
    fetch(apiUrl, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
    })
        .then((response) => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then((responseJson) => {
            console.log('Response data:', responseJson);
            
            if (responseJson.message === 'success') {
                console.log('✓ Success! Processing report...');
                console.log('Report questions count:', responseJson.report?.questions?.length || 0);
                console.log('Time:', responseJson.answers?.time);
                console.log('Total score:', responseJson.answers?.total);
                
                // setAllAnswers(responseJson.answers.questions)
                setAllAnswers(responseJson.report.questions)
                setAssignmentData(responseJson.answers.assignment)
                setTime(responseJson.answers.time)
                setLoading(false)
                
                let result = 0;
                responseJson.report.questions.map(questions => {
                    if (questions.isCorrect) {
                        result += questions.questionPoints;
                    }
                })
                console.log('Calculated result:', result);
                setResult(result)
                console.log('=== getAnswers API END ===\n');
            } else {
                console.log('❌ API returned error:', responseJson.message);
                setError(responseJson.message)
                setLoading(false)
            }
        })
        .catch((error) => {
            console.error('❌ Fetch error:', error);
            console.error('Error details:', error.message);
            setError(error.message)
            setLoading(false)
        });
}

export default getAnswers;