// import React, { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
// import { auth, db } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { Form, Button, Container, Row, Col, Alert,Spinner } from 'react-bootstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';

// import './BookingForm.css';

// const BookingForm = () => {
//   const location = useLocation();
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     year:'',
//     section:'',
//     subject: '',
//     facultyName: '',
//     startTime: '',
//     endTime: '',
//     date: '',
//     studentsStrength: '',
//     description: '',
//     classroom: ''
//   });
//   const [user, setUser] = useState(null);
//   const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setUser(user);
//       } else {
//         navigate(''); // Redirect to sign-in page if not authenticated
//       }
//     });

//     return () => unsubscribe();
//   }, [navigate]);

//   useEffect(() => {
//     if (location.state && location.state.classroomName) {
//       setFormData((prevData) => ({
//         ...prevData,
//         classroom: location.state.classroomName
//       }));
//     }
//   }, [location.state]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (validateForm()) {
//       setLoading(true); // Set loading to true when starting the submission process
//       try {
//         // Check if the classroom is already booked
//         const bookingsQuery = query(
//           collection(db, 'bookings'),
//           where('classroom', '==', formData.classroom),
//           where('date', '==', formData.date),
//           where('startTime', '==', formData.startTime),
//           where('endTime', '==', formData.endTime)
//         );
//         const querySnapshot = await getDocs(bookingsQuery);
//         if (!querySnapshot.empty) {
//           setAlert({ show: true, message: 'This classroom is already booked for the selected date and time.', variant: 'danger' });
//           setLoading(false); // Set loading to false if booking is already taken
//           return;
//         }

//         await addDoc(collection(db, 'bookings'), { ...formData, userId: user.uid });
//         setAlert({ show: true, message: 'your classroom is successfully booked!', variant: 'success' });
//         setLoading(false); // Set loading to false after successful booking
//         setTimeout(() => {
//           navigate('/');
//         }, 2000);
//       } catch (error) {
//         console.error('Error adding document: ', error);
//         setAlert({ show: true, message: 'Error adding document.', variant: 'danger' });
//         setLoading(false); // Set loading to false if there's an error
//       }
//     }
//   };

//   const validateForm = () => {
//     const { name, email, facultyName, date, startTime, endTime, studentsStrength } = formData;
//     const nameRegex = /^[A-Za-z\s]+$/;
//     const emailRegex = /^[r][0-9]{2}[0-9]{4}@rguktrkv\.ac\.in$/; // Updated email regex
//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     const timeRegex = /^(0[6-9]|1[0-1]):[0-5][0-9] [AP]M$/;
//     const isNameValid = name.trim() !== '' && name.match(nameRegex);
//     const isFacultyNameValid = facultyName.trim() !== '' && facultyName.match(nameRegex);
//     const isEmailValid = email.trim() !== '' && email.match(emailRegex);
//     const isDateValid = date.trim() !== '' && date.match(dateRegex);
//     const isStartTimeValid = startTime.trim() !== '' && startTime.match(timeRegex);
//     const isEndTimeValid = endTime.trim() !== '' && endTime.match(timeRegex);
//     const isTimeInRange = isStartTimeValid && isEndTimeValid && isTimeWithinRange(startTime, endTime);
//     const isStudentsStrengthValid = studentsStrength.trim() !== '' && !isNaN(studentsStrength);

//     const isSunday = new Date(date).getDay() === 0; // Check if the date is Sunday

//     if (isSunday) {
//       setAlert({ show: true, message: 'Classroom cannot be booked on Sundays.', variant: 'danger' });
//       return false;
//     }
//     if (!isNameValid) {
//       setAlert({ show: true, message: 'Name should not be empty and should only contain letters.', variant: 'danger' });
//       return false;
//     }
//     if (!isFacultyNameValid) {
//       setAlert({ show: true, message: 'Faculty name should not be empty and should only contain letters.', variant: 'danger' });
//       return false;
//     }
//     if (!isEmailValid) {
//       setAlert({ show: true, message: 'The email should start with r and end with @rguktrkv.ac.in', variant: 'danger' });
//       return false;
//     }
//     if (!isDateValid) {
//       setAlert({ show: true, message: 'Please enter a valid date in the format YYYY-MM-DD.', variant: 'danger' });
//       return false;
//     }
//     if (!isTimeInRange) {
//       setAlert({ show: true, message: 'The class can only be booked between 6:00 AM and 11:00 PM and for a maximum of 2 hours.', variant: 'danger' });
//       return false;
//     }
//     if (!isStudentsStrengthValid) {
//       setAlert({ show: true, message: 'Student strength should be a positive number.', variant: 'danger' });
//       return false;
//     }

