import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import API_BASE_URL from '../../config/api.config';
import '../../reusable.css';
import './TeacherReports.css';

function TeacherAssignmentReports() {
  const [students, setStudents] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { assignmentID } = useParams();
  const navigate = useNavigate();

  // ✅ Fetch all student results for this assignment
  useEffect(() => {
    const fetchStudentResults = async () => {
      try {
        console.log('📊 Fetching student results for assignment:', assignmentID);

        // Check if token exists
        const token = localStorage.getItem('O_authWEB');
        if (!token) {
          setError({
            type: 'auth',
            message: 'You are not logged in. Please login as a teacher to view reports.'
          });
          setLoading(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/assignment/${assignmentID}/student-results`, {
          headers: {
            authrization: 'pracYas09' + token,
          }
        });

        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📦 Full API response:', data);
        console.log('👥 Students in response:', data.students?.length || 0);
        
        // 🔍 DEBUG: Log each student object to see its structure
        if (data.students && data.students.length > 0) {
          console.log('🔍 DEBUG: Total students in API response:', data.students.length);
          console.log('🔍 DEBUG: First student COMPLETE object:', data.students[0]);
          console.log('🔍 DEBUG: First student JSON:', JSON.stringify(data.students[0], null, 2));
          
          data.students.forEach((student, index) => {
            console.log(`🔍 DEBUG Student ${index + 1} ALL FIELDS:`, student);
            console.log(`🔍 DEBUG Student ${index + 1} NAME ATTEMPTS:`, {
              'student.name': student.name,
              'student.userName': student.userName,
              'student.studentName': student.studentName,
              'student.user': student.user,
              'student.user?.name': student.user?.name,
              'student.user?.userName': student.user?.userName,
              'student.studentId': student.studentId,
              'student._id': student._id,
              'ALL KEYS': Object.keys(student),
              'HAS student field?': !!student.student,
              'student.student': student.student
            });
          });
        } else {
          console.log('🔍 DEBUG: NO STUDENTS in API response!');
        }

        // Handle authentication errors (502, 401, 403)
        if (response.status === 502 || response.status === 401 || response.status === 403) {
          console.error('🔒 Authentication error:', data.message);
          setError({
            type: 'auth',
            message: 'Authentication failed. Your session may have expired or you may not have teacher permissions.',
            details: data.message
          });
          setLoading(false);
          return;
        }

        if (data.message === 'success') {
          console.log('✅ Real API data loaded:', data.students?.length, 'students');
          
          // Filter students who have completed the assignment (have a score)
          const completedStudents = (data.students || []).filter(student => 
            student.score !== undefined && student.score !== null
          );
          
          console.log('✅ Students with completed assignments:', completedStudents.length);
          
          setStudents(completedStudents);
          setAssignment(data.assignment);
        } else {
          console.log('⚠️ API returned non-success message:', data.message);
          setError({
            type: 'api',
            message: 'Failed to load student results',
            details: data.message
          });
        }

      } catch (error) {
        console.error('❌ Error fetching student results:', error);
        setError({
          type: 'network',
          message: 'Network error occurred while fetching results',
          details: error.message
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudentResults();
  }, [assignmentID]);

  // Handle logout and clear authentication
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const selectAllStudents = () => {
    setSelectedStudents(students.map(student => student._id));
  };

  const deselectAllStudents = () => {
    setSelectedStudents([]);
  };

  // Format date and time for display
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateString;
    }
  };

  // Calculate grade letter based on percentage
  const getGradeLetter = (percentage) => {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  // Generate individual student PDF with improved layout
  const generateStudentPDF = async (student) => {
    try {
      // Get student name from userName field
      const studentName = student.userName || 'Unknown Student';
      console.log('📄 Generating PDF for student:', studentName);
      
      // Show loading message
      const singleLoadingDiv = document.createElement('div');
      singleLoadingDiv.id = 'pdf-loading-single';
      singleLoadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; text-align: center;';
      singleLoadingDiv.innerHTML = '<i class="fa fa-spinner fa-spin" style="font-size: 36px; color: #28a745;"></i><p style="margin-top: 15px; font-size: 16px;">Generating PDF Report...</p>';
      document.body.appendChild(singleLoadingDiv);

      const gradeLetter = getGradeLetter(student.percentage);
      const completedDate = formatDateTime(student.completedAt);

      const tempDiv = document.createElement('div');
      tempDiv.className = 'student-report-pdf';
      tempDiv.style.padding = '40px';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.width = '800px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      
      tempDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #28a745; padding-bottom: 20px;">
          <img src="/logo.png" alt="Logo" style="width: 120px; height: auto; margin-bottom: 15px;" onerror="this.style.display='none'" />
          <h1 style="color: #28a745; margin-bottom: 10px; font-size: 32px;">Student Assignment Report</h1>
          <h2 style="color: #666; margin: 5px 0; font-size: 20px;">${assignment?.title || 'N/A'}</h2>
        </div>

        <div style="margin-bottom: 30px; padding: 20px; background-color: #f8f9fa; border-radius: 8px;">
          <h3 style="color: #333; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #28a745; padding-bottom: 8px;">Student Information</h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 16px;">
            <div>
              <p style="margin: 8px 0;"><strong style="color: #555;">Student Name:</strong> <span style="color: #000;">${studentName}</span></p>
              <p style="margin: 8px 0;"><strong style="color: #555;">Email:</strong> <span style="color: #000;">${student.email || 'N/A'}</span></p>
            </div>
            <div>
              <p style="margin: 8px 0;"><strong style="color: #555;">Completed On:</strong> <span style="color: #000;">${completedDate}</span></p>
              <p style="margin: 8px 0;"><strong style="color: #555;">Time Spent:</strong> <span style="color: #000; font-weight: 600;">${student.timeSpent || '0:00'}</span></p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px; padding: 25px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <h3 style="color: white; margin-bottom: 20px; font-size: 22px;">FINAL MARK</h3>
          <div style="background-color: rgba(255,255,255,0.95); border-radius: 8px; padding: 20px; margin-bottom: 15px;">
            <p style="margin: 0; font-size: 48px; font-weight: bold; color: #333;">
              ${student.score} / ${student.totalPossible}
            </p>
            <p style="margin: 10px 0 0 0; font-size: 16px; color: #666;">Points Earned</p>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            <div style="background-color: rgba(255,255,255,0.95); border-radius: 8px; padding: 15px;">
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: #28a745;">${student.percentage}%</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Percentage</p>
            </div>
            <div style="background-color: rgba(255,255,255,0.95); border-radius: 8px; padding: 15px;">
              <p style="margin: 0; font-size: 36px; font-weight: bold; color: #007bff;">${gradeLetter}</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Grade</p>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; margin-bottom: 15px; font-size: 20px; border-bottom: 2px solid #28a745; padding-bottom: 8px;">Assignment Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tbody>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600; color: #555; width: 50%;">Questions Answered</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #000;">${student.answeredQuestions || 0} of ${student.totalQuestions || assignment?.totalQuestions || 'N/A'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600; color: #555;">Total Possible Points</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #000;">${student.totalPossible}</td>
              </tr>
              <tr style="background-color: #f8f9fa;">
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600; color: #555;">Points Earned</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #28a745; font-weight: 600;">${student.score}</td>
              </tr>
              <tr>
                <td style="padding: 12px; border: 1px solid #ddd; font-weight: 600; color: #555;">Time Duration</td>
                <td style="padding: 12px; border: 1px solid #ddd; text-align: center; color: #000; font-weight: 600;">${student.timeSpent || '0:00'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; text-align: center; color: #999; font-size: 12px;">
          <p style="margin: 0;">Report Generated: ${new Date().toLocaleString()}</p>
          <p style="margin: 5px 0 0 0;">Abacus Heroes - Educational Platform</p>
        </div>
      `;

      document.body.appendChild(tempDiv);

      // Wait for any fonts/images to load
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Handle multiple pages if content is too long
      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= 277; // A4 page height in mm minus margins

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= 277;
      }

      const fileName = `${studentName.replace(/[^a-z0-9]/gi, '_')}_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);

      // Remove loading message
      document.body.removeChild(singleLoadingDiv);

      console.log('✅ PDF generated successfully:', fileName);
      alert(`✅ PDF generated successfully for ${studentName}!`);
      
    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      alert('❌ Failed to generate PDF. Please try again.');
      
      // Clean up loading message if it exists
      const singleLoadingDiv = document.getElementById('pdf-loading-single');
      if (singleLoadingDiv && document.body.contains(singleLoadingDiv)) {
        document.body.removeChild(singleLoadingDiv);
      }
    }
  };

  // Generate combined PDF for selected students
  const generateCombinedPDF = async () => {
    if (selectedStudents.length === 0) {
      alert('⚠️ Please select at least one student to generate a combined report');
      return;
    }

    try {
      console.log('📄 Generating combined PDF for', selectedStudents.length, 'students');
      
      // Show loading message
      const combinedLoadingDiv = document.createElement('div');
      combinedLoadingDiv.id = 'pdf-loading-combined';
      combinedLoadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); z-index: 10000; text-align: center;';
      combinedLoadingDiv.innerHTML = `<i class="fa fa-spinner fa-spin" style="font-size: 36px; color: #28a745;"></i><p style="margin-top: 15px; font-size: 16px;">Generating Combined PDF for ${selectedStudents.length} student(s)...</p>`;
      document.body.appendChild(combinedLoadingDiv);

      const combinedPDF = new jsPDF('p', 'mm', 'a4');
      const selectedStudentsData = students.filter(student =>
        selectedStudents.includes(student._id)
      );

      // Calculate class statistics
      const totalStudents = selectedStudentsData.length;
      const averageScore = Math.round(
        selectedStudentsData.reduce((sum, s) => sum + s.score, 0) / totalStudents
      );
      const averagePercentage = Math.round(
        selectedStudentsData.reduce((sum, s) => sum + s.percentage, 0) / totalStudents
      );
      const highestScore = Math.max(...selectedStudentsData.map(s => s.score));
      const lowestScore = Math.min(...selectedStudentsData.map(s => s.score));

      // Add cover page with class summary
      combinedPDF.setFontSize(24);
      combinedPDF.setTextColor(40, 167, 69);
      combinedPDF.text('Class Assignment Report', 105, 40, { align: 'center' });

      combinedPDF.setFontSize(16);
      combinedPDF.setTextColor(0, 0, 0);
      combinedPDF.text(`Assignment: ${assignment?.title || 'N/A'}`, 105, 55, { align: 'center' });
      
      combinedPDF.setFontSize(12);
      combinedPDF.setTextColor(100, 100, 100);
      combinedPDF.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 65, { align: 'center' });

      // Class statistics box
      combinedPDF.setDrawColor(40, 167, 69);
      combinedPDF.setFillColor(248, 249, 250);
      combinedPDF.roundedRect(20, 80, 170, 60, 3, 3, 'FD');

      combinedPDF.setFontSize(14);
      combinedPDF.setTextColor(40, 167, 69);
      combinedPDF.text('Class Statistics', 105, 90, { align: 'center' });

      combinedPDF.setFontSize(11);
      combinedPDF.setTextColor(0, 0, 0);
      combinedPDF.text(`Total Students: ${totalStudents}`, 30, 105);
      combinedPDF.text(`Average Score: ${averageScore}/${assignment?.totalPoints || 'N/A'}`, 30, 115);
      combinedPDF.text(`Average Percentage: ${averagePercentage}%`, 30, 125);
      combinedPDF.text(`Highest Score: ${highestScore}`, 120, 105);
      combinedPDF.text(`Lowest Score: ${lowestScore}`, 120, 115);

      let currentPage = 1;

      // Add individual student pages
      for (let i = 0; i < selectedStudentsData.length; i++) {
        const student = selectedStudentsData[i];
        const studentName = student.userName || 'Unknown Student';
        const gradeLetter = getGradeLetter(student.percentage);

        combinedPDF.addPage();
        currentPage++;

        // Student header
        combinedPDF.setFontSize(18);
        combinedPDF.setTextColor(40, 167, 69);
        combinedPDF.text(`Student: ${studentName}`, 20, 25);

        combinedPDF.setFontSize(11);
        combinedPDF.setTextColor(100, 100, 100);
        combinedPDF.text(`Completed: ${formatDateTime(student.completedAt)}`, 20, 35);
        combinedPDF.text(`Time Spent: ${student.timeSpent || '0:00'}`, 20, 42);

        // Final Mark Box (highlighted)
        combinedPDF.setDrawColor(102, 126, 234);
        combinedPDF.setFillColor(102, 126, 234);
        combinedPDF.roundedRect(20, 50, 170, 35, 3, 3, 'F');

        combinedPDF.setTextColor(255, 255, 255);
        combinedPDF.setFontSize(12);
        combinedPDF.text('FINAL MARK', 105, 60, { align: 'center' });

        combinedPDF.setFontSize(24);
        combinedPDF.text(`${student.score} / ${student.totalPossible}`, 80, 75);

        combinedPDF.setFontSize(20);
        combinedPDF.text(`${student.percentage}%`, 140, 75);

        combinedPDF.setFontSize(18);
        combinedPDF.text(`Grade: ${gradeLetter}`, 165, 75);

        // Details table
        const startY = 95;
        combinedPDF.setFontSize(10);
        combinedPDF.setTextColor(0, 0, 0);

        combinedPDF.setFillColor(248, 249, 250);
        combinedPDF.rect(20, startY, 170, 8, 'F');
        combinedPDF.text('Metric', 25, startY + 6);
        combinedPDF.text('Value', 165, startY + 6, { align: 'right' });

        const results = [
          ['Questions Answered', `${student.answeredQuestions || 0} of ${student.totalQuestions || assignment?.totalQuestions || 'N/A'}`],
          ['Points Earned', student.score.toString()],
          ['Total Possible Points', student.totalPossible.toString()],
          ['Time Duration', student.timeSpent || '0:00'],
          ['Percentage Score', `${student.percentage}%`],
          ['Letter Grade', gradeLetter]
        ];

        let yPos = startY + 8;
        results.forEach(([label, value], index) => {
          if (index % 2 === 0) {
            combinedPDF.setFillColor(245, 245, 245);
            combinedPDF.rect(20, yPos, 170, 8, 'F');
          }
          combinedPDF.text(label, 25, yPos + 6);
          combinedPDF.text(value.toString(), 165, yPos + 6, { align: 'right' });
          yPos += 8;
        });

        // Page footer
        combinedPDF.setFontSize(8);
        combinedPDF.setTextColor(150, 150, 150);
        combinedPDF.text(`Page ${currentPage} of ${selectedStudentsData.length + 1}`, 105, 285, { align: 'center' });
      }

      const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const fileName = `Class_Report_${assignment?.title?.replace(/[^a-z0-9]/gi, '_') || 'Assignment'}_${timestamp}.pdf`;
      combinedPDF.save(fileName);

      // Remove loading message
      if (combinedLoadingDiv && document.body.contains(combinedLoadingDiv)) {
        document.body.removeChild(combinedLoadingDiv);
      }

      console.log('✅ Combined PDF generated successfully:', fileName);
      alert(`✅ Combined PDF generated successfully for ${selectedStudentsData.length} student(s)!`);
      
    } catch (error) {
      console.error('❌ Error generating combined PDF:', error);
      alert('❌ Failed to generate combined PDF. Please try again.');
      
      // Clean up loading message if it exists
      const combinedLoadingDivCleanup = document.getElementById('pdf-loading-combined');
      if (combinedLoadingDivCleanup && document.body.contains(combinedLoadingDivCleanup)) {
        document.body.removeChild(combinedLoadingDivCleanup);
      }
    }
  };

  if (loading) {
    return (
      <div className="teacher-reports-container">
        <nav>
          <div className='nav-container d-flex justify-content-space-between align-items-center'>
            <Link to={'/'}><img src="/logo-Photoroom.png" alt="Logo" /></Link>
            <div className='nav-right-side d-flex align-items-center'>
              <Link to={'/dashboard/teacher'} className="back-btn">
                <i className="fa fa-arrow-left" aria-hidden="true"></i> Back to Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <div className="reports-content">
          <div className="loading-state" style={{ textAlign: 'center', padding: '50px' }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '48px', color: '#28a745', marginBottom: '20px' }}></i>
            <h2>Loading student results...</h2>
            <p>Please wait while we fetch the data</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state with clear instructions
  if (error) {
    return (
      <div className="teacher-reports-container">
        <nav>
          <div className='nav-container d-flex justify-content-space-between align-items-center'>
            <Link to={'/'}><img src="/logo-Photoroom.png" alt="Logo" /></Link>
            <div className='nav-right-side d-flex align-items-center'>
              <Link to={'/dashboard/teacher'} className="back-btn">
                <i className="fa fa-arrow-left" aria-hidden="true"></i> Back to Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <div className="reports-content">
          <div className="error-state" style={{
            maxWidth: '600px',
            margin: '50px auto',
            padding: '30px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <i className="fa fa-exclamation-triangle" style={{
              fontSize: '48px',
              color: '#ff6b6b',
              marginBottom: '20px'
            }}></i>
            <h2 style={{ color: '#856404', marginBottom: '15px' }}>
              {error.type === 'auth' ? '🔒 Authentication Error' : '⚠️ Error Loading Reports'}
            </h2>
            <p style={{ fontSize: '16px', color: '#856404', marginBottom: '10px' }}>
              {error.message}
            </p>
            {error.details && (
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', fontFamily: 'monospace' }}>
                Technical details: {error.details}
              </p>
            )}
            
            {error.type === 'auth' && (
              <div style={{ marginTop: '25px' }}>
                <h3 style={{ color: '#856404', marginBottom: '15px' }}>Quick Fix (30 seconds):</h3>
                <ol style={{ textAlign: 'left', maxWidth: '400px', margin: '0 auto 20px', lineHeight: '1.8' }}>
                  <li>Click the "Logout & Login Again" button below</li>
                  <li>Login again as a <strong>Teacher</strong> (not Student)</li>
                  <li>Try accessing the reports page again</li>
                </ol>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#218838'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#28a745'}
                >
                  <i className="fa fa-sign-out" aria-hidden="true"></i> Logout & Login Again
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                  onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i> Try Again
                </button>
              </div>
            )}
            
            {error.type === 'network' && (
              <div style={{ marginTop: '25px' }}>
                <button 
                  onClick={() => window.location.reload()}
                  style={{
                    padding: '12px 30px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    fontSize: '16px',
                    cursor: 'pointer'
                  }}
                >
                  <i className="fa fa-refresh" aria-hidden="true"></i> Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-reports-container">
      <nav>
        <div className='nav-container d-flex justify-content-space-between align-items-center'>
          <Link to={'/'}><img src="/logo-Photoroom.png" alt="Logo" /></Link>
          <div className='nav-right-side d-flex align-items-center'>
            <Link to={'/dashboard/teacher'} className="back-btn">
              <i className="fa fa-arrow-left" aria-hidden="true"></i> Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <div className="reports-content">
        <div className="reports-header">
          <h1>📊 Student Results: {assignment?.title || 'Loading...'}</h1>
          <p style={{ color: '#666', fontSize: '16px' }}>
            {students.length > 0 
              ? `${students.length} student${students.length !== 1 ? 's' : ''} have completed this assignment` 
              : 'No students have completed this assignment yet'}
          </p>
        </div>

        {students.length > 0 && (
          <div className="bulk-actions">
            <button onClick={selectAllStudents} className="btn-select-all">
              <i className="fa fa-check-square" aria-hidden="true"></i> Select All
            </button>
            <button onClick={deselectAllStudents} className="btn-deselect-all">
              <i className="fa fa-square-o" aria-hidden="true"></i> Deselect All
            </button>
            <button 
              onClick={generateCombinedPDF} 
              className="btn-download-combined"
              disabled={selectedStudents.length === 0}
              style={{ opacity: selectedStudents.length === 0 ? 0.5 : 1 }}
            >
              <i className="fa fa-download" aria-hidden="true"></i> 
              Download Combined PDF ({selectedStudents.length} selected)
            </button>
          </div>
        )}

        <div className="students-list">
          {students.map(student => {
            const studentName = student.userName || 'Unknown Student';
            return (
              <div key={student._id} className="student-card">
                <div className="student-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student._id)}
                    onChange={() => toggleStudentSelection(student._id)}
                  />
                </div>
                <div className="student-info">
                  <h3>{studentName}</h3>
                  <div className="student-stats">
                    <span><strong>Final Mark:</strong> {student.score}/{student.totalPossible}</span>
                    <span><strong>Percentage:</strong> {student.percentage}%</span>
                    <span><strong>Grade:</strong> {getGradeLetter(student.percentage)}</span>
                  </div>
                  <div className="student-stats" style={{ marginTop: '8px' }}>
                    <span><strong>Time:</strong> {student.timeSpent || '0:00'}</span>
                    <span><strong>Questions:</strong> {student.answeredQuestions || 0} of {student.totalQuestions || assignment?.totalQuestions || 'N/A'}</span>
                  </div>
                  <div className="completion-date" style={{ marginTop: '8px' }}>
                    ✓ Completed: {formatDateTime(student.completedAt)}
                  </div>
                </div>
                <div className="student-actions">
                  <button onClick={() => generateStudentPDF(student)} className="btn-download-single">
                    <i className="fa fa-download" aria-hidden="true"></i> Individual PDF
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {students.length === 0 && (
          <div className="no-results" style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            margin: '30px 0'
          }}>
            <i className="fa fa-inbox" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No Completed Assignments Yet</h3>
            <p style={{ color: '#999', fontSize: '16px' }}>Students who complete this assignment will appear here.</p>
            <p style={{ color: '#999', fontSize: '14px', marginTop: '20px' }}>
              Make sure students have:<br/>
              • Started the assignment<br/>
              • Answered at least one question<br/>
              • Submitted their answers
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TeacherAssignmentReports;
