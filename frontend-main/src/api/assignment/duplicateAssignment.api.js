import API_BASE_URL from '../../config/api.config';

const URL = `${API_BASE_URL}/assignment/duplicateAssignment`;
const Token = localStorage.getItem('O_authWEB')

const duplicateAssignment = (data, setError, assignmentID, setAllAsignment, setLoadingOperation, setPocketNumber, setQuestionList, closeReassignPopup, setTimer, setExpiryData, setStartDate, setTitle, setForceFlashMode, setAssignmentFlashSpeed) => {
    setLoadingOperation(true)
    
    console.log('Duplicating assignment:', assignmentID);
    console.log('New assignment data:', data);
    
    fetch(`${URL}/${assignmentID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'authrization': `pracYas09${Token}`
        },
        body: JSON.stringify(data)
    })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log('Duplicate assignment response:', responseJson);
            
            if (responseJson.message === 'success') {
                setLoadingOperation(false)
                setPocketNumber(0)
                setQuestionList([])
                setTimer('')
                setExpiryData('')
                setStartDate('')
                setTitle('')
                if (setForceFlashMode) setForceFlashMode(false)
                if (setAssignmentFlashSpeed) setAssignmentFlashSpeed(1.0)
                closeReassignPopup()
                setAllAsignment(responseJson.allAssignment)
                
                // Show success message
                alert('✅ Assignment successfully re-assigned! A new copy has been created.');
            } else {
                setError(responseJson.message)
                setLoadingOperation(false)
            }
        })
        .catch((error) => {
            console.error('Error duplicating assignment:', error);
            setError(error.message)
            setLoadingOperation(false)
        });
}

export default duplicateAssignment;
