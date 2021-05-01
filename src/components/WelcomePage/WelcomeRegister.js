import { React, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import checkEmail from '../../utils/checkEmail';

const WelcomeRegister = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // const register = () => {
  //   axios({
  //     method: 'post',
  //     data: {
  //       username: registerUsername,
  //       password: registerPassword,
  //     },
  //     withCredentials: true,
  //     url: `${process.env.REACT_APP_BASE_URL}/register`,
  //   }).then((res) => console.log(res));
  // };

  const validateRegisterDetails = (e) => {
    // validate each field and add any errors to the errors array to be displayed.
    e.preventDefault();

    const errors = [];

    if (firstName.length === 0) {
      errors.push('Please enter your first name.');
    }

    if (lastName.length === 0) {
      errors.push('Please enter your last name.');
    }

    if (username.length === 0) {
      errors.push('Please enter a username.');
    }

    const isValidEmail = checkEmail(email);

    if (email.length === 0 || !isValidEmail) {
      errors.push('Please enter a valid email address.');
    }

    if (password.length === 0) {
      errors.push('Please enter a password.');
    }

    if (passwordConfirm.length === 0) {
      errors.push('Please confirm your password.');
    }

    if (password !== passwordConfirm && password.length > 0 && passwordConfirm.length > 0) {
      errors.push('Your passwords do not match.');
      setPassword('');
      setPasswordConfirm('');
    }

    if (errors.length === 0) {
      // information passes client side validation, send to server
      setValidationErrors([]);
      alert('registration info has been validated and is being sent to server');
      const form = document.getElementsByClassName('welcome-register-form')[0];
      form.submit();
    } else {
      // set and display errors
      setValidationErrors(errors);
    }

    console.log(errors);
  };

  const linkStyle = {
    color: 'rgb(29, 161, 242)',
    textDecoration: 'none',
  };

  return (
    <>
      <h3 className="welcome-heading-small">Register with lifeinvader</h3>
      <p className="welcome-text">
        Already have an account?{' '}
        <Link style={linkStyle} to="/login">
          Log in here
        </Link>
      </p>
      <form action="" className="welcome-register-form">
        <input
          className="input__sign-in"
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          className="input__sign-in"
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <input
          className="input__sign-in"
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="input__sign-in"
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input__sign-in"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="input__sign-in"
          type="password"
          name="passwordConfirm"
          placeholder="Confirm password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          required
        />
        <button className="btn btn-fill" onClick={validateRegisterDetails}>
          Create account <BsArrowRight style={{ verticalAlign: 'bottom' }} />
        </button>
        {validationErrors.map((err) => (
          <p className="register-error" key={err}>
            {err}
          </p>
        ))}
      </form>
    </>
  );
};

export default WelcomeRegister;
