// import React, { useEffect, useState } from 'react';
// import { collection, getDocs } from 'firebase/firestore';
// import { db } from './firebase';
// import { Bar } from 'react-chartjs-2';
// import 'chart.js/auto';
// import './ChartComponent.css';

// const ChartComponent = () => {
//   const [bookingData, setBookingData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchBookingData = async () => {
//       try {
//         setLoading(true);
//         const querySnapshot = await getDocs(collection(db, 'bookings'));
//         const bookings = querySnapshot.docs.map(doc => doc.data());
//         setBookingData(bookings);
//       } catch (error) {
//         console.error('Error fetching booking data: ', error);
//         setError('Failed to load booking data.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookingData();
//   }, []);

//   // Prepare data for the chart
//   const prepareChartData = () => {
//     const dates = [];
//     const classroomCounts = {};

//     // Group bookings by date and classroom
//     bookingData.forEach((booking) => {
//       const date = booking.date;
//       const classroom = booking.classroom;

//       if (!dates.includes(date)) {
//         dates.push(date);
//       }

//       if (!classroomCounts[date]) {
//         classroomCounts[date] = {};
//       }

//       if (!classroomCounts[date][classroom]) {
//         classroomCounts[date][classroom] = 0;
//       }

//       classroomCounts[date][classroom] += 1;
//     });

//     return {
//       labels: dates,
//       datasets: Object.keys(classroomCounts[dates[0]] || {}).map((classroom) => ({
//         label: `Classroom ${classroom}`,
//         data: dates.map((date) => classroomCounts[date][classroom] || 0),
//         backgroundColor: getRandomColor(),
//       })),
//     };
//   };

//   const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };

//   if (loading) {
//     return <div>Loading data...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   return (
//     <div className="chart-container">
//       <h3>Classroom Bookings Per Day</h3>
//       <Bar data={prepareChartData()} />
//     </div>
//   );
// };

// export default ChartComponent;
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import './ChartComponent.css'; // Add styling

const ChartComponent = () => {
  const [bookingData, setBookingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(collection(db, 'bookings'));
        const bookings = querySnapshot.docs.map(doc => doc.data());
        setBookingData(bookings);
      } catch (error) {
        console.error('Error fetching booking data: ', error);
        setError('Failed to load booking data.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  const prepareChartData = () => {
    const classroomCounts = {};
    
    bookingData.forEach((booking) => {
      const classroom = booking.classroom;
      
      // Count bookings per classroom
      if (!classroomCounts[classroom]) {
        classroomCounts[classroom] = 0;
      }
      classroomCounts[classroom] += 1;
    });

    const classrooms = Object.keys(classroomCounts);
    const counts = Object.values(classroomCounts);

    return {
      labels: classrooms,
      datasets: [
        {
          data: counts,
          backgroundColor: classrooms.map(() => getRandomColor()),
          hoverOffset: 4,
        },
      ],
    };
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="chart-container">
      <h3>Classroom Bookings</h3>
      <Pie data={prepareChartData()} />
    </div>
  );
};

export default ChartComponent;

