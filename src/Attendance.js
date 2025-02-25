import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, query, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Form, Button, Container, Row, Col, Alert, Spinner, Table, ToggleButton, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './Attendance.css';

const Attendance = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    year: 'E1',
    roomName: '',
    section: '',
    roomCapacity: '',
    actualAttendance: '',
  });
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [loading, setLoading] = useState(false);
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredYear, setFilteredYear] = useState('All');
  const [filteredSection, setFilteredSection] = useState('All'); // New filter for sections
  const [editingRecord, setEditingRecord] = useState(null); // Track record being edited
  const navigate = useNavigate();

  // Check for authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        navigate('/signin');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Fetch attendance records from Firestore
  useEffect(() => {
    const q = query(collection(db, 'attendance'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const records = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendanceList(records);
    });

    return () => unsubscribe();
  }, []);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingRecord) {
        // Update existing record
        await updateDoc(doc(db, 'attendance', editingRecord), formData);
        setAlert({ show: true, message: 'Attendance successfully updated!', variant: 'success' });
      } else {
        // Add new record
        await addDoc(collection(db, 'attendance'), {
          ...formData,
          userId: user.uid,
          timestamp: new Date(),
        });
        setAlert({ show: true, message: 'Attendance successfully recorded!', variant: 'success' });
      }
      setLoading(false);
      setFormData({ studentId: '', year: 'E1', roomName: '', section: '', roomCapacity: '', actualAttendance: '' });
      setEditingRecord(null);
    } catch (error) {
      console.error('Error saving document: ', error);
      setAlert({ show: true, message: 'Error saving attendance. Please try again.', variant: 'danger' });
      setLoading(false);
    }
  };

  // Handle delete record
  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'attendance', id));
      setAlert({ show: true, message: 'Attendance record deleted!', variant: 'success' });
    } catch (error) {
      console.error('Error deleting document: ', error);
      setAlert({ show: true, message: 'Error deleting record. Please try again.', variant: 'danger' });
    }
  };

  // Handle edit record
  const handleEdit = (record) => {
    setFormData(record);
    setEditingRecord(record.id);
  };

  // Filter records by year and section
  const getFilteredRecords = () => {
    let filteredRecords = attendanceList;
    if (filteredYear !== 'All') {
      filteredRecords = filteredRecords.filter((record) => record.year === filteredYear);
    }
    if (filteredSection !== 'All') {
      filteredRecords = filteredRecords.filter((record) => record.section === filteredSection);
    }
    return filteredRecords;
  };

  // Calculate overall attendance percentage for the filtered records
  const calculatePercentage = () => {
    const records = getFilteredRecords();
    if (records.length === 0) return '0%';
    const totalCapacity = records.reduce((acc, record) => acc + parseInt(record.roomCapacity || 0), 0);
    const totalAttendance = records.reduce((acc, record) => acc + parseInt(record.actualAttendance || 0), 0);
    return ((totalAttendance / totalCapacity) * 100).toFixed(2) + '%';
  };

  // Generate unique section options for the filter
  const getSectionOptions = () => {
    const sections = attendanceList.map((record) => record.section);
    return Array.from(new Set(sections)).filter(Boolean);
  };

  return (
    <Container className="attendance-container">
      {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
      {/* Attendance Form */}
      <div className="attendance-form-container">
        <Form className="attendance-form" onSubmit={handleSubmit}>
          <center><h2>{editingRecord ? 'Edit Attendance' : 'Attendance Form'}</h2></center>
          <Form.Group as={Row} controlId="formStudentId">
            <Form.Label column sm="4">Student ID:</Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Enter student ID"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formYear">
            <Form.Label column sm="4">Year:</Form.Label>
            <Col sm="8">
              <Form.Control
                as="select"
                name="year"
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="E1">E1</option>
                <option value="E2">E2</option>
                <option value="E3">E3</option>
                <option value="E4">E4</option>
              </Form.Control>
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formRoomName">
            <Form.Label column sm="4">Room Name:</Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                name="roomName"
                value={formData.roomName}
                onChange={handleChange}
                placeholder="Enter room name"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formSection">
            <Form.Label column sm="4">Section:</Form.Label>
            <Col sm="8">
              <Form.Control
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="Enter section"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formRoomCapacity">
            <Form.Label column sm="4">Room Capacity:</Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                name="roomCapacity"
                value={formData.roomCapacity}
                onChange={handleChange}
                placeholder="Enter room capacity"
                required
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} controlId="formActualAttendance">
            <Form.Label column sm="4">Actual Attendance:</Form.Label>
            <Col sm="8">
              <Form.Control
                type="number"
                name="actualAttendance"
                value={formData.actualAttendance}
                onChange={handleChange}
                placeholder="Enter actual attendance"
                required
              />
            </Col>
          </Form.Group>
          <center>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : (editingRecord ? 'Update Attendance' : 'Submit Attendance')}
            </Button>
            <Button className="cancel-button" variant="secondary" onClick={() => setEditingRecord(null)}>
              Cancel
            </Button>
          </center>
        </Form>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
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

      {/* Section Filter */}
      <div className="section-filter">
        <Form.Group as={Row}>
          <Form.Label column sm="2">Filter by Section:</Form.Label>
          <Col sm="4">
            <Form.Control
              as="select"
              value={filteredSection}
              onChange={(e) => setFilteredSection(e.target.value)}
            >
              <option value="All">All</option>
              {getSectionOptions().map((section) => (
                <option key={section} value={section}>{section}</option>
              ))}
            </Form.Control>
          </Col>
        </Form.Group>
      </div>

      {/* Overall Class Percentage */}
      <div className="class-percentage">
        <h5>Overall Class Attendance Percentage: {calculatePercentage()}</h5>
      </div>

      {/* Attendance Table */}
      <div className="attendance-table-container">
        <h3>Attendance Records</h3>
        {getFilteredRecords().length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Year</th>
                <th>Room Name</th>
                <th>Section</th>
                <th>Room Capacity</th>
                <th>Actual Attendance</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {getFilteredRecords().map((record) => (
                <tr key={record.id}>
                  <td>{record.studentId}</td>
                  <td>{record.year}</td>
                  <td>{record.roomName}</td>
                  <td>{record.section}</td>
                  <td>{record.roomCapacity}</td>
                  <td>{record.actualAttendance}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleEdit(record)}>
                      Edit
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(record.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>No records found for the selected filters.</p>
        )}
      </div>
    </Container>
  );
};

export default Attendance;
