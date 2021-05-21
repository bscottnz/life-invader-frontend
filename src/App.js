import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom';
import { useEffect, useState } from 'react';

import Welcome from './components/WelcomePage/Welcome';
import { ModalProvider } from './components/Modals/ModalContext';

import Loading from './components/Loading';
import TopNav from './components/MainPage/TopNav';
import TopNavDropdown from './components/MainPage/TopNavDropdown';
import LeftNav from './components/MainPage/LeftNav';
import MainContent from './components/MainPage/MainContent/MainContent';
import RightSidebar from './components/MainPage/RightSidebar';
import { BiPlus } from 'react-icons/bi';

import axios from 'axios';
import nprogress from 'nprogress';
import './style/main.scss';

function App() {
  // const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const history = useHistory();

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
    });
  };

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
              <RightSidebar />
            </main>
          </div>
          <div className="new-post-btn-wrapper mobile-post-btn">
            <BiPlus style={{ fontSize: '32px' }} />
          </div>
        </div>
      </Router>
    </ModalProvider>
  );
}

export default App;
