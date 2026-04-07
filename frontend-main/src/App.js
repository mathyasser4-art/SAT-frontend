import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Home'
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import System from './pages/system/System'
import User from './pages/user/User'
import ContactMobile from './pages/contactMobile/ContactMobile'
import Question from './pages/question/Question'
import VerifyAccount from './pages/verifyAccount/VerifyAccount'
import ResPasEmail from './pages/resPasEmail/ResPasEmail'
import ResPasCode from './pages/resPasCode/ResPasCode'
import ResetPassword from './pages/resetPassword/ResetPassword'
import Unit from './pages/unit/Unit';
import DashboardSchool from './pages/dashboardSchool/DashboardSchool';
import Student from './pages/student/Student';
import Class from './pages/class/Class';
import Subject from './pages/subject/Subject';
import Teacher from './pages/teacher/Teacher';
import StudentDashboard from './pages/studentDashboard/StudentDashboard';
import TeacherDashboard from './pages/teacherDashboard/TeacherDashboard';
import Assignment from './pages/assignment/Assignment';
import AssignmentReport from './pages/assignmentReport/AssignmentReport';
import StudentReport from './pages/studentReport/StudentReport';
import IT from './pages/IT/IT';
import Supervisor from './pages/supervisor/Supervisor';
import SupervisorDashboard from './pages/supervisorDashboard/SupervisorDashboard'
import TeacherAssignmentReports from './components/teacherReports/TeacherAssignmentReports';
import StudentHistory from './components/studentHistory/StudentHistory';
import Pricing from './pages/pricing/Pricing';


function App() {
  const isAuth = localStorage.getItem('O_authWEB')
  useEffect(() => {
    localStorage.removeItem('cartona')
  }, [])
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/auth/login' element={isAuth ? <Navigate to='/' /> : <Login />} />
      <Route path='/auth/register' element={isAuth ? <Navigate to='/' /> : <Register />} />
      <Route path='/verify/:email' element={isAuth ? <Navigate to='/' /> : <VerifyAccount />} />
      <Route path='/resetPassword/email' element={isAuth ? <Navigate to='/' /> : <ResPasEmail />} />
      <Route path='/resetPassword/code/:email' element={isAuth ? <Navigate to='/' /> : <ResPasCode />} />
      <Route path='/resetPassword/:email' element={isAuth ? <Navigate to='/' /> : <ResetPassword />} />
      <Route path='/system/:questionTypeID' element={<System />} />
      <Route path='/Unit/:questionTypeID/:subjectID' element={<Unit />} />
      <Route path='/user/info' element={<User />} />
      <Route path='/contact' element={<ContactMobile />} />
      <Route path='/question/:chapterID/:questionTypeID/:subjectID' element={<Question />} />
      <Route path='/dashboard-school' element={isAuth ? <DashboardSchool /> : <Navigate to='/' />} />
      <Route path='/dashboard-school/student' element={isAuth ? <Student /> : <Navigate to='/' />} />
      <Route path='/dashboard-school/class' element={isAuth ? <Class /> : <Navigate to='/' />} />
      <Route path='/dashboard-school/subject' element={isAuth ? <Subject /> : <Navigate to='/' />} />
      <Route path='/dashboard-school/teacher' element={isAuth ? <Teacher /> : <Navigate to='/' />} />
      <Route path='/dashboard-school/it' element={isAuth ? <IT /> : <Navigate to='/' />} />
      <Route path='/dashboard-school/supervisor' element={isAuth ? <Supervisor /> : <Navigate to='/' />} />
      <Route path='/dashboard/student' element={isAuth ? <StudentDashboard /> : <Navigate to='/' />} />
      <Route path='/student/assignment/:assignmentID' element={isAuth ? <Assignment /> : <Navigate to='/' />} />
      <Route path='/dashboard/teacher' element={isAuth ? <TeacherDashboard /> : <Navigate to='/' />} />
      <Route path='/dashboard/supervisor' element={isAuth ? <SupervisorDashboard /> : <Navigate to='/' />} />
      <Route path='/teacher/assignmentReport/:studentID/:assignmentID' element={isAuth ? <AssignmentReport /> : <Navigate to='/' />} />
      <Route path='/student/myReport/:assignmentID' element={isAuth ? <StudentReport /> : <Navigate to='/' />} />
      <Route path="/assignment/:assignmentID/reports" element={<TeacherAssignmentReports />} />
      <Route path="/teacher/student/:studentID/history" element={isAuth ? <StudentHistory /> : <Navigate to='/' />} />
      <Route path='/pricing' element={<Pricing />} />

    </Routes>
  )
}

export default App;
