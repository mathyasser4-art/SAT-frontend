import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom';
import logo from '../../logo.png'
import avatarExam from '../../img/avatar-exam.png'
import profileImg from '../../img/avatar-profile.png'
import MathInput from "react-math-keyboard";
import QuestionLoading from '../../components/questionLoading/QuestionLoading';
import NotLogin from '../../components/notLogin/NotLogin';
import assignmentDetails from '../../api/student/assignmentDetails.api';
import getResult from '../../api/assignment/getResult.api';
import checkAnswer from '../../api/assignment/checkAnswer.api';
import API_BASE_URL from '../../config/api.config';
import CanvasDraw from "react-canvas-draw-annotations";
import alerm from '../../img/alerm.PNG'
import MyTimer from '../../components/timer/Timer';
import AbacusSimulator from '../../components/abacus/AbacusSimulator';
import soundEffects from '../../utils/soundEffects';
import { Calculator, CircleCheck, ArrowRight, Maximize2, Minimize2 } from 'lucide-react';
import { renderLatexInHtml } from '../../utils/latexRenderer';
import '../../reusable.css';
import '../question-render.css';
import './Assignment.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function Assignment() {
  // State for mobile detection and exit confirmation
  const [isMobile, setIsMobile] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  // State for Abacus visibility
  const [showAbacus, setShowAbacus] = useState(false);

  // State for Flash Mode
  const [flashMode, setFlashMode] = useState(false);
  const [currentFlashLine, setCurrentFlashLine] = useState(0);
  const [isFlashing, setIsFlashing] = useState(false);
  const [forceFlashMode, setForceFlashMode] = useState(false);
  const [flashSpeed, setFlashSpeed] = useState(1.0); // Default 1 second
  const [hasFlashedOnce, setHasFlashedOnce] = useState(false); // Track if flashing has started at least once

  const [questionData, setQuestionData] = useState()
  const [thisQuestion, setThisQuestion] = useState()
  const [numberOfQuestion, setNumberOfQuestion] = useState([])
  const [firstAnswer, setFirstAnswer] = useState([])
  const [secondAnswer, setSecondAnswer] = useState([])
  const [thisQuestionNumber, setThisQuestionNumber] = useState()
  const [loading, setLoading] = useState(true)
  const [checkLoading, setCheckLoading] = useState(false)
  const [resultLoading, setResultLoading] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [stopTimer, setStopTimer] = useState(false)
  const [isCheckingAnswers, setIsCheckingAnswers] = useState(false)
  const [showCheckingOverlay, setShowCheckingOverlay] = useState(false)
  const [totalSummation, setTotalSummation] = useState(0)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState(null)
  const [operationError, setOperationError] = useState(null)
  const [answerError, setAnswerError] = useState(null)
  const [resultError, setResultError] = useState(null)
  const [currentTime, setCurrentTime] = useState(0);
  const [result, setResult] = useState()
  const [image, setImage] = useState('')
  let [color, setColor] = useState('black')
  const { assignmentID } = useParams()

  // Store the formatted finish time (mm:ss)
  const [timeSpent, setTimeSpent] = useState('')

  // Track if exam was completed
  const [examCompleted, setExamCompleted] = useState(false)

  // Attempt tracking
  const [currentAttempt, setCurrentAttempt] = useState(null)
  const [totalAttempts, setTotalAttempts] = useState(null)
  const [remainingAttempts, setRemainingAttempts] = useState(null)

  // --- Start Sound Additions ---
  const audioRef = useRef(null);
  const audioRefCorrect = useRef(null);
  const audioRefWrong = useRef(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleUserInteraction = () => {
      audio.play().catch(error => console.log('Background audio playback failed:', error));
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, []);
  // --- End Sound Additions ---

  // Detect mobile/tablet devices - DISABLED fullscreen mode
  useEffect(() => {
    const checkMobile = () => {
      // Set to false to disable mobile fullscreen mode
      setIsMobile(false);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add beforeunload warning to prevent browser close/refresh only
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only show warning if exam is not completed
      if (!examCompleted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave this page? If you leave, no score will be recorded for you and you will not be able to start this assignment again.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examCompleted]);

  // Fullscreen state
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Keyboard Variable
  const [isArabic, setIsArabic] = useState(true);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef(null);
  const keyboardRef = useRef(null);
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

  
  const isAuth = localStorage.getItem('O_authWEB')
  const role = localStorage.getItem('auth_role')
  const initialized = useRef(false);
  const [time, setTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const navigate = useNavigate()
  const mf = useRef();
  let modify = useRef();

  // NEW: PDF download function
  const downloadPDF = () => {
    const input = document.querySelector('.result-popup-container');
    
    html2canvas(input, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // A4 width in mm (with margins)
      const pageHeight = 280; // A4 height in mm (with margins)
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 10; // Start 10mm from top
      
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add new page if content is too long
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download the PDF with timestamp
      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      pdf.save(`exam-result-${assignmentID}-${timestamp}.pdf`);
    });
  };

  const handleButtonClick = (digit) => {
    // Removed keyboard sound as requested
    setAnswer(prev => {
      const newVal = prev + digit;
      return newVal;
    });
  };
  const toggleLanguage = () => {
    soundEffects.playClick();
    setIsArabic(prev => !prev);
  };
  const handleInputFocus = (e) => { e.preventDefault(); setShowKeyboard(true); };

  // Auto-show keyboard for Essay questions and keep it open
  useEffect(() => {
    if (thisQuestion?.typeOfAnswer === 'Essay') {
      setShowKeyboard(true);
    } else {
      setShowKeyboard(false);
    }
  }, [thisQuestion]);

  const renderDigits = () => {
    const digits = isArabic ? arabicDigits : englishDigits;
    
    // Updated layout: 3-column grid
    // Row 1: 7,8,9; Row 2: 4,5,6; Row 3: 1,2,3; Row 4: 0,×,123
    return (
      <>
        {/* Row 1: 7, 8, 9 */}
        <button onClick={() => handleButtonClick(digits[7])} className="digit-button digit-num">{digits[7]}</button>
        <button onClick={() => handleButtonClick(digits[8])} className="digit-button digit-num">{digits[8]}</button>
        <button onClick={() => handleButtonClick(digits[9])} className="digit-button digit-num">{digits[9]}</button>
        
        {/* Row 2: 4, 5, 6 */}
        <button onClick={() => handleButtonClick(digits[4])} className="digit-button digit-num">{digits[4]}</button>
        <button onClick={() => handleButtonClick(digits[5])} className="digit-button digit-num">{digits[5]}</button>
        <button onClick={() => handleButtonClick(digits[6])} className="digit-button digit-num">{digits[6]}</button>
        
        {/* Row 3: 1, 2, 3 */}
        <button onClick={() => handleButtonClick(digits[1])} className="digit-button digit-num">{digits[1]}</button>
        <button onClick={() => handleButtonClick(digits[2])} className="digit-button digit-num">{digits[2]}</button>
        <button onClick={() => handleButtonClick(digits[3])} className="digit-button digit-num">{digits[3]}</button>
        
        {/* Row 4: 0, ×, 123 */}
        <button onClick={() => handleButtonClick(digits[0])} className="digit-button digit-num">{digits[0]}</button>
        <button onClick={handleDelete} className='digit-button digit-action'>×</button>
        <button onClick={toggleLanguage} className='digit-button digit-action'>
          {isArabic ? '123' : '١٢٣'}
        </button>
      </>
    );
  };
  const handleDelete = () => {
    // Removed keyboard sound as requested
    setAnswer(prev => prev.slice(0, -1));
  };

  // Flash Mode Functions
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const getQuestionLines = () => {
    if (!thisQuestion?.question) return [];
    const plainText = stripHtml(thisQuestion.question);
    return plainText.split('\n').filter(line => line.trim());
  };

  const toggleFullscreen = () => {
    soundEffects.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(err => console.log('Fullscreen error:', err));
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFlashMode = () => {
    // Prevent toggling if flash mode is forced by teacher
    if (forceFlashMode) {
      console.warn('⚠️ Cannot toggle flash mode - it is forced by the teacher');
      soundEffects.playClick();
      return;
    }
    
    soundEffects.playClick();
    setFlashMode(prev => !prev);
    setIsFlashing(false);
    setCurrentFlashLine(0);
  };

  const startFlashing = () => {
    soundEffects.playClick();
    setIsFlashing(true);
    setCurrentFlashLine(0);
    setHasFlashedOnce(true); // Mark that flashing has been initiated
  };

  // Flash Mode Animation Effect with gap between lines - STOPS after one loop
  useEffect(() => {
    if (flashMode && isFlashing) {
      const lines = getQuestionLines();
      
      if (currentFlashLine < lines.length) {
        // Show line for selected duration, then 0.1s gap before next line
        const displayTime = flashSpeed * 1000; // Convert to milliseconds
        const timer = setTimeout(() => {
          setCurrentFlashLine(prev => prev + 1);
        }, displayTime + 100); // Display time + 0.1 second gap
        
        return () => clearTimeout(timer);
      } else {
        // All lines shown, STOP flashing (one loop only)
        setIsFlashing(false);
      }
    }
  }, [flashMode, isFlashing, currentFlashLine, flashSpeed]);

  // Reset flash animation when question changes, auto-start if already flashed once or force flash mode
  useEffect(() => {
    if (flashMode) {
      setCurrentFlashLine(0);
      // Auto-start flashing for new questions if user has already started flashing once OR if force flash mode is enabled
      if (hasFlashedOnce || forceFlashMode) {
        setIsFlashing(true);
      }
    } else {
      setIsFlashing(false);
      setCurrentFlashLine(0);
    }
  }, [thisQuestion?._id, flashMode, hasFlashedOnce, forceFlashMode]);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const handleGetQuestion = () => {
        console.log('📡 Fetching assignment details for assignment ID:', assignmentID);
        assignmentDetails(setLoading, setOperationError, setQuestionData, setThisQuestion, setNumberOfQuestion, setThisQuestionNumber, setTotalSummation, assignmentID, timerCount, setTime, setTotalTime, setAnswer, handleGetResult, navigate, setForceFlashMode, setCurrentAttempt, setTotalAttempts, setRemainingAttempts, setFlashSpeed)
      }
      if (isAuth) {
        handleGetQuestion()
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Debug: Track forceFlashMode state changes
  useEffect(() => {
    console.log('🔔 forceFlashMode STATE CHANGED:', forceFlashMode);
  }, [forceFlashMode]);

  // Apply force flash mode when assignment data is loaded
  // IMPORTANT: Wait for both forceFlashMode AND thisQuestion to be set
  // Also enforce flash mode stays on when forced
  useEffect(() => {
    console.log('═══════════════════════════════════════');
    console.log('🔥 Force Flash Mode Check');
    console.log('forceFlashMode:', forceFlashMode);
    console.log('thisQuestion loaded:', !!thisQuestion);
    console.log('thisQuestion._id:', thisQuestion?._id);
    console.log('flashMode currently:', flashMode);
    console.log('flashSpeed:', flashSpeed);
    console.log('═══════════════════════════════════════');
    
    // If flash mode is forced and question is loaded, ensure flash mode is ALWAYS on
    if (forceFlashMode && thisQuestion) {
      if (!flashMode) {
        console.log('✅✅✅ AUTO-ACTIVATING FLASH MODE ✅✅✅');
        console.log('Question ID:', thisQuestion._id);
        console.log('Flash Speed:', flashSpeed);
        
        setFlashMode(true);
        setIsFlashing(true);
        setCurrentFlashLine(0);
        setHasFlashedOnce(true);
        
        console.log('✅ Flash mode state updated - should be active now');
      } else {
        console.log('ℹ️ Flash mode already active (forced mode)');
      }
    } else if (forceFlashMode && !thisQuestion) {
      console.log('⏳ Force flash mode is TRUE but waiting for question to load...');
    } else if (!forceFlashMode) {
      console.log('❌ Force flash mode is FALSE - flash mode is optional');
    }
  }, [forceFlashMode, thisQuestion, flashSpeed, flashMode]);

  const timerCount = () => { /* not used (react-timer-hook handles it) */ }

  const base64ToFile = (url) => {
    let arr = url.split(',');
    let mime = arr[0].match(/:(.*?);/)[1];
    let data = arr[1];
    let dataStr = atob(data);
    let n = dataStr.length;
    let dataArr = new Uint8Array(n);
    while (n--) dataArr[n] = dataStr.charCodeAt(n);
    let file = new File([dataArr], 'File.jpeg', { type: mime });
    return file;
  };

  const takeScreenShot = () => {
    soundEffects.playClick();
    const element = document.querySelector('.whiteboard')
    if (!element) return;
    html2canvas(element).then((canvas) => {
      let image = canvas.toDataURL("image/jpeg")
      setImage(base64ToFile(image))
      document.querySelector('.whiteboard-modify-assignment div').classList.replace('d-none', 'd-flex')
      setTimeout(() => {
        document.querySelector('.whiteboard-modify-assignment div').classList.replace('d-flex', 'd-none')
      }, 2000);
    }).catch(console.log)
  }

  const nextQuestion = () => {
    soundEffects.playClick();
    const activeNumber = thisQuestionNumber;
    
    // Check if this is the last question - auto-end exam
    if (activeNumber === questionData.length) {
      handleManualEndExam();
      return;
    }
    
    if (activeNumber !== questionData.length) {
      const newNumber = activeNumber + 1;
      
      // Update DOM only if question numbers are visible (desktop)
      const numbers = document.querySelectorAll(".question-number p");
      if (numbers.length > 0) {
        let newActive = '';
        for (let i = 0; i < numbers.length; i++) {
          numbers[i].classList.remove('active-question')
          if (numbers[i].innerText === String(newNumber)) newActive = numbers[i]
        }
        if (newActive) newActive.classList.add("active-question");
      }
      
      const question = questionData[newNumber - 1]
      setThisQuestion(question)
      setThisQuestionNumber(newNumber)
      setAnswer('')
      setError('')
      setImage('')
      clearWhiteboard()
      if (question.questionAnswer) setAnswer(question.questionAnswer); else setAnswer('');
    } else {
      setShowKeyboard(false);
    }
  }

  const previousQuestion = () => {
    soundEffects.playClick();
    const activeNumber = thisQuestionNumber;
    if (activeNumber !== 1) {
      const newNumber = activeNumber - 1;
      
      // Update DOM only if question numbers are visible (desktop)
      const numbers = document.querySelectorAll(".question-number p");
      if (numbers.length > 0) {
        let newActive = '';
        for (let i = 0; i < numbers.length; i++) {
          numbers[i].classList.remove('active-question')
          if (numbers[i].innerText === String(newNumber)) newActive = numbers[i]
        }
        if (newActive) newActive.classList.add("active-question");
      }
      
      const question = questionData[newNumber - 1]
      setThisQuestion(question)
      setThisQuestionNumber(newNumber)
      setAnswer('')
      setError('')
      setImage('')
      clearWhiteboard()
      if (question.questionAnswer) setAnswer(question.questionAnswer); else setAnswer('');
    }
  }

  const putQuestion = (e) => {
    soundEffects.playClick();
    // Save current answer before switching questions
    if (answer !== '' && thisQuestion) {
      const currentIndex = questionData.findIndex(q => q._id === thisQuestion._id);
      if (currentIndex !== -1) {
        questionData[currentIndex].questionAnswer = answer;
        // Fire background check only if not already synced
        if (!questionData[currentIndex].checked) {
          syncAnswerWithBackend(thisQuestion._id, answer, currentIndex);
        }
      }
    }
    const numbers = document.querySelectorAll(".question-number p");
    for (let i = 0; i < numbers.length; i++) numbers[i].classList.remove('active-question')
    e.target.classList.add("active-question");
    const numberOfQuestion = parseInt(e.target.innerText) - 1
    const question = questionData[numberOfQuestion];
    setThisQuestion(question)
    setThisQuestionNumber(numberOfQuestion + 1)
    setAnswer('')
    setError('')
    setImage('')
    clearWhiteboard()
    if (question.questionAnswer) setAnswer(question.questionAnswer); else setAnswer('');
  }

  const showAlert = () => {
    audioRefWrong.current.play().catch(e => console.log(e));
    document.querySelector('.alert-question').classList.add('alert-active')
    setTimeout(() => { document.querySelector('.alert-question').classList.remove('alert-active') }, 3500);
  }

  const showAlertSuccess = () => {
    audioRefCorrect.current.play().catch(e => console.log(e));
    document.querySelector('.alert').classList.add('alert-active')
    setTimeout(() => { document.querySelector('.alert').classList.remove('alert-active') }, 3500);
  }

  const openModelAnswer = () => {
    document.querySelector('.model-answer-popup').classList.replace('d-none', 'd-flex')
    setTimeout(() => {
      document.querySelector('.model-answer-popup').classList.remove('answer-popup-hide')
      document.querySelector('.popup-container').classList.remove('popup-top')
    }, 50);
  }

  const closeModelAnswer = () => {
    document.querySelector('.model-answer-popup').classList.add('answer-popup-hide')
    document.querySelector('.popup-container').classList.add('popup-top')
    setTimeout(() => {
      document.querySelector('.model-answer-popup').classList.replace('d-flex', 'd-none')
    }, 300);
  }

  const openRepotAnswer = () => {
    document.querySelector('.report-popup').classList.replace('d-none', 'd-flex')
    setTimeout(() => {
      document.querySelector('.report-popup').classList.remove('answer-popup-hide')
      document.querySelector('.report-popup-container').classList.remove('popup-top')
    }, 50);
  }
  const closeRepotAnswer = () => {
    document.querySelector('.report-popup').classList.add('answer-popup-hide')
    document.querySelector('.report-popup-container').classList.add('popup-top')
    setTimeout(() => {
      document.querySelector('.report-popup').classList.replace('d-flex', 'd-none')
    }, 300);
  }

  const handleChecked = (value) => {
    setAnswer(value);
    // For MCQ and Graph questions, save answer and move to next (no checking yet)
    if (thisQuestion?.typeOfAnswer === 'MCQ' || thisQuestion?.typeOfAnswer === 'Graph') {
      const index = questionData.findIndex(item => item._id === thisQuestion._id);
      questionData[index].questionAnswer = value;
      // Fire background check immediately on MCQ/Graph selection
      syncAnswerWithBackend(thisQuestion._id, value, index);
      setTimeout(() => {
        nextQuestion();
      }, 300);
    }
  };

  // Eagerly check a single answer in the background (fire & forget).
  // Marks question.checked = true on success, false on failure (safety catch).
  const syncAnswerWithBackend = async (questionId, questionAnswer, index) => {
    try {
      const data = new FormData();
      data.append('questionAnswer', questionAnswer);
      const Token = localStorage.getItem('O_authWEB');
      const response = await fetch(
        `${API_BASE_URL}/answer/checkAnswer/${questionId}/${assignmentID}`,
        {
          method: 'POST',
          headers: { 'authrization': `pracYas09${Token}` },
          body: data
        }
      );
      const result = await response.json();
      questionData[index].correct = result.message === 'success' && result.isCorrect === true;
      questionData[index].checked = true;
    } catch (err) {
      console.error('Background sync failed for question', questionId, err);
      questionData[index].checked = false; // Will be re-checked at End Exam
    }
  };

  const checkedQuestion = () => {
    setShowKeyboard(true);
    setResultError('')
    if (answer !== '') {
      setError('')
      const index = questionData.findIndex(item => item._id === thisQuestion._id);
      questionData[index].questionAnswer = answer;
      // Fire background check — don't await, student moves on immediately
      syncAnswerWithBackend(thisQuestion._id, answer, index);

      // Check if this is the last question - auto-end exam
      if (thisQuestionNumber === questionData.length) {
        handleManualEndExam();
      } else {
        nextQuestion();
      }
    } else {
      setError('There is no answer yet!!')
    }
  }

  const openResulPopup = () => {
    soundEffects.playWinSound();
    
    document.querySelector('.result-popup').classList.replace('d-none', 'd-flex')
    setTimeout(() => {
      document.querySelector('.result-popup').classList.remove('result-popup-hide')
      document.querySelector('.result-popup-container').classList.remove('popup-top')
    }, 50);
  }

  // UPDATED: Check all answers before getting result
  const handleGetResult = (mmssFromTimer) => {
    setStopTimer(true);
    setShowKeyboard(false);
    
    const finalTime = mmssFromTimer || '0:00';
    setTimeSpent(finalTime);
    setExamCompleted(true);
    
    console.log('handleGetResult - Received time from timer:', mmssFromTimer);
    console.log('handleGetResult - Final time to save:', finalTime);
    console.log('handleGetResult - questionData available:', questionData ? 'yes' : 'no');
    
    // Start checking all answers (checkAllAnswers will handle if questionData is not available)
    setIsCheckingAnswers(true);
    checkAllAnswers(finalTime);
  }

  // Manual "End Exam" button
  const handleManualEndExam = () => {
    soundEffects.playEndSound();
    setStopTimer(true);
    setShowKeyboard(false);
    
    // Calculate elapsed time based on total time and remaining time
    // The timer shows REMAINING time, we need ELAPSED time
    const timerElement = document.querySelector('.timer .time_item');
    let elapsedTime = '0:00';
    
    if (timerElement) {
      const allTimeItems = document.querySelectorAll('.timer .time_item');
      if (allTimeItems.length >= 2) {
        const remainingMinutes = parseInt(allTimeItems[0].textContent) || 0;
        const remainingSeconds = parseInt(allTimeItems[1].textContent) || 0;
        
        // Calculate elapsed time
        const totalTimeInSeconds = totalTime * 60;
        const remainingTimeInSeconds = (remainingMinutes * 60) + remainingSeconds;
        const elapsedTimeInSeconds = totalTimeInSeconds - remainingTimeInSeconds;
        
        const elapsedMinutes = Math.floor(elapsedTimeInSeconds / 60);
        const elapsedSecs = elapsedTimeInSeconds % 60;
        elapsedTime = `${elapsedMinutes}:${String(elapsedSecs).padStart(2, '0')}`;
        
        console.log('Manual end exam - Total time:', totalTime, 'minutes');
        console.log('Manual end exam - Remaining:', remainingMinutes, 'minutes', remainingSeconds, 'seconds');
        console.log('Manual end exam - Elapsed time:', elapsedTime);
      }
    }
    
    setTimeSpent(elapsedTime);
    setExamCompleted(true);
    
    // Start checking all answers
    setIsCheckingAnswers(true);
    checkAllAnswers(elapsedTime);
  }

  // Check all answers including unanswered ones
  const checkAllAnswers = async (finalTime) => {
    console.log('=== checkAllAnswers START ===');
    console.log('Final time:', finalTime);
    console.log('Assignment ID:', assignmentID);
    
    // Show checking overlay
    setShowCheckingOverlay(true);
    
    // Safety check: if questionData is not available, just call getResult
    if (!questionData || !Array.isArray(questionData) || questionData.length === 0) {
      console.log('⚠️ WARNING: No question data available, calling getResult directly');
      console.log('questionData:', questionData);
      setIsCheckingAnswers(false);
      setShowCheckingOverlay(false);
      setResultLoading(true);
      getResult(
        setResult, 
        setResultLoading, 
        setResultError, 
        assignmentID, 
        openResulPopup, 
        setTotalSummation, 
        setLoading, 
        setOperationError,
        finalTime
      );
      return;
    }

    // CRITICAL FIX: Save the current answer before checking all answers
    // This ensures that the answer the student is currently working on gets saved
    if (thisQuestion && answer && answer.trim() !== '') {
      console.log('💾 Saving current answer before final submission');
      console.log('Current question ID:', thisQuestion._id);
      console.log('Current answer:', answer);
      
      const currentQuestionIndex = questionData.findIndex(
        q => q._id === thisQuestion._id
      );
      
      if (currentQuestionIndex !== -1) {
        questionData[currentQuestionIndex].questionAnswer = answer;
        console.log('✓ Current answer saved to questionData');
      }
    }

    console.log('Total questions to check:', questionData.length);

    // Create a copy of questionData to update
    const updatedQuestionData = [...questionData];

    // Only questions with an answer that weren't synced in the background (safety catch)
    const needsCheck = questionData
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => q.questionAnswer && q.questionAnswer !== '' && !q.checked);

    console.log('Already synced in background:', questionData.length - needsCheck.length, '| Still need checking:', needsCheck.length);

    // Run remaining unchecked questions in parallel (not sequential)
    await Promise.all(needsCheck.map(async ({ q, i }) => {
      try {
        const data = new FormData();
        data.append('questionAnswer', q.questionAnswer);
        const Token = localStorage.getItem('O_authWEB');
        const apiUrl = `${API_BASE_URL}/answer/checkAnswer/${q._id}/${assignmentID}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'authrization': `pracYas09${Token}` },
          body: data
        });
        const result = await response.json();
        if (result.message === 'success' && result.isCorrect === true) {
          updatedQuestionData[i].correct = true;
          console.log(`✓ Q${i + 1} CORRECT (safety check)`);
        } else {
          updatedQuestionData[i].correct = false;
          console.log(`✗ Q${i + 1} WRONG (safety check)`);
        }
      } catch (error) {
        console.error(`❌ Error checking Q${i + 1}:`, error.message);
        updatedQuestionData[i].correct = false;
      }
    }));

    // Mark unanswered questions as wrong
    updatedQuestionData.forEach((q, i) => {
      if (!q.questionAnswer || q.questionAnswer === '') {
        updatedQuestionData[i].correct = false;
      }
    });

    const totalAnswered = updatedQuestionData.filter(q => q.questionAnswer && q.questionAnswer !== '').length;
    const totalCorrect = updatedQuestionData.filter(q => q.correct === true).length;
    console.log('\n=== Summary ===');
    console.log('Total questions:', questionData.length);
    console.log('Total answered:', totalAnswered);
    console.log('Total correct:', totalCorrect);
    
    // Update state with results
    setQuestionData(updatedQuestionData);
    setIsCheckingAnswers(false);
    
    // Hide checking overlay after a brief delay
    setTimeout(() => {
      setShowCheckingOverlay(false);
    }, 500);
    
    // Now get the final result from backend
    setResultLoading(true);
    console.log('\nCalling getResult API with time:', finalTime);
    console.log('=== checkAllAnswers END ===\n');
    
    getResult(
      setResult, 
      setResultLoading, 
      setResultError, 
      assignmentID, 
      openResulPopup, 
      setTotalSummation, 
      setLoading, 
      setOperationError,
      finalTime
    );
  }

  const clearWhiteboard = () => { if (modify !== null) { modify.clear() } }
  const undoWhiteboard = () => { modify.undo() }
  const openWhiteboard = () => {
    document.querySelector('.whiteboard-color').classList.remove('d-none')
    document.querySelector('.whiteboard-modify').classList.remove('d-none')
    document.querySelector('.close-whiteboard').classList.remove('d-none')
    document.querySelector('.whiteboard').classList.remove('close')
  }
  const closeWhiteboard = () => {
    document.querySelector('.whiteboard-color').classList.add('d-none')
    document.querySelector('.whiteboard-modify').classList.add('d-none')
    document.querySelector('.close-whiteboard').classList.add('d-none')
    document.querySelector('.whiteboard').classList.add('close')
    if (thisQuestion?.questionPic)
      document.querySelector('.whiteboard-img-container').classList.add('close-whiteboard-img')
  }
  const openImg = () => {
    if (thisQuestion?.questionPic) {
      document.querySelector('.whiteboard-img-container').classList.remove('close-whiteboard-img')
    }
  }
  const closeImg = () => {
    if (thisQuestion?.questionPic)
      document.querySelector('.whiteboard-img-container').classList.add('close-whiteboard-img')
  }

  // Handle exit attempt on mobile
  const handleExitAttempt = () => {
    soundEffects.playClick();
    setShowExitDialog(true);
  };

  const confirmExit = () => {
    soundEffects.playClick();
    setShowExitDialog(false);
    navigate('/dashboard/student');
  };

  const cancelExit = () => {
    soundEffects.playClick();
    setShowExitDialog(false);
  };

  if (!isAuth) return (<NotLogin />)

  return (
    <>
      {/* --- Start Sound Additions --- */}
      <audio ref={audioRef} src="/audio/birds sound no.mp3" loop preload="auto" />
      <audio ref={audioRefCorrect} src="/audio/correct.mp3" preload="auto" />
      <audio ref={audioRefWrong} src="/audio/wrong.mp3" preload="auto" />
      {/* --- End Sound Additions --- */}

      {/* Conditionally render nav only on desktop */}
      {!isMobile && (
        <nav>
          <div className='nav-container d-flex justify-content-space-between align-items-center'>
            <Link to={'/'}><img src={logo} alt="" /></Link>
            <div className='nav-right-side d-flex align-items-center'>
              {role === 'Student' ? <Link to={'/dashboard/student'}><div className="gear"><i className="fa fa-graduation-cap" aria-hidden="true"></i></div></Link> : null}
              {isAuth ? <Link to={'/user/info'}><img src={profileImg} alt="" /></Link> : (
                <>
                  <Link to={'/auth/register'}>
                    <div className="nav-btn nav-btn-signup" style={{ marginRight: '15px' }}>
                      Sign Up
                      <div className="nav-btn2"></div>
                    </div>
                  </Link>
                  <Link to={'/auth/login'}>
                    <div className="nav-btn">
                      Login
                      <div className="nav-btn2"></div>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {loading ? <QuestionLoading /> : operationError ?
        <div className='assignment-error-ops d-flex justify-content-center flex-direction-column align-items-center'>
          {operationError.includes('completed') || operationError.includes('attempts') ? (
            <CircleCheck size={200} style={{ color: '#4CAF50', marginBottom: '1rem' }} strokeWidth={1.5} />
          ) : null}
          <p className='text-center' style={{fontSize: '22px', fontWeight: '500', color: operationError.includes('completed') || operationError.includes('attempts') ? '#4CAF50' : '#F875AA'}}>{operationError}</p>
          {operationError.includes('completed') || operationError.includes('attempts') ? (
            <div style={{ marginTop: '20px' }}>
              <Link to='/dashboard/student'>
                <button className='button' style={{backgroundColor: '#4CAF50', padding: '0.8rem 2rem', fontSize: '1.2rem'}}>Back to Dashboard</button>
              </Link>
            </div>
          ) : null}
        </div> :
        <div className={`question-container ${isMobile ? 'mobile-fullscreen' : ''} d-flex justify-content-center flex-direction-column align-items-center`}>
          {/* Mobile Header - Only show on mobile */}
          {isMobile && (
            <div className="mobile-assignment-header">
              <button className="mobile-exit-btn" onClick={handleExitAttempt} aria-label="Exit Assignment">
                <i className="fa fa-times" aria-hidden="true"></i>
              </button>
              <div className="mobile-header-info">
                <span className="mobile-question-indicator">Q{thisQuestionNumber}/{questionData?.length || 0}</span>
              </div>
            </div>
          )}

          {/* Question Numbers - Hide on mobile */}
          {!isMobile && (
            <div className="question-number d-flex">
              {numberOfQuestion.length !== 0 ? (() => {
                const q0 = questionData[0];
                const q0Correct = q0?.correct === true;
                const q0Wrong = q0?.correct === false;
                const q0IsActive = thisQuestionNumber === 1;
                const q0HasAnswer = !q0IsActive && !q0Correct && !q0Wrong && !!q0?.questionAnswer;
                return (
                  <p 
                    className={`${q0IsActive ? 'active-question' : ''} ${q0HasAnswer ? 'has-answer' : ''}`} 
                    onClick={putQuestion}
                  >
                    1
                  </p>
                );
              })() : null}
              {numberOfQuestion?.map((item, index) => {
                if (item !== 1) {
                  const question = questionData[item - 1];
                  const isActive = thisQuestionNumber === item;
                  const hasAnswer = !isActive && !!question?.questionAnswer;
                  
                  return (
                    <p 
                      key={item} 
                      className={`
                        ${isActive ? 'active-question' : ''}
                        ${hasAnswer ? 'has-answer' : ''}
                      `.trim()} 
                      onClick={putQuestion}
                    >
                      {item}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          )}

          <div className="question-content-wrapper d-flex">
            <div className="question-form">
            <div className="question-form-head d-flex justify-content-space-between align-items-center">
              <p>Q{thisQuestionNumber}</p>
              <div className="end-head d-flex align-items-center">
                <div
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                  className="fullscreen-button"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize2 size={16} color="#fff" /> : <Maximize2 size={16} color="#fff" />}
                </div>
                {/* Flash mode toggle button - only clickable if not forced */}
                <div 
                  title={forceFlashMode ? "Flash Mode (Locked by Teacher)" : "Flash Mode"} 
                  className={`flash-mode-button ${flashMode ? 'flash-active' : ''} ${forceFlashMode ? 'flash-locked' : ''}`} 
                  onClick={toggleFlashMode}
                  style={{
                    opacity: forceFlashMode ? 0.5 : 1,
                    cursor: forceFlashMode ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="fa fa-bolt" aria-hidden="true"></i>
                  {forceFlashMode && <i className="fa fa-lock" style={{fontSize: '10px', position: 'absolute', bottom: '2px', right: '2px'}}></i>}
                </div>
                {flashMode && (
                  <div className='flash-speed-control'>
                    <label>Flash Speed:</label>
                    <select 
                      value={flashSpeed} 
                      onChange={(e) => setFlashSpeed(parseFloat(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="0.5">0.5s</option>
                      <option value="1.0">1.0s</option>
                      <option value="1.5">1.5s</option>
                      <option value="2.0">2.0s</option>
                      <option value="2.5">2.5s</option>
                      <option value="3.0">3.0s</option>
                    </select>
                  </div>
                )}
                <div title="Open Abacus" className="abacus-button" onClick={() => setShowAbacus(!showAbacus)}>
                  <Calculator size={24} strokeWidth={2.5} style={{ color: '#65C6EE' }} />
                </div>
                {time !== 0 && !examCompleted ? (
                  <div className="timer">
                    <MyTimer
                      expiryTimestamp={time}
                      handleGetResult={handleGetResult}
                      totalTime={totalTime}
                      stopTimer={stopTimer}
                    />
                  </div>
                ) : examCompleted ? (
                  <div className="timer">
                    <span>Completed: {timeSpent}</span>
                  </div>
                ) : (
                  <div className="timer">Loading timer...</div>
                )}
              </div>
            </div>

            {showAbacus && <AbacusSimulator onClose={() => setShowAbacus(false)} />}

            <div className="question-form-body">
              {thisQuestion?.questionPic ? (
                <div className='d-flex question-img justify-content-center align-items-center'>
                  <img src={thisQuestion?.questionPic} alt="" />
                </div>
              ) : null}
              
              {flashMode ? (
                <div className="flash-mode-question">
                  {!hasFlashedOnce && !isFlashing ? (
                    <button 
                      className="start-flash-btn" 
                      onClick={startFlashing}
                    >
                      Start
                    </button>
                  ) : isFlashing && currentFlashLine < getQuestionLines().length ? (
                    <div className="flash-line flash-fade-out" key={currentFlashLine}>
                      {getQuestionLines()[currentFlashLine]}
                    </div>
                  ) : (
                    <div className="flash-answer-text">
                      ANSWER
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="question-html-clean"
                  dangerouslySetInnerHTML={{
                    __html: renderLatexInHtml(thisQuestion?.question || '')
                  }}
                />
              )}

              {thisQuestion?.typeOfAnswer === 'Essay' ? (
                <div className='math-keyboard'>
                  <p>Write your answer here</p>
                  <div className="answer-input-container" style={{ position: 'relative', width: '100%' }}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={answer}
                      onFocus={(e) => handleInputFocus(e)}
                      readOnly
                      placeholder={isArabic ? 'Enter the answer' : 'Enter the answer'}
                      className="input-style"
                    />
                    {showKeyboard && (
                      <div ref={keyboardRef} className="keyboard-container">
                        {renderDigits()}
                        <button className='question-form-btn keyboard-next-btn digit-next' onClick={() => { checkedQuestion(); }}>
                          {checkLoading ? <span className="loader"></span> : <ArrowRight size={24} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
              {(thisQuestion?.typeOfAnswer !== 'MCQ' && thisQuestion?.typeOfAnswer !== 'Graph') && <p className='text-error'>{error}</p>}
            </div>
            </div>

            {/* MCQ Container beside question box */}
            {thisQuestion?.typeOfAnswer === 'MCQ' && (
              <div className='mcq-container'>
                <h3 className='mcq-title'>Choose your answer:</h3>
                <div className='mcq-answer-layout'>
                  {thisQuestion.wrongAnswer?.map((item, index) => (
                    <label key={item} className={`mcq-choice ${answer === item ? 'selected' : ''}`}>
                      <input 
                        type='radio' 
                        value={item} 
                        name={`mcq_${thisQuestion._id}`} 
                        checked={answer === item}
                        onChange={e => handleChecked(e.target.value)} 
                      />
                      <span className='mcq-text'>{item}</span>
                    </label>
                  ))}
                </div>
                {error && <p className='text-error mcq-error'>{error}</p>}
              </div>
            )}

            {/* Graph Container beside question box */}
            {thisQuestion?.typeOfAnswer === 'Graph' && (
              <div className='mcq-container graph-container'>
                <h3 className='mcq-title'>Choose your answer:</h3>
                <div className='graph-answer-layout'>
                  {thisQuestion.wrongPicAnswer?.map((item, index) => (
                    <label key={item} className={`graph-choice ${answer === item ? 'selected' : ''}`}>
                      <input 
                        type='radio' 
                        value={item} 
                        name={`graph_${thisQuestion._id}`}
                        checked={answer === item}
                        onChange={e => handleChecked(e.target.value)} 
                      />
                      <img src={item} alt="Graph answer choice" />
                    </label>
                  ))}
                </div>
                {error && <p className='text-error mcq-error'>{error}</p>}
              </div>
            )}
          </div>

          {resultError ? <div className='d-flex end-exam-error justify-content-flex-start'><p className='error-line'>You must answer at least one question first!!</p></div> : null}
          <div className="alert"> Congratulations! your answer is coreect.</div>
          <div className="alert alert-question"> Wrong!❌</div>
        </div>
      }

      {/* model answer popup start */}
      <div className="model-answer-popup answer-popup-hide d-none justify-content-center align-items-center">
        <div className='popup-container popup-top'>
          <div className="popup-head">
            {isCorrect ? <p>Correct Answer</p> : <p className='text-error'>Wrong Answer</p>}
          </div>
          <div className="popup-body">
            <p>Model Answer</p>
            <div className="d-flex justify-content-center align-items-center"><img src={thisQuestion?.answerPic} alt="" /></div>
          </div>
          <button className='button popup-btn' onClick={closeModelAnswer}>Close</button>
        </div>
      </div>
      {/* model answer popup end */}

      {/* assignment report popup start */}
      <div className="model-answer-popup report-popup answer-popup-hide d-none justify-content-center align-items-center">
        <div className='popup-container report-popup-container popup-top'>
          <div className="popup-head report-head">
            <p>Assignment Report</p>
          </div>
          <div className="popup-body">
            <div className="assignment-popup-head d-flex align-items-center">
              <div><img src={alerm} alt="" /></div>
              <div><p>{answerError}</p></div>
            </div>
            <div className="first-ans d-flex align-items-center">
              <p>Your answer:</p>
              {firstAnswer.length !== 0 ? firstAnswer.map(item => (
                <div key={item} className="mcq-answer">
                  <div className="mcq-answer-layout">
                    <input className='d-none' type="radio" id="berries_1" value={item} name="berries" />
                    <MathInput size="small" initialLatex={item} />
                    <div className="answer-layout"></div>
                  </div>
                </div>
              )) : <span className='answer-line'>____</span>}
            </div>
          </div>
          <button className='button popup-btn' onClick={closeRepotAnswer}>Close</button>
        </div>
      </div>
      {/* assignment report popup end */}

      {/* result popup start - UPDATED WITH DOWNLOAD BUTTON */}
      <div className="result-popup result-popup-hide d-none justify-content-center align-items-center">
        <div className='result-popup-container popup-top'>
          <div className="result-popup-head">
            <div className="d-flex justify-content-center align-items-center"><img src={avatarExam} alt="" /></div>
            <div className="d-flex justify-content-center align-items-center"><p>Congratulations you have finished the exam</p></div>
          </div>
          <div className="result-popup-body">
            <table>
              <thead>
                <tr>
                  <th>Answered Questions</th>
                  <th>Result</th>
                  <th>Total Summation</th>
                  <th>Time Spent</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{result?.questionsNumber}</td>
                  <td>{result?.total}</td>
                  <td>{totalSummation}</td>
                  <td>{result?.time || timeSpent || '—'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="result-popup-actions d-flex justify-content-center gap-2 mt-3">
            <button className='button popup-btn btn-download' onClick={downloadPDF}>
              <i className="fa fa-download" aria-hidden="true"></i> Download PDF
            </button>
            <Link to={'/dashboard/student'}>
              <button className='button popup-btn'>Close</button>
            </Link>
          </div>
        </div>
      </div>
      {/* result popup end */}

      {/* whiteboard start */}
      <div className="whiteboard-container">
        <div className='whiteboard close'>
          <CanvasDraw ref={(canvasDraw) => (modify = canvasDraw)} loadTimeOffset={1} lazyRadius={1} brushColor={color} brushRadius={1.5} canvasWidth={'100%'} canvasHeight={'100%'} />
        </div>
        <div className="whiteboard-color d-none">
          <div className='black' onClick={() => setColor('black')}></div>
          <div className='blue' onClick={() => setColor('blue')}></div>
          <div className='red' onClick={() => setColor('red')}></div>
        </div>
        <div className="whiteboard-modify whiteboard-modify-assignment d-flex justify-content-center align-items-center d-none">
          <div className='justify-content-center align-items-center d-none'><p>✔</p></div>
          <i onClick={openImg} className="fa fa-picture-o img-icon" aria-hidden="true"></i>
          <i onClick={clearWhiteboard} className="clear fa fa-eraser" aria-hidden="true"></i>
          <i onClick={undoWhiteboard} className="fa fa-undo" aria-hidden="true"></i>
        </div>
        <div className="close-whiteboard d-none">
          <p onClick={closeWhiteboard}>x</p>
        </div>
        {thisQuestion?.questionPic ? (
          <div className="whiteboard-img-container close-whiteboard-img">
            <div className="whiteboard-img d-flex justify-content-center align-items-center">
              <img src={thisQuestion?.questionPic} alt="" />
            </div>
            <div onClick={closeImg} className="x-img d-flex justify-content-center align-items-center"><p>x</p></div>
          </div>
        ) : null}
      </div>
      {/* whiteboard end */}

      {/* Checking Answers Overlay */}
      {showCheckingOverlay && (
        <div className="checking-overlay">
          <div className="checking-content">
            <div className="checking-spinner"></div>
            <p className="checking-text">Wait.. checking the answers. Do not close!</p>
          </div>
        </div>
      )}

      {/* Exit Confirmation Dialog - Mobile */}
      {showExitDialog && (
        <div className="exit-dialog-overlay">
          <div className="exit-dialog">
            <div className="exit-dialog-icon">
              <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            </div>
            <h3>Exit Assignment?</h3>
            <p>Are you sure you want to leave? If you exit now, no score will be recorded and you may not be able to restart this assignment.</p>
            <div className="exit-dialog-actions">
              <button className="exit-dialog-btn cancel-btn" onClick={cancelExit}>
                Stay
              </button>
              <button className="exit-dialog-btn confirm-btn" onClick={confirmExit}>
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Assignment
