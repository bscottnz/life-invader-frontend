import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import axios from 'axios';

const WelcomeMain = ({ setCurrentUser }) => {
  const history = useHistory();

  const redirectSignUp = () => {
    history.push('/register');
  };

  const redirectLogIn = () => {
    history.push('/login');
  };

  const loginGuest = () => {
    axios({
      method: 'post',
      data: {
        username: 'lifeinvaderguest',
        password: 'lifeinvaderguest',
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/login`,
    }).then((res) => {
      // if a logged in user is returned, set current user.
      // redirect to main app
      if (res.data.username !== undefined) {
        setCurrentUser(res.data);

        history.push('/');
      }
    });

    // alert('currently unavailable');
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
      <button className="btn" onClick={loginGuest}>
        Log in as guest
      </button>
    </>
  );
};

export default WelcomeMain;
