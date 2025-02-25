
import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Importing the calendar library
import 'react-calendar/dist/Calendar.css'; // Importing default styles for the calendar
import './CalendarComponent.css'; // Import your custom CSS styles

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

  // Festival Dates
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
  { date: new Date(2024, 9, 31), event: 'Diwali', type: 'festival' },
  { date: new Date(2024, 11, 25), event: 'Christmas', type: 'festival' }
];

// Function to generate all Sundays in a year
const generateSundays = (year) => {
  let sundays = [];
  for (let month = 0; month < 12; month++) {
    const date = new Date(year, month, 1);
    while (date.getDay() !== 0) { // Get to the first Sunday
      date.setDate(date.getDate() + 1);
    }
    while (date.getMonth() === month) {
      sundays.push(new Date(date));
      date.setDate(date.getDate() + 7); // Add one week
    }
  }
  return sundays;
};

// Function to generate second Saturdays of each month
const generateSecondSaturdays = (year) => {
  let secondSaturdays = [];
  for (let month = 0; month < 12; month++) {
    const secondSaturday = new Date(year, month, 8);
    while (secondSaturday.getDay() !== 6) { // Get to the second Saturday
      secondSaturday.setDate(secondSaturday.getDate() + 1);
    }
    secondSaturdays.push(secondSaturday);
  }
  return secondSaturdays;
};

// Add Sundays and second Saturdays to academic events
const sundays = generateSundays(2024).map(sunday => ({ date: sunday, event: '', type: 'holiday' }));
const secondSaturdays = generateSecondSaturdays(2024).map(saturday => ({ date: saturday, event: 'Second Saturday', type: 'holiday' }));

const allEvents = [...academicEvents, ...sundays, ...secondSaturdays];

const CalendarComponent = () => {
  const [date, setDate] = useState(new Date());

  // This function checks if a date has an event
  const findEvent = (date) => {
    return allEvents.find(event =>
      event.date.getFullYear() === date.getFullYear() &&
      event.date.getMonth() === date.getMonth() &&
      event.date.getDate() === date.getDate()
    );
  };

  return (
    <div className="calendar-container" style={{ padding: '20px' }}><br/><br/>
      <center><h2>Academic Calendar</h2></center>
      <Calendar
        onChange={setDate}
        value={date}
        tileContent={({ date, view }) => {
          const event = findEvent(date);
          return view === 'month' && event ? (
            <p className={event.type} style={{ fontSize: '10px' }}>{event.event}</p>
          ) : null;
        }}
        tileClassName={({ date, view }) => {
          const event = findEvent(date);
          return event ? 'highlight' : ''; // Add 'highlight' class if date has an event
        }}
      />
      <div className="date-details">
        <p>Selected Date: {date.toDateString()}</p>
        {findEvent(date) ? (
          <p><strong>Event:</strong> {findEvent(date).event}</p>
        ) : (
          <p>No Events on this date.</p>
        )}
      </div>
    </div>
  );
};

// Export allEvents
export const allEventsData = allEvents; // Export the allEvents array
export default CalendarComponent;













