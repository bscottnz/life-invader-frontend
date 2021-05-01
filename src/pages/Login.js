import { React, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import logoIcon from '../images/logo-large.png';
import logoText from '../images/textlogo-large.png';

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);

  // const history = useHistory();

  // const login = () => {
  //   axios({
  //     method: 'post',
  //     data: {
  //       username: loginUsername,
  //       password: loginPassword,
  //     },
  //     withCredentials: true,
  //     url: `${process.env.REACT_APP_BASE_URL}/login`,
  //   }).then((res) => {
  //     // if a logged in user is returned, set current user.
  //     if (res.data.username !== undefined) {
  //       console.log(res.data.username);
  //       setCurrentUser(res.data);
  //       history.push('/');
  //     } else {
  //       // no user was returned
  //       // need to show wrong username / password message
  //       console.log(res.data);
  //     }
  //   });
  // };

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
      setValidationErrors([]);
      alert('log in info has been validated and is being sent to server');
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
    // <div>
    //   <div>
    //     <h1>Login</h1>
    //     <input
    //       type="text"
    //       placeholder="username"
    //       onChange={(e) => setLoginUsername(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="password"
    //       onChange={(e) => setLoginPassword(e.target.value)}
    //     />
    //     <button onClick={login}>Submit</button>
    //   </div>
    //   <div>
    //     <p>
    //       Need an account? <Link to="/register">Sign up here</Link>
    //     </p>
    //   </div>
    // </div>

    <div className="welcome-wrapper">
      <div className="welcome-content">
        <div className="welcome-logo-container">
          <div className="welcome-logo-img">
            <img src={logoIcon} alt="life invader logo icon" />
          </div>
          <div className="welcome-logo-text">
            <img src={logoText} alt="life invader logo icon" />
          </div>
        </div>
        <div className="welcome-form">
          <div className="welcome-form-img">
            <img src={logoIcon} alt="Life invader logo icon - small" />
          </div>
          <h2 className="welcome-heading-large">
            It's not just an app,
            <br />
            It's your life
          </h2>
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
              placeholder="Username"
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
        </div>
      </div>
    </div>
  );
};

export default Login;
