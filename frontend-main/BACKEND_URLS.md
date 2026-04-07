# Backend API URLs

## 🌐 Base URLs

### Production (Railway)
```
https://backend-production-6752.up.railway.app
```

### Local Development
```
http://localhost:54112
```

---

## 📍 Health Check Endpoints

### Check if backend is running
```
GET https://backend-production-6752.up.railway.app/health
```

**Response (Healthy)**:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-01-16T12:00:00.000Z"
}
```

### Root endpoint
```
GET https://backend-production-6752.up.railway.app/
```

**Response**: "Hello World!"

---

## 🎯 Assignment & Answer Endpoints

All these endpoints are related to the assignment scoring system that was just fixed.

### 1. Submit Answer (During Exam)
```
POST https://backend-production-6752.up.railway.app/answer/checkAnswer/{questionID}/{assignmentID}
```

**Authentication**: Student only  
**Body** (FormData):
- `questionAnswer`: Student's answer (string)
- `image`: Optional - for Graph-type questions (file upload)

**What it does**: 
- Saves student's answer to database
- Checks if answer is correct using the new normalization logic
- Returns immediate feedback (correct/wrong)

**Example**:
```javascript
POST /answer/checkAnswer/507f1f77bcf86cd799439011/507f191e810c19729de860ea

FormData:
  questionAnswer: "٥"  // Arabic digit 5

Response:
{
  "message": "success",
  "isCorrect": true,
  "answer": {
    "question": "507f1f77bcf86cd799439011",
    "firstAnswer": "٥",
    "isCorrect": true,
    "point": 10
  }
}
```

---

### 2. Get Final Result (When Exam Ends)
```
GET https://backend-production-6752.up.railway.app/answer/getResult/{assignmentID}?time=5:30
```

**Authentication**: Student only  
**Query Parameters**:
- `time`: Time taken to complete exam (format: "mm:ss")

**What it does**: 
- Retrieves all student's saved answers
- Gets all correct answers from questions database
- **Uses the new normalization and comparison logic** to calculate score
- Saves final score to database
- Returns result

**Example**:
```javascript
GET /answer/getResult/507f191e810c19729de860ea?time=5:30

Response:
{
  "message": "success",
  "result": {
    "total": 85,           // Student's score
    "questionsNumber": 10, // Total questions answered
    "time": "5:30"        // Time taken
  },
  "totalSummation": 100   // Maximum possible score
}
```

---

### 3. Get Student's Report (Teacher View)
```
GET https://backend-production-6752.up.railway.app/answer/getAnswer/{studentID}/{assignmentID}
```

**Authentication**: Teacher only  
**What it does**: 
- Retrieves detailed report of student's answers
- Shows what student answered vs correct answers
- Shows points per question

**Example**:
```javascript
GET /answer/getAnswer/507f1f77bcf86cd799439011/507f191e810c19729de860ea

Response:
{
  "message": "success",
  "answers": {
    "assignment": {...},
    "time": "5:30",
    "total": 85,
    "questionsNumber": 10
  },
  "report": {
    "questions": [
      {
        "_id": "...",
        "question": "What is 2 + 3?",
        "firstAnswer": "٥",           // What student wrote
        "isCorrect": true,
        "questionPoints": 10,
        "point": 10                   // Points awarded
      },
      ...
    ]
  }
}
```

---

### 4. Get Own Report (Student View)
```
GET https://backend-production-6752.up.railway.app/answer/getMyReport/{assignmentID}
```

**Authentication**: Student only  
**What it does**: 
- Student can see their own answers and results
- Shows correct/incorrect for each question

---

### 5. Debug Endpoint (For Testing)
```
GET https://backend-production-6752.up.railway.app/answer/debug/{studentID}/{assignmentID}
```

**Authentication**: None (public for debugging)  
**What it does**: 
- Shows detailed information about answer document
- Useful for debugging why scores might be wrong

**Example**:
```javascript
GET /answer/debug/507f1f77bcf86cd799439011/507f191e810c19729de860ea

