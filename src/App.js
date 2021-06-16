import { BrowserRouter as Router, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef, useContext } from 'react';

import Welcome from './components/WelcomePage/Welcome';
import { ModalProvider } from './components/Modals/ModalContext';
import { FollowingProvider } from './components/MainPage/FollowingContext';

import { NotificationsProvider } from './components/MainPage/NotificationsContext';
import { NotificationsContext } from './components/MainPage/NotificationsContext';
import { NotificationsPopupContext } from './components/MainPage/NotificationsPopupContext';

import Loading from './components/Loading';
import TopNav from './components/MainPage/TopNav';
import TopNavDropdown from './components/MainPage/TopNavDropdown';
import LeftNav from './components/MainPage/LeftNav';
import MainContent from './components/MainPage/MainContent/MainContent';
import RightSidebar from './components/MainPage/RightSidebar';

import axios from 'axios';
import nprogress from 'nprogress';
import './style/main.scss';
// import socketIOClient from 'socket.io-client';
import sockets from './sockets';
import getNumMessages from './utils/getNumMessages';
import getNumNotifications from './utils/getNumNotifications';
import createNewNotificationPopup from './utils/newNotification';
import createNewMessagePopup from './utils/newMessage';

import openSocket from 'socket.io-client';
import NotificationPopup from './components/NotificationPopup';

function App() {
  // const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory();

  const { numMessages, setNumMessages, numNotifications, setNumNotifications } =
    useContext(NotificationsContext);

  const { setCurrentNotification, setCurrentChat, setNotificationIsOpen } =
    useContext(NotificationsPopupContext);

  // mobile nav
  const toggleDropdown = (close = false) => {
    const dropDownMenu = document.querySelector('.navbar-dropdown');
    if (close) {
      if (dropDownMenu) {
        dropDownMenu.classList.remove('dropdown-active');
      }
    } else {
      if (dropDownMenu) {
        dropDownMenu.classList.toggle('dropdown-active');
      }
    }
  };

  // get user session on page load
  useEffect(() => {
    // createNewNotificationPopup();

    // while fetiching user data, display loading page
    setisLoading(true);
    // loading bar start
    nprogress.start();
    axios({
      method: 'get',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/authenticate`,
    })
      .then((res) => {
        if (res.data.username !== undefined) {
          setCurrentUser(res.data);
        }
        //after user data is fetched, remove loading page
        setisLoading(false);
        //loading bar end
        nprogress.done();
      })
      .catch((err) => console.log(err));
  }, []);

  // destroy user session
  const logOut = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/logout`,
    }).then((res) => {
      setCurrentUser(null);
      // remove local storage post data. it is only needed when liking posts that have been expanded
      // and going between pages
      localStorage.clear();
    });
  };

  // socket connection. maybe make this run on initial log in only, then disconet in logout function
  useEffect(() => {
    if (currentUser) {
      if (!sockets.socket) {
        sockets.socket = openSocket(`${process.env.REACT_APP_BASE_URL}`, {
          transports: ['websocket'],
        });
      }
      sockets.socket.emit('setup', currentUser);

      sockets.socket.on('connected', () => {
        sockets.connected = true;
      });

      // real time messages (also there is logic for this in the chat component)
      sockets.socket.on('message recieved', (newMessage) => {
        const messageSocketResponse = sockets.messageReceived(newMessage);
        if (messageSocketResponse && !messageSocketResponse.onChatPage) {
          // handle notification

          axios({
            method: 'get',
            withCredentials: true,
            url: `${process.env.REACT_APP_BASE_URL}/api/notifications/latest`,
          }).then((res) => {
            // this is old way of creating popup
            // createNewNotificationPopup(res.data);
            // this is react way
            setNotificationIsOpen(true);
            setCurrentNotification(res.data);
            setCurrentChat(newMessage);

            getNumMessages(setNumMessages);
          });
        }
      });

      // real time notifications handler
      sockets.socket.on('notification received', (newNotification) => {
        // gets the latest notification for the Current User
        axios({
          method: 'get',
          withCredentials: true,
          url: `${process.env.REACT_APP_BASE_URL}/api/notifications/latest`,
        }).then((res) => {
          // this is old way of creating popup
          // createNewNotificationPopup(res.data);
          // this is react way
          setNotificationIsOpen(true);
          setCurrentNotification(res.data);

          getNumNotifications(setNumNotifications);
        });
      });

      // create emit notification function on sockets object
      sockets.emitNotification = function (userId, currentUserId) {
        if (userId === currentUserId) {
          return;
        }
        sockets.socket.emit('notification received', userId);
      };
    }
  }, [currentUser]);

  // return <Loading />;

  // display loading screen while user data is being fetched
  if (isLoading) {
    return <Loading />;
  }

  // if user is not logged in, only allow access to welcome, register and log in pages
  if (currentUser === null) {
    return <Welcome setCurrentUser={setCurrentUser} />;
  }

  // user is logged in so render main app
  return (
    <ModalProvider>
      <FollowingProvider>
        <Router history={history}>
          <div className="App">
            <TopNav toggleDropdown={toggleDropdown} />
            <TopNavDropdown
              logOut={logOut}
              currentUser={currentUser}
              toggleDropdown={toggleDropdown}
            />
            <div className="main-wrapper">
              <main className="layout">
                <LeftNav logOut={logOut} currentUser={currentUser} />
                <MainContent
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  toggleDropdown={toggleDropdown}
                />
                <RightSidebar currentUser={currentUser} setCurrentUser={setCurrentUser} />
                <NotificationPopup currentUser={currentUser} />
              </main>
            </div>
            {/* I may want to add this mobile add-post button back at some point. */}
            {/* <div className="new-post-btn-wrapper mobile-post-btn">
              <BiPlus style={{ fontSize: '32px' }} />
            </div> */}
          </div>
        </Router>
      </FollowingProvider>
    </ModalProvider>
  );
}

export default App;
