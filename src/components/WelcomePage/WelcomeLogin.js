import { React, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

const WelcomeLogin = ({ setCurrentUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  const history = useHistory();

  const login = () => {
    axios({
      method: 'post',
      data: {
        username,
        password,
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/login`,
    }).then((res) => {
      // if a logged in user is returned, set current user.
      // redirect to main app
      if (res.data.username !== undefined) {
        // console.log(res.data);
        setCurrentUser(res.data);

        history.push('/');
      } else {
        // no user was returned
        // display wrong username and password message
        // reset password

        setValidationErrors([res.data]);
        setPassword('');
      }
    });
  };

  const validateLoginDetails = (e) => {
    // validate each field and add any errors to the errors array to be displayed.
    e.preventDefault();

    const errors = [];

    if (username.length === 0) {
      errors.push('Please enter a username.');
    }

    if (password.length === 0) {
      errors.push('Please enter a password.');
    }

    if (errors.length === 0) {
      // information passes client side validation, send to server

      // alert('log in info has been validated and is being sent to server');
      login();
    } else {
      // set and display errors
      setValidationErrors(errors);
    }
  };

  const linkStyle = {
    color: 'rgb(29, 161, 242)',
    textDecoration: 'none',
  };

  return (
    <>
      <h3 className="welcome-heading-small">Log into lifeinvader</h3>
      <p className="welcome-text">
        Need an account?{' '}
        <Link style={linkStyle} to="/register">
          Sign up here
        </Link>
      </p>
      <form action="" className="welcome-register-form">
        <input
          className="input__sign-in"
          type="text"
          name="username"
          placeholder="Username or email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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

        <button className="btn btn-fill" onClick={validateLoginDetails}>
          Log in <BsArrowRight style={{ verticalAlign: 'bottom' }} />
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

export default WelcomeLogin;
