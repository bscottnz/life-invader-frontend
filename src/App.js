import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';
import './App.css';
import './nprogress.css';
import { useEffect, useState } from 'react';

import axios from 'axios';
import nprogress from 'nprogress';

import Login from './pages/Login';
import Register from './pages/Register';
import Loading from './components/Loading';

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
      console.log(1, res.data);
      if (res.data.username !== undefined) {
        setCurrentUser(res.data);
        console.log(res.data);
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

  // if user is not logged in, only allow access to register and log in pages
  if (currentUser === null) {
    return (
      <Router>
        <div>
          <Switch>
            <Route path="/login">
              <Login setCurrentUser={setCurrentUser} />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
            <Route path="/">
              <Redirect to="/login" />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }

  // user is logged in so render main app
  return (
    <div className="App">
      <div>
        <h1>Log Out</h1>

        <button onClick={logOut}>Submit</button>
      </div>
    </div>
  );
}

export default App;
