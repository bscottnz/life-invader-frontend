import React from 'react';

import { Link, useHistory } from 'react-router-dom';

import logoIcon from '../images/logo-large.png';
import logoText from '../images/textlogo-large.png';

const Welcome = () => {
  const history = useHistory();

  const redirectSignUp = () => {
    history.push('/register');
  };

  const redirectLogIn = () => {
    history.push('/login');
  };

  return (
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
          <h3 className="welcome-heading-small welcome-heading-small__main">
            Join lifeinvader today
          </h3>
          <button className="btn btn-fill" onClick={redirectSignUp}>
            Sign up
          </button>
          <button className="btn" onClick={redirectLogIn}>
            Log in
          </button>
          <button className="btn">Log in as guest</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
