import React, { useEffect, useContext } from 'react';
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
import NotificationsPage from './Notifications/NotificationsPage';
import GuestWelcome from './GuestWelcome';
import { ModalContext } from '../../Modals/ModalContext';

const MainContent = ({ currentUser, setCurrentUser, toggleDropdown }) => {
  const location = useLocation();

  const {
    setDeleteModalIsOpen,
    setModalIsOpen,
    setProfilePicModalIsOpen,
    setCoverPhotoModalIsOpen,
    setPinModalIsOpen,
    setUnPinModalIsOpen,
    setEditDescriptionModalIsOpen,
    setBuyNowModalIsOpen,
    setNoCoinsModalIsOpen,
    setEditChatNameModalIsOpen,
  } = useContext(ModalContext);

  // scrolls back to the top if you click on sidebar link for the page you are already on.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // close drop down menu if it is active
    toggleDropdown(true);
  }, [location]);

  // close all modals when changing pages. this stops the app crashing when you have an open modal,
  // click the browser back arrow and then the forward arrow
  useEffect(() => {
    setDeleteModalIsOpen(false);
    setModalIsOpen(false);
    setProfilePicModalIsOpen(false);
    setCoverPhotoModalIsOpen(false);
    setPinModalIsOpen(false);
    setUnPinModalIsOpen(false);
    setEditChatNameModalIsOpen(false);
    setEditDescriptionModalIsOpen(false);
    setBuyNowModalIsOpen(false);
    setNoCoinsModalIsOpen(false);
  }, [location]);

  return (
    <section className="layout__main">
      <Switch>
        <Route exact path="/guest">
          <GuestWelcome />
        </Route>
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
        <Route exact path="/notifications">
          <NotificationsPage currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>

        <Route path="/">
          <Home currentUser={currentUser} setCurrentUser={setCurrentUser} />
        </Route>
      </Switch>
    </section>
  );
};

export default MainContent;
