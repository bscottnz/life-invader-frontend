import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom';

import Home from './Home';
import ViewPost from './ViewPost';
import ProfilePage from './ProfilePage';

const MainContent = ({ currentUser }) => {
  const history = useHistory();
  return (
    <section className="layout__main">
      <Switch>
        <Route exact path="/post/:id">
          <ViewPost currentUser={currentUser} />
        </Route>
        <Route exact path="/profile/:username">
          <ProfilePage currentUser={currentUser} />
        </Route>
        <Route path="/">
          <Home currentUser={currentUser} />
        </Route>
      </Switch>
    </section>
  );
};

export default MainContent;
