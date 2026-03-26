import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/question/checkTheAnswer`;

const checked = (data, setCheckLoading, thisQuestion, questionData, thisQuestionNumber, showAlert, setQuestionData, openModelAnswer, showAlertSuccess, nextQuestion, setPoints, points, answeredQuestions, setAnsweredQuestions, setIsCorrect) => {
    setCheckLoading(true)
    fetch(`${URL}/${thisQuestion._id}`, {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setCheckLoading(false)
                const question = questionData.filter(item => item._id === thisQuestion._id)[0]
                question.correct = true;
                questionData[parseInt(thisQuestionNumber) - 1] = question
                setQuestionData(questionData)
                points += question.questionPoints
                answeredQuestions += 1
                setAnsweredQuestions(answeredQuestions)
                setPoints(points)
                showAlertSuccess()
                setTimeout(() => {
                    nextQuestion()
                }, 1000);
            } else {
                setCheckLoading(false)
                const question = questionData.filter(item => item._id === thisQuestion._id)[0]
                if (question.attempts) {
                    question.attempts = 1;
                    showAlert()
                    // if(question.answerPic){
                    //     setIsCorrect(false)
                    //     openModelAnswer()
                    // }else{
                    //     showAlert()
                    // }
                } else {
                    question.attempts = 1
                    showAlert()
                }
                questionData[parseInt(thisQuestionNumber) - 1] = question
                setQuestionData(questionData)
                setTimeout(() => {
                    nextQuestion()
                }, 1000);
            }
        })
        .catch((error) => {
            console.log(error.message)
            setCheckLoading(false)
        });
}

export default checked;