import React, { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, useLocation } from 'react-router-dom';

import Home from './Home';
import ViewPost from './ViewPost';
import ProfilePage from './ProfilePage';
import FollowerPage from './FollowerPage';
import SearchPage from './SearchPage';
import Store from './Store';
import Inbox from './Messages/Inbox';
import NewMessage from './Messages/NewMessage';
import ChatPage from './Messages/ChatPage';

const MainContent = ({ currentUser, setCurrentUser }) => {
  const location = useLocation();

  // scrolls back to the top if you click on sidebar link for the page you are already on.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);

  return (
    <section className="layout__main">
      <Switch>
        <Route exact path="/post/:id">
          <ViewPost currentUser={currentUser} setCurrentUser={setCurrentUser} />
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
          <SearchPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
        <Route exact path="/store">
          <Store currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
        <Route exact path="/store/nocoins">
          <Store currentUser={currentUser} setCurrentUser={setCurrentUser} popup={true} />
        </Route>
        <Route exact path="/messages">
          <Inbox currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
        <Route exact path="/messages/new">
          <NewMessage currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
        <Route exact path="/messages/:id">
          <ChatPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
        <Route path="/">
          <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
      </Switch>
    </section>
  );
};

export default MainContent;
