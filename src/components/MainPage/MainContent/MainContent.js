import React from 'react';
import Home from './Home';

const MainContent = ({ currentUser }) => {
  return (
    <section className="layout__main">
      <Home currentUser={currentUser} />
    </section>
  );
};

export default MainContent;
