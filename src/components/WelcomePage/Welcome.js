import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import WelcomeMain from './WelcomeMain';
import WelcomeRegister from './WelcomeRegister';
import WelcomeLogin from './WelcomeLogin';

import logoIcon from '../../images/logo-large.png';
import logoText from '../../images/textlogo-large.png';

const Welcome = ({ setCurrentUser }) => {
  return (
    <Router>
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
              It's not technology,
              <br />
              It's your life
            </h2>
            <Switch>
              <Route exact path="/welcome">
                <WelcomeMain setCurrentUser={setCurrentUser} />
              </Route>
              <Route exact path="/login">
                <WelcomeLogin setCurrentUser={setCurrentUser} />
              </Route>
              <Route exact path="/register">
                <WelcomeRegister setCurrentUser={setCurrentUser} />
              </Route>
              <Route path="/">
                {/* All other urls will redirect to main welcome page */}
                <Redirect to="/welcome" />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default Welcome;
