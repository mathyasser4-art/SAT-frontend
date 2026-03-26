import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/student/assignmentDetails`;
const Token = localStorage.getItem('O_authWEB')

const assignmentDetails = (setLoading, setOperationError, setQuestionData, setThisQuestion, setNumberOfQuestion, setThisQuestionNumber, setTotalSummation, assignmentID, timerCount, setTime, setTotalTime, setAnswer, handleGetResult, navigate, setForceFlashMode, setCurrentAttempt, setTotalAttempts, setRemainingAttempts, setFlashSpeed) => {
    setLoading(true)
    localStorage.removeItem("time")
    
    console.log('Fetching assignment details for:', assignmentID)
    console.log('Navigate function available:', !!navigate)
    
    fetch(`${URL}/${assignmentID}`, {
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        }
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('Assignment details response:', responseJson)
            if (responseJson.message === 'success') {
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
                let allQuestion = responseJson.assignment.questions
                const numbers = []
                let totalSummation = 0
                for (let index = 0; index < allQuestion.length; index++) {
                    numbers.push(index + 1)
                    const element = allQuestion[index];
                    totalSummation += element.questionPoints
                    if (element.typeOfAnswer === 'Graph') {
                        const randomNum = Math.floor(Math.random() * 4); // This will give you a random number between 0 and 3
                        const oldAnswer = element.wrongPicAnswer
                        const newAnswer = [...oldAnswer.slice(0, randomNum), element.correctPicAnswer, ...oldAnswer.slice(randomNum)];
                        allQuestion[index].wrongPicAnswer = newAnswer
                    }
                }
                setTotalSummation(totalSummation)
                setQuestionData(allQuestion)
                setThisQuestion(allQuestion[0])
                setNumberOfQuestion(numbers)
                setThisQuestionNumber(1)
                if (allQuestion.length !== 0 && allQuestion[0].questionAnswer)
                    setAnswer(allQuestion[0].questionAnswer);
                if (allQuestion.length === 0)
                    setLoading(true)
                
                // Set force flash mode if the assignment requires it
                console.log('🔍 Backend forceFlashMode:', responseJson.assignment.forceFlashMode);
                console.log('🔍 Backend flashSpeed:', responseJson.assignment.flashSpeed);
                
                if (setForceFlashMode && responseJson.assignment.forceFlashMode) {
                    console.log('✅ Setting force flash mode to TRUE');
                    setForceFlashMode(true);
                } else {
                    console.log('❌ Force flash mode NOT set (backend value:', responseJson.assignment.forceFlashMode, ')');
                }
                
                // Set flash speed if provided
                if (setFlashSpeed && responseJson.assignment.flashSpeed) {
                    console.log('✅ Setting flash speed to:', responseJson.assignment.flashSpeed);
                    setFlashSpeed(responseJson.assignment.flashSpeed);
                } else {
                    console.log('⚠️ Flash speed not provided or using default');
                }
                
                // Set attempt information
                if (setCurrentAttempt && responseJson.assignment.currentAttempt) {
                    setCurrentAttempt(responseJson.assignment.currentAttempt);
                }
                if (setTotalAttempts && responseJson.assignment.totalAttempts) {
                    setTotalAttempts(responseJson.assignment.totalAttempts);
                }
                if (setRemainingAttempts !== undefined && responseJson.assignment.remainingAttempts !== undefined) {
                    setRemainingAttempts(responseJson.assignment.remainingAttempts);
                }
                
                if (responseJson?.assignment.timer) {
                    const timer = responseJson.assignment.timer * 60
                    const time = new Date();
                    time.setSeconds(time.getSeconds() + timer); // Timer in minutes
                    setTotalTime(responseJson.assignment.timer)
                    setTimeout(() => {
                        timerCount()
                        setTime(time)
                    }, 2000);
                }
            } else {
                // Assignment already completed, expired, or other error
                console.log('Assignment status:', responseJson.message);
                
                // Check if attempts are expired (assignment already completed)
                // The exact message from backend is: "Oops!!You can't open this assignment, your number of attempts has expired."
                if (responseJson.message && (
                    responseJson.message.includes('attempts has expired') || 
                    responseJson.message.includes("can't open this assignment")
                )) {
                    // Show message that assignment is already completed
                    console.log('Assignment already completed. Showing message...');
                    setLoading(false);
                    setOperationError('This assignment has been completed. You have used all your attempts.');
                } else if (responseJson.message && responseJson.message.toLowerCase().includes('expired')) {
                    // Assignment time period has expired (different from attempts expired)
                    setLoading(false);
                    setOperationError(responseJson.message);
                } else {
                    // Other errors
                    setLoading(false);
                    setOperationError(responseJson.message || 'Unable to load assignment');
                }
            }
        })
        .catch((error) => {
            console.log('Error fetching assignment:', error.message);
            setLoading(false);
            setOperationError('Unable to load assignment. Please check your internet connection and try again.');
        });
}

export default assignmentDetails;