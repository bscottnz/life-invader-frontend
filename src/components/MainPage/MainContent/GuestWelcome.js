import React from 'react';
import { useHistory } from 'react-router-dom';

import logoIcon from '../../../images/logo-large.png';

const GuestWelcome = () => {
  const history = useHistory();
  const goToSearchPage = () => {
    history.push('/search');
  };

  const goToBensPage = () => {
    history.push('/profile/coolben');
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <h2 className="main-content-heading">Welcome to lifeinvader!</h2>
      <p className="paragraph-text">
        Stalk other lifeinvader users to see their posts on the home page.
      </p>
      <p className="paragraph-text">
        Check out{' '}
        <span className="text-link" onClick={goToBensPage}>
          Ben's profile here
        </span>
        , or search for users from the{' '}
        <span className="text-link" onClick={goToSearchPage}>
          search page.
        </span>
      </p>
      <div className="image-wrapper" style={{ width: '60%', margin: '50px auto 0' }}>
        <img src={logoIcon} alt="logo" style={{ width: '100%' }} />
      </div>
    </div>
  );
};

export default GuestWelcome;
