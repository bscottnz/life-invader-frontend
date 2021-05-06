import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import Home from './Home';

const MainContent = ({ currentUser }) => {
  return (
    <Router>
      <section className="layout__main">
        <Home currentUser={currentUser} />
      </section>
    </Router>
  );
};

export default MainContent;
