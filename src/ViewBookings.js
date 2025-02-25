

// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
// import { db } from './firebase';
// import './ViewBooking.css'; // Styling

// const ViewBookings = () => {
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         const querySnapshot = await getDocs(collection(db, 'bookings'));
//         const bookingsList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setBookings(bookingsList);
//       } catch (error) {
//         console.error('Error fetching bookings: ', error);
//         setError('Failed to fetch bookings. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   const handleDelete = async (id) => {
//     try {
//       await deleteDoc(doc(db, 'bookings', id));
//       setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== id));
//       alert('Booking successfully deleted!');
//     } catch (error) {
//       console.error('Error deleting booking: ', error);
//       alert('Failed to delete booking. Please try again.');
//     }
//   };

//   if (loading) {
//     return <div>Loading data...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="bookings-container">
//       <center><h2>Classroom Bookings Details</h2></center>

//       {/* ChartComponent displays the bookings graph */}
//       {/* <ChartComponent /> */}

//       <table className="bookings-table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Year</th> {/* New Year column */}
//             <th>Section</th>
//             <th>Subject</th>
//             <th>Faculty Name</th>
//             <th>Date</th>
//             <th>Start Time</th>
//             <th>End Time</th>
//             <th>Classroom</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {bookings.map((booking) => (
//             <tr key={booking.id}>
//               <td>{booking.name}</td>
//               <td>{booking.email}</td>
//               <td>{booking.year}</td>
//               <td>{booking.section}</td>
//               <td>{booking.subject}</td>
//               <td>{booking.facultyName}</td>
//               <td>{booking.date}</td>
//               <td>{booking.startTime}</td>
//               <td>{booking.endTime}</td>
//               <td>{booking.classroom}</td>
//               <td>
//                 <button className="delete-button" onClick={() => handleDelete(booking.id)}>Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewBookings;



import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Import your firebase configuration
import { Table, Container, ButtonGroup, ToggleButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredYear, setFilteredYear] = useState('All'); // State to track the selected year filter
  const [loading, setLoading] = useState(true);

  // Fetch bookings data from Firestore on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Filtered bookings based on the selected year
  const getFilteredBookings = () => {
    if (filteredYear === 'All') return bookings;
    return bookings.filter((booking) => booking.year === filteredYear);
  };

  return (
    <Container>
      <h2 className="my-4 text-center">View Bookings</h2>

      {/* Filter Buttons */}
      <div className="filter-buttons text-center mb-4">
        <ButtonGroup>
          {['All', 'E1', 'E2', 'E3', 'E4'].map((year) => (
            <ToggleButton
              key={year}
              type="radio"
              variant="outline-primary"
              value={year}
              checked={filteredYear === year}
              onClick={() => setFilteredYear(year)}
            >
              {year}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>

      {loading ? (
        <div className="text-center">
          <span className="spinner-border spinner-border-lg" role="status" aria-hidden="true"></span>
          <p>Loading bookings...</p>
        </div>
      ) : getFilteredBookings().length > 0 ? (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Year</th>
              <th>Section</th>
              <th>Subject</th>
              <th>Faculty Name</th>
              <th>Booking Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Classroom</th>
              <th>Student Strength</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredBookings().map((booking) => (
              <tr key={booking.id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.year}</td>
                <td>{booking.section}</td>
                <td>{booking.subject}</td>
                <td>{booking.facultyName}</td>
                <td>{booking.date}</td>
                <td>{booking.startTime}</td>
                <td>{booking.endTime}</td>
                <td>{booking.classroom}</td>
                <td>{booking.studentsStrength}</td>
                <td>{booking.purpose}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-center">No bookings found.</p>
      )}
    </Container>
  );
};

export default ViewBookings;


