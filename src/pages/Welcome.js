import React from 'react';

import logoIcon from '../images/logo-large.png';
import logoText from '../images/textlogo-large.png';

const Welcome = () => {
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
          <h3 className="welcome-heading-small">Join lifeinvader today</h3>
          <button className="btn btn-fill">Sign up</button>
          <button className="btn">Log in</button>
          <button className="btn">Log in as guest</button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
