import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/chapter/getChapterQuestion`;

const getQuestion = (setLoading, setQuestionData, setThisQuestion, setNumberOfQuestion, setThisQuestionNumber, setTotalSummation, chapterID) => {
    setLoading(true)
    fetch(`${URL}/${chapterID}`, {
        method: 'get',
        headers: { 'Content-Type': 'application/json' },
    })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson.message === 'success') {
                setTimeout(() => {
                    setLoading(false)
                }, 2000);
                let allQuestion = responseJson.chapter.questions
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
                if (allQuestion.length === 0)
                    setLoading(true)
            } else {
                console.log(responseJson.message)
                setLoading(false)
            }
        })
        .catch((error) => {
            console.log(error.message)
            setLoading(false)
        });
}

export default getQuestion;