Response:
{
  "found": true,
  "documentId": "...",
  "studentId": "507f1f77bcf86cd799439011",
  "assignmentId": "507f191e810c19729de860ea",
  "time": "5:30",
  "total": 85,
  "questionsNumber": 10,
  "questionsCount": 10,
  "questions": [
    {
      "index": 1,
      "questionId": "...",
      "questionText": "What is 2 + 3...",
      "questionType": "MCQ",
      "firstAnswer": "٥",
      "isCorrect": true,
      "point": 10
    },
    ...
  ]
}
```

---

## 🔧 How Frontend Uses These URLs

The frontend configuration is in `src/config/api.config.js`:

```javascript
const USE_LOCAL = process.env.REACT_APP_USE_LOCAL === 'true';

const API_CONFIG = {
  local: 'http://localhost:54112',
  production: 'https://backend-production-6752.up.railway.app'
};

export const API_BASE_URL = USE_LOCAL ? API_CONFIG.local : API_CONFIG.production;
```

### To Switch Between Local and Production:

**For Local Development**:
1. Create a `.env` file in the root
2. Add: `REACT_APP_USE_LOCAL=true`
3. Start local backend on port 54112

**For Production** (default):
- Just deploy to Vercel
- It automatically uses Railway backend

---

## 🔐 Authentication Headers

All protected endpoints require this header:

```javascript
headers: {
  'Content-Type': 'application/json',
  'authrization': `pracYas09${Token}`
}
```

Where `Token` is retrieved from:
```javascript
const Token = localStorage.getItem('O_authWEB')
```

**Note**: Yes, it's spelled "authrization" (missing 'o') in the code!

---

## 📊 Assignment Scoring Flow

Here's the complete flow using these URLs:

### 1. Student Takes Exam
```javascript
// Student answers each question
for each question:
  POST /answer/checkAnswer/{questionID}/{assignmentID}
  Body: { questionAnswer: "student's answer" }
  
  // Answer saved to database with normalization
```

### 2. Student Finishes Exam
```javascript
// Frontend calls getResult
GET /answer/getResult/{assignmentID}?time=5:30

// Backend does:
1. Get student's saved answers from database
2. Get correct answers from questions
3. For each answer:
   - Normalize student answer (Arabic→English, trim, etc.)
   - Normalize correct answer
   - Compare using new logic
   - Award points if match
4. Save total score
5. Return result
```

### 3. Teacher Views Results
```javascript
// Teacher checks student's work
GET /answer/getAnswer/{studentID}/{assignmentID}

// Shows detailed report with all questions
```

---

## 🧪 Testing the Backend

### Test Health
```bash
curl https://backend-production-6752.up.railway.app/health
```

### Test Answer Submission (requires auth token)
```bash
curl -X POST \
  https://backend-production-6752.up.railway.app/answer/checkAnswer/QUESTION_ID/ASSIGNMENT_ID \
  -H "authrization: pracYas09YOUR_TOKEN" \
  -F "questionAnswer=5"
```

### Test Get Result (requires auth token)
```bash
curl -X GET \
  "https://backend-production-6752.up.railway.app/answer/getResult/ASSIGNMENT_ID?time=5:30" \
  -H "authrization: pracYas09YOUR_TOKEN"
```

### Test Debug Endpoint (no auth required)
```bash
curl https://backend-production-6752.up.railway.app/answer/debug/STUDENT_ID/ASSIGNMENT_ID
```

---

## 📝 Important Notes

1. **Port**: Local backend runs on port `54112` (not the standard 3000)

2. **CORS**: Backend allows requests from:
   - https://practice-papers.com
   - https://practicepapers.online
   - https://frontend-pearl-ten-60.vercel.app
   - http://localhost:3000
   - http://localhost:3001

3. **Rate Limiting**: Maximum 100 requests per minute

4. **Authentication**: 
   - Student endpoints require student auth
   - Teacher endpoints require teacher auth
   - Debug endpoint is public (for testing)

5. **The Fixes Applied**:
   - ✅ Normalization function converts Arabic↔English digits
   - ✅ Whitespace is trimmed automatically
   - ✅ Case-insensitive for Essay questions
   - ✅ Fixed database query to include `correctPicAnswer`
   - ✅ Fixed falsy value handling (0, "", etc.)

---

## 🚀 Deployment URLs

### Backend (Railway)
- **URL**: https://backend-production-6752.up.railway.app
- **Status**: ✅ Active
- **Database**: MongoDB Atlas

### Frontend (Vercel)
- **URL**: https://frontend-pearl-ten-60.vercel.app
- **Domain**: https://practice-papers.com

---

**Last Updated**: January 16, 2026  
**Status**: All endpoints working with fixes applied ✅
