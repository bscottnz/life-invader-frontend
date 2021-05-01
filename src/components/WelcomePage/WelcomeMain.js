import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const WelcomeMain = () => {
  const history = useHistory();

  const redirectSignUp = () => {
    history.push('/register');
  };

  const redirectLogIn = () => {
    history.push('/login');
  };
  return (
    <>
      <h3 className="welcome-heading-small welcome-heading-small__main">Join lifeinvader today</h3>
      <button className="btn btn-fill" onClick={redirectSignUp}>
        Sign up
      </button>
      <button className="btn" onClick={redirectLogIn}>
        Log in
      </button>
      <button className="btn">Log in as guest</button>
    </>
  );
};

export default WelcomeMain;
