import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/answer/checkAnswer`;
const Token = localStorage.getItem('O_authWEB')

const checkAnswer = (data, nextQuestion, setAnswerError, setCheckLoading, questionID, assignmentID, openModelAnswer, openRepotAnswer, showAlert, showAlertSuccess, thisQuestion, setIsCorrect, setFirstAnswer, setSecondAnswer) => {
    setCheckLoading(true)
    fetch(`${URL}/${questionID}/${assignmentID}`, {
        method: 'post',
        headers: {
            'authrization': `pracYas09${Token}`
        },
        body: data
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success' && responseJson.isCorrect === true) {
                setIsCorrect(true)
                showAlertSuccess()
                // if (thisQuestion?.answerPic) {
                //     openModelAnswer()
                // } else {
                //     showAlertSuccess()
                // }
            } else if (responseJson.message === 'success' && responseJson.isCorrect === false) {
                setIsCorrect(false)
                if (responseJson.answer?.attempts === 1) {
                    showAlert()
                } else {
                    showAlert()
                }
            } else if (responseJson.message !== 'success') {
                setAnswerError(responseJson.message)
                openRepotAnswer()
            }
            setCheckLoading(false)
            const firstAnswer = []
            // const secondAnswer = []
            if (responseJson.answer?.firstAnswer)
                firstAnswer.push(responseJson.answer?.firstAnswer)
            // if (responseJson.answer?.secondAnswer)
            //     secondAnswer.push(responseJson.answer?.secondAnswer)
            setFirstAnswer(firstAnswer)
            // setSecondAnswer(secondAnswer)
            setTimeout(() => {
                nextQuestion()
            }, 1000);
        })
        .catch((error) => {
            setAnswerError(error.message)
            setCheckLoading(false)
        });
}

export default checkAnswer;