//     const studentsStrengthValue = parseInt(studentsStrength);
//     if (studentsStrengthValue > 180) {
//       setAlert({ show: true, message: 'Student strength exceeds 180. Please choose the big seminar hall.', variant: 'danger' });
//       return false;
//     }
//     if (studentsStrengthValue > 90 && studentsStrengthValue <= 120) {
//       setAlert({ show: true, message: 'For student strength between 90 and 120, please choose G9 or G10 classes for booking.', variant: 'info' });
//     } else if (studentsStrengthValue <= 90) {
//       setAlert({ show: true, message: 'For student strength 90 or below, please choose classrooms on the ground floor, right-hand side.', variant: 'info' });
//     }

//     return true;
//   };

//   const isTimeWithinRange = (startTime, endTime) => {
//     const validTimeSlots = [
//       ['07:00 AM', '08:00 AM'], ['08:00 AM', '09:00 AM'], ['09:00 AM', '10:00 AM'], ['10:00 AM', '11:00 AM'],
//       ['11:00 AM', '12:00 PM'], ['12:00 PM', '01:00 PM'], ['01:00 PM', '02:00 PM'], ['02:00 PM', '03:00 PM'],
//       ['03:00 PM', '04:00 PM'], ['04:00 PM', '05:00 PM'], ['05:00 PM', '06:00 PM'], ['06:00 PM', '07:00 PM'],
//       ['07:00 PM', '08:00 PM'], ['08:00 PM', '09:00 PM'], ['09:00 PM', '10:00 PM'], ['10:00 PM', '11:00 PM'],
//       ['07:00 AM', '09:00 AM'], ['09:00 AM', '11:00 AM'], ['11:00 AM', '12:00 PM'], ['12:00 PM', '02:00 PM'],
//       ['02:00 PM', '04:00 PM'], ['04:00 PM', '06:00 PM'], ['06:00 PM', '08:00 PM'], ['08:00 PM', '10:00 PM']
//     ];
//     const convertTo24HourFormat = (time) => {
//       const [hours, minutesPart] = time.split(':');
//       const [minutes, amPm] = minutesPart.split(' ');
//       let hoursInt = parseInt(hours.replace(/^0/, '')); // Remove leading zero and convert to int
//       if (amPm === 'PM' && hoursInt !== 12) {
//         hoursInt += 12;
//       } else if (amPm === 'AM' && hoursInt === 12) {
//         hoursInt = 0;
//       }
//       return `${hoursInt.toString().padStart(2, '0')}:${minutes}`;
//     };
  
    
  
//     // Check if start time is between 6:00 AM (360 minutes) and 11:00 PM (1380 minutes),
//     // and end time is between 6:00 AM (360 minutes) and 11:00 PM (1380 minutes).
//     const start24Hour = convertTo24HourFormat(startTime);
//     const end24Hour = convertTo24HourFormat(endTime);
//     const isValidTimeSlot = validTimeSlots.some(([validStart, validEnd]) => {
//       const validStart24Hour = convertTo24HourFormat(validStart);
//       const validEnd24Hour = convertTo24HourFormat(validEnd);
//       return start24Hour === validStart24Hour && end24Hour === validEnd24Hour;
//     });

//     return isValidTimeSlot;
//   };
  

//   const handleCancel = () => {
//     navigate('/');
//   };
//   const handleReset = () => {
//     setFormData({
//       name: '',
//       email: '',
//       year:'',
//       section:'',
//       subject: '',
//       facultyName: '',
//       startTime: '',
//       endTime: '',
//       date: '',
//       studentsStrength: '',
//       description: '',
//       classroom: ''
//     });
//   };

