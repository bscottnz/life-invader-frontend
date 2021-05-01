import { React, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { BsArrowRight } from 'react-icons/bs';

import logoIcon from '../images/logo-large.png';
import logoText from '../images/textlogo-large.png';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');

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

  return (
    // <div>
    //   <div>
    //     <h1>Register</h1>
    //     <input
    //       type="text"
    //       placeholder="username"
    //       onChange={(e) => setRegisterUsername(e.target.value)}
    //     />
    //     <input
    //       type="text"
    //       placeholder="password"
    //       onChange={(e) => setRegisterPassword(e.target.value)}
    //     />
    //     <button onClick={register}>Submit</button>
    //   </div>
    //   <div>
    //     <p>
    //       Already have an account? <Link to="/login">Log in here</Link>
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
          <h3 className="welcome-heading-small">Register with lifeinvader</h3>
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
            <button className="btn btn-fill">
              Create account <BsArrowRight style={{ verticalAlign: 'bottom' }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
