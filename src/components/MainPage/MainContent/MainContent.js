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
import FollowerPage from './FollowerPage';
import SearchPage from './SearchPage';

const MainContent = ({ currentUser, setCurrentUser }) => {
  const history = useHistory();
  return (
    <section className="layout__main">
      <Switch>
        <Route exact path="/post/:id">
          <ViewPost currentUser={currentUser} />
        </Route>
        <Route exact path="/profile/:username">
          <ProfilePage currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
        <Route exact path={'/profile/:username/followers'}>
          <FollowerPage
            selectedTab={'Followers'}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route exact path={'/profile/:username/following'}>
          <FollowerPage
            selectedTab={'Following'}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        </Route>
        <Route exact path="/search">
          <SearchPage currentUser={currentUser} />
        </Route>
        <Route path="/">
          <Home currentUser={currentUser} />
        </Route>
      </Switch>
    </section>
  );
};

export default MainContent;