//   return (
//     <Container className="booking-container">
//       {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
//       <div className="booking-form-container">
//         <Form className="booking-form" onSubmit={handleSubmit}>
//           <center><h2>Booking Form</h2></center>
//           <Form.Group as={Row} controlId="formClassroom">
//             <Form.Label column sm="4">Classroom:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="classroom" value={formData.classroom} onChange={handleChange} readOnly />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formName">
//             <Form.Label column sm="4">Name:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}  placeholder='username' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formEmail">
//             <Form.Label column sm="4">Email:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}  placeholder='example@gmail.com' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formYear">
//             <Form.Label column sm="4">Year:</Form.Label>
//             <Col sm="8">
//               <Form.Control as="select" name="year" value={formData.year} onChange={handleChange} required>
//                 <option value="">Select Year</option>
//                 <option value="e1">E1</option>
//                 <option value="e2">E2</option>
//                 <option value="e3">E3</option>
//                 <option value="e4">E4</option>
//               </Form.Control>
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formName">
//             <Form.Label column sm="4">Section:</Form.Label>
//             <Col sm="8">
//               <Form.Control as="select" name="section" value={formData.section} onChange={handleChange} required>
//                 <option value="">Select selection</option>
//                 <option value="A">A</option>
//                 <option value="B">B</option>
//                 <option value="C">C</option>
//                 <option value="D">D</option>
//               </Form.Control>
//             </Col>
//           </Form.Group>
        
//           <Form.Group as={Row} controlId="formSubject">
//             <Form.Label column sm="4">Subject:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange}  placeholder='DBMS' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formFacultyName">
//             <Form.Label column sm="4">Faculty Name:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="facultyName" value={formData.facultyName} onChange={handleChange}  placeholder='faculty name' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formStartTime">
//             <Form.Label column sm="4">Start Time:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="startTime" value={formData.startTime} onChange={handleChange}  placeholder='start time' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formEndTime">
//             <Form.Label column sm="4">End Time:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="endTime" value={formData.endTime} onChange={handleChange}  placeholder='endtime' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formDate">
//             <Form.Label column sm="4">Date:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="date" name="date" value={formData.date} onChange={handleChange}  placeholder='seletct date ' required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formStudentsStrength">
//             <Form.Label column sm="4">Student Strength:</Form.Label>
//             <Col sm="8">
//               <Form.Control type="text" name="studentsStrength" value={formData.studentsStrength}  placeholder='enter student strength correctly' onChange={handleChange} required />
//             </Col>
//           </Form.Group>
//           <Form.Group as={Row} controlId="formDescription">
//             <Form.Label column sm="4">Description:</Form.Label>
//             <Col sm="8">
//               <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} placeholder='enter valid description ' required />
//             </Col>
//           </Form.Group>
//           <center>
//           <Button variant="warning" onClick={handleReset} className="ml-2">
//           Reset
//         </Button>
//         <Button variant="primary" type="submit" disabled={loading}>
//             {loading ? <Spinner animation="border" size="sm" /> : 'Book Now'}
//           </Button>
//             <Button className="cancel-button" variant="secondary" onClick={handleCancel}>
//               Cancel
//             </Button>
//           </center>
//         </Form>
//         <div className="booking-image">
//           <img src="https://cdn-icons-png.flaticon.com/512/1486/1486433.png" alt="Classroom" />
//         </div>
//       </div>
//     </Container>
//   );
// };

// export default BookingForm;


import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookingForm.css';

