import { BrowserRouter as Router, Switch, Route, Link, Redirect } from 'react-router-dom';

import './App.css';
import { useEffect, useState } from 'react';
import apiCall from './utils/apiCall';
import axios from 'axios';

import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  // const [name, setName] = useState('');

  // get user session on page load
  useEffect(() => {
    axios({
      method: 'get',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/authenticate`,
    }).then((res) => {
      // setCurrentUser(res.data);
      console.log(res.data);
      if (res.data.username !== undefined) {
        setCurrentUser(res.data);
      }
    });
  }, []);

  const [currentUser, setCurrentUser] = useState(null);

  const getUser = () => {
    axios({
      method: 'get',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/user`,
    }).then((res) => {
      setCurrentUser(res.data);
      console.log(res.data);
    });
  };

  const logOut = () => {
    axios({
      method: 'get',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/logout`,
    }).then((res) => {
      setCurrentUser(null);
    });
  };

  // if user is not logged in, only allow access to register and log in pages
  if (currentUser === null) {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login" />
            </Route>
            <Route path="/login">
              <Login setCurrentUser={setCurrentUser} />
            </Route>
            <Route exact path="/register">
              <Register />
            </Route>
          </Switch>
        </div>
      </Router>
    );
  }

  return (
    <div className="App">
      <div>
        <h1>Get user</h1>

        <button onClick={getUser}>Submit</button>
        {/* {data ? <h1>Welcome back {data.username}</h1> : null} */}
      </div>

      <div>
        <h1>Log Out</h1>

        <button onClick={logOut}>Submit</button>
      </div>
    </div>
  );
}

export default App;
