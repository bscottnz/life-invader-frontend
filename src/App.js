import { BrowserRouter as Router, useLocation, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

import Welcome from './components/WelcomePage/Welcome';
import { ModalProvider } from './components/Modals/ModalContext';
import { FollowingProvider } from './components/MainPage/FollowingContext';

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
import openSocket from 'socket.io-client';

function App() {
  // const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory();
  const location = useLocation();

  // mobile nav
  const toggleDropdown = (close = false) => {
    const dropDownMenu = document.querySelector('.navbar-dropdown');
    if (close) {
      dropDownMenu.classList.remove('dropdown-active');
    } else {
      dropDownMenu.classList.toggle('dropdown-active');
    }
  };

  // get user session on page load
  useEffect(() => {
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

      sockets.socket.on('message recieved', (newMessage) => {
        sockets.messageReceived(newMessage, location.pathname);
      });

      // sockets.messageReceived(5, location.pathname);
    }
  }, [currentUser]);

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
                <MainContent currentUser={currentUser} setCurrentUser={setCurrentUser} />
                <RightSidebar currentUser={currentUser} setCurrentUser={setCurrentUser} />
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
