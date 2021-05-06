import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Welcome from './pages/Welcome';

import Loading from './components/Loading';
import TopNav from './components/MainPage/TopNav/TopNav';
import TopNavDropdown from './components/MainPage/TopNav/TopNavDropdown';
import LeftNav from './components/MainPage/LeftNav/LeftNav';
import MainContent from './components/MainPage/MainContent/MainContent';
import RightSidebar from './components/MainPage/RightSidebar/RightSidebar';
import { BiPlus } from 'react-icons/bi';

import axios from 'axios';
import nprogress from 'nprogress';
import './style/main.scss';

function App() {
  // const [name, setName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setisLoading] = useState(true);

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
    }).then((res) => {
      console.log('server data: ', res.data);
      if (res.data.username !== undefined) {
        setCurrentUser(res.data);
        console.log('user data: ', res.data);
      }
      //after user data is fetched, remove loading page
      setisLoading(false);
      //loading bar end
      nprogress.done();
    });
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
    <div className="App">
      <TopNav />
      <TopNavDropdown logOut={logOut} />
      <div className="main-wrapper">
        <main className="layout">
          <LeftNav logOut={logOut} />
          <MainContent currentUser={currentUser} />
          <RightSidebar />
        </main>
      </div>
      <div className="new-post-btn-wrapper mobile-post-btn">
        <BiPlus style={{ fontSize: '32px' }} />
      </div>
    </div>
  );
}

export default App;