const BookingForm = () => {
  const location = useLocation();

  const seniorFacultyNames = ['Ratna kumari', 'Ravi kumar', 'Satyanandaram', 'Vinod Kumar', 'Santosh Kumar' , 'Muni Babu'];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    year: '',
    section: '',
    subject: '',
    facultyName: '',
    startTime: '',
    endTime: '',
    date: '',
    studentsStrength: '',
    purpose: '',
    classroom: ''
  });
  const academicEvents = [
  { date: new Date(2024, 0, 19), event: 'Commencement of Classes', type: 'holiday' },
  { date: new Date(2024, 1, 3), event: 'AT-I', type: 'mid-date' },
  { date: new Date(2024, 1, 5), event: 'AT-I', type: 'mid-date' },
  { date: new Date(2024, 1, 19), event: 'Mid Test-I', type: 'mid-date' },
  { date: new Date(2024, 1, 24), event: 'Mid Test-I Ends', type: 'mid-date' },
  { date: new Date(2024, 2, 16), event: 'AT-II', type: 'mid-date' },
  { date: new Date(2024, 2, 22), event: 'AT-II', type: 'mid-date' },
  { date: new Date(2024, 2, 23), event: 'AT-II', type: 'mid-date' },
  { date: new Date(2024, 3, 1), event: 'Mid Test-II', type: 'mid-date' },
  { date: new Date(2024, 3, 6), event: 'Mid Test-II Ends', type: 'mid-date' },
  { date: new Date(2024, 3, 26), event: 'AT-IV', type: 'mid-date' },
  { date: new Date(2024, 3, 27), event: 'AT-IV', type: 'mid-date' },
  { date: new Date(2024, 4, 6), event: 'Mid Test-III', type: 'mid-date' },
  { date: new Date(2024, 4, 11), event: 'Mid Test-III Ends', type: 'mid-date' },
  { date: new Date(2024, 4, 10), event: 'Instruction Closing Day', type: 'holiday' },
  { date: new Date(2024, 4, 24), event: 'Start of Summer Internship', type: 'holiday' },
  { date: new Date(2024, 5, 13), event: 'End of Summer Internship', type: 'holiday' },
  { date: new Date(2024, 5, 24), event: 'EST Exams', type: 'mid-date' },
  { date: new Date(2024, 6, 6), event: 'End of EST Exams', type: 'mid-date' },
  { date: new Date(2024, 0, 14), event: 'Makar Sankranti', type: 'festival' },
  { date: new Date(2024, 1, 14), event: 'Maha Shivaratri', type: 'festival' },
  { date: new Date(2024, 2, 10), event: 'Holi', type: 'festival' },
  { date: new Date(2024, 2, 25), event: 'Good Friday', type: 'festival' },
  { date: new Date(2024, 3, 10), event: 'Ugadi', type: 'festival' },
  { date: new Date(2024, 3, 14), event: 'Ambedkar Jayanti', type: 'festival' },
  { date: new Date(2024, 4, 1), event: 'May Day', type: 'festival' },
  { date: new Date(2024, 7, 15), event: 'Independence Day', type: 'festival' },
  { date: new Date(2024, 8, 5), event: 'Ganesh Chaturthi', type: 'festival' },
  { date: new Date(2024, 9, 2), event: 'Gandhi Jayanti', type: 'festival' },
  { date: new Date(2024, 10, 1), event: 'Diwali', type: 'festival' },
  { date: new Date(2024, 11, 25), event: 'Christmas', type: 'festival' }
];
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        // Ensure the email is set once the user is authenticated
        setFormData((prevData) => ({
          ...prevData,
          email: user.email || '' // Set email if user is authenticated
        }));
      } else {
        navigate('/signin');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.state && location.state.classroomName) {
      setFormData((prevData) => ({
        ...prevData,
        classroom: location.state.classroomName
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      try {
        const bookingsQuery = query(
          collection(db, 'bookings'),
          where('classroom', '==', formData.classroom),
          where('date', '==', formData.date),
          where('startTime', '==', formData.startTime),
          where('endTime', '==', formData.endTime)
        );
        const querySnapshot = await getDocs(bookingsQuery);
        if (!querySnapshot.empty) {
          setAlert({ show: true, message: 'This classroom is already booked for the selected date and time.', variant: 'danger' });
          setLoading(false);
          return;
        }
	await addDoc(collection(db, 'bookings'), {
        ...formData,
        userId: user.uid,
        // Add any additional flags if required (e.g., for senior faculty priority)
        isSeniorFaculty: seniorFacultyNames.includes(formData.facultyName), // Adding a flag for senior faculty
      });

        await addDoc(collection(db, 'bookings'), { ...formData, userId: user.uid });
        setAlert({ show: true, message: 'Your classroom is successfully booked!', variant: 'success' });
        setLoading(false);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (error) {
        console.error('Error adding document: ', error);
        setAlert({ show: true, message: 'Error adding document.', variant: 'danger' });
        setLoading(false);
      }
    }
  };

  const validateForm = () => {
    const {  facultyName, purpose,date } = formData;
    const selectedDate = new Date(date);
    const isEventDate = isAcademicEvent(selectedDate);
    const today = new Date();

    if (selectedDate < today.setDate(today.getDate() + 1)) {
      setAlert({ show: true, message: 'Date cannot be in the past or today.', variant: 'danger' });
      return false;
    }

    if (isEventDate) {
      setAlert({ show: true, message: `${isEventDate.event} is a holiday. Classroom cannot be booked.`, variant: 'danger' });
      return false;
    }

    const isSeniorFaculty = seniorFacultyNames.includes(facultyName);

  if (isSeniorFaculty) {
    setAlert({
      show: true,
      message: 'This booking has been given priority as it is for Senior Faculty.',
      variant: 'success', // Green success message for senior faculty priority
    });
  }

  // Special case for Exam booking prioritization
  const isExamBooking = purpose === 'Exam';
  if (isExamBooking) {
    setAlert({
      show: true,
      message: 'This booking has been given priority due to the Exam purpose.',
      variant: 'success',
    });
  }

  // If either senior faculty or exam is detected, we proceed.
  return true;
};


  const isAcademicEvent = (selectedDate) => {
    const isSunday = selectedDate.getDay() === 0;
    const isSecondSaturday = selectedDate.getDay() === 6 && Math.ceil(selectedDate.getDate() / 7) === 2;

    if (isSunday || isSecondSaturday) {
      return { event: isSunday ? 'Sunday' : 'Second Saturday', type: 'holiday' };
    }

    return academicEvents.find(
      (event) =>
        event.date.toDateString() === selectedDate.toDateString() &&
        (event.type === 'holiday' || event.type === 'festival')
    );
  };

  const handleCancel = () => {
    navigate('/');
  };
  
  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      year: '',
      section: '',
      subject: '',
      facultyName: '',
      startTime: '',
      endTime: '',
      date: '',
      studentsStrength: '',
      description: '',
      classroom: ''
    });
  };
  return (
    <Container className="booking-container">
      <div className="booking-form-container">
        <Form onSubmit={handleSubmit}>
          <center><h2>Booking Form</h2></center>
          <Form.Group as={Row} controlId="formClassroom">
            <Form.Label column sm="4">Classroom:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="classroom" value={formData.classroom} onChange={handleChange} readOnly />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formName">
            <Form.Label column sm="4">Name:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange}  placeholder='username' required />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formEmail">
            <Form.Label column sm="4">Email:</Form.Label>
            <Col sm="8">
              <Form.Control type="email" name="email" value={formData.email} onChange={handleChange}  placeholder='example@gmail.com' readOnly />
            </Col>
          </Form.Group>

	  <Form.Group as={Row} controlId="formYear">
  	    <Form.Label column sm="4">Year:</Form.Label>
 	    <Col sm="8">
    		<Form.Control as="select" name="year" value={formData.year} onChange={handleChange} required>
     			<option value="E1">E1</option>
      			<option value="E2">E2</option>
      			<option value="E3">E3</option>
      			<option value="E4">E4</option>
    		</Form.Control>
  	   </Col>
	 </Form.Group>


          <Form.Group as={Row} controlId="formName">
            <Form.Label column sm="4">Section:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="section" value={formData.section} onChange={handleChange}  placeholder='enter section name' required />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formSubject">
            <Form.Label column sm="4">Subject:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="subject" value={formData.subject} onChange={handleChange}  placeholder='DBMS' required />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formFacultyName">
            <Form.Label column sm="4">Faculty Name:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="facultyName" value={formData.facultyName} onChange={handleChange}  placeholder='faculty name' required />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formStartTime">
            <Form.Label column sm="4">Start Time:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="startTime" value={formData.startTime} onChange={handleChange}  placeholder='start time' required />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formEndTime">
            <Form.Label column sm="4">End Time:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="endTime" value={formData.endTime} onChange={handleChange}  placeholder='endtime' required />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formDate">
  	    <Form.Label column sm="4">Date:</Form.Label>
  	    <Col sm="8">
  	      <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} min={new Date().toISOString().split('T')[0]} 
      		placeholder='Select date' required />
 	    </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formStudentsStrength">
            <Form.Label column sm="4">Student Strength:</Form.Label>
            <Col sm="8">
              <Form.Control type="text" name="studentsStrength" value={formData.studentsStrength}  placeholder='enter student strength correctly' onChange={handleChange} required />
            </Col>
          </Form.Group>

          <Form.Group as={Row} controlId="formPurpose">
            <Form.Label column sm="4">Purpose:</Form.Label>
            <Col sm="8">
              <Form.Control as="select" name="purpose" value={formData.purpose} onChange={handleChange} required>
                <option value="">Select Purpose</option>
                <option value="Class">Class</option>
                <option value="Exam">Exam</option>
                <option value="Meeting">Meeting</option>
              </Form.Control>
            </Col>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
          </Button>
          <Button variant="secondary" onClick={handleReset} disabled={loading} className="ml-2">
            Reset
          </Button>
          <Button variant="danger" onClick={handleCancel} className="ml-2">
            Cancel
          </Button>
        </Form>
	{alert.show && (
  <div
    className={`alert-notification ${alert.variant === 'success' ? 'success' : ''}`}
  >
    {alert.message}
  </div>
)}


	
	<div className="booking-image">
          <img src="https://cdn-icons-png.flaticon.com/512/1486/1486433.png" alt="Classroom" />
        </div>
      </div>
    </Container>
  );
};

export default BookingForm;


