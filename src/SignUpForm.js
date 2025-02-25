

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Form, InputGroup, Spinner } from 'react-bootstrap';
import { BsPerson, BsEnvelope, BsLock } from 'react-icons/bs';
import UserData from './UserData';
import './signup.css';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateUsername = (username) => {
    const usernameRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d)[A-Za-z\d!@#$%^&*]{7,19}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}$/;
    return emailRegex.test(email) && email.length < 50;
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*\d).{8,10}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!validateUsername(username)) {
      alert('Invalid username. Please try again.');
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      alert('Invalid email. Please try again.');
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      alert('Invalid password. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      alert('A verification email has been sent to your registered email address. Please verify your email before logging in.');

      // Save username and email in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        username: username,
        email: email,
      });

      setUserId(user.uid);
      setShowPopup(true);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        alert('The email address is already in use by another account.');
      } else {
        console.error('Error:', err);
        setError('Error creating account. Please try again.');
      }
    }

    setLoading(false);
  };

  const handleClose = () => {
    setShowPopup(false);
    navigate('/');
  };

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p>Please wait...</p>
          </div>
        </div>
      )}

      <div className="signup-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2 className="signup-heading">Sign Up</h2>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsPerson /></InputGroup.Text>
              <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Email:</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsEnvelope /></InputGroup.Text>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <InputGroup>
              <InputGroup.Text><BsLock /></InputGroup.Text>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </InputGroup>
          </Form.Group>
          <button type="submit" disabled={loading}>Sign Up</button>
          {error && <p className="error-message">{error}</p>}
          <p>Already registered?</p>
          <Link to="/login">Login</Link>
        </form>
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Success</h2>
            <p>Account created successfully. Please check your email for verification.</p>
            <button onClick={handleClose}>OK</button>
            <UserData userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpForm;
