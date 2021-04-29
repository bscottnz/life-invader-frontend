import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import './App.css';
import { useEffect, useState } from 'react';
import apiCall from './utils/apiCall';
import axios from 'axios';

function App() {
  // const [name, setName] = useState('');

  // useEffect(() => {
  //   const getData = async () => {
  //     const url = '/ben';
  //     const options = {
  //       method: 'POST',
  //       headers: {
  //         'Content-type': 'application/json',
  //       },
  //       body: JSON.stringify({ test: 'hello' }),
  //     };
  //     const data = await apiCall(url, options);
  //     console.log(data);
  //     setName(data.title);
  //   };

  //   getData();
  // }, []);

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [data, setData] = useState(null);

  const register = () => {
    axios({
      method: 'post',
      data: {
        username: registerUsername,
        password: registerPassword,
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/register`,
    }).then((res) => console.log(res));
  };

  const login = () => {
    axios({
      method: 'post',
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/login`,
    }).then((res) => console.log(res));
  };

  const getUser = () => {
    axios({
      method: 'get',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/user`,
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };

  const logOut = () => {
    axios({
      method: 'get',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/logout`,
    }).then((res) => {
      setData(null);
    });
  };

  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setRegisterUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Submit</button>
      </div>

      <div>
        <h1>Login</h1>
        <input
          type="text"
          placeholder="username"
          onChange={(e) => setLoginUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>

      <div>
        <h1>Get user</h1>

        <button onClick={getUser}>Submit</button>
        {data ? <h1>Welcome back {data.username}</h1> : null}
      </div>

      <div>
        <h1>Log Out</h1>

        <button onClick={logOut}>Submit</button>
      </div>
    </div>
  );
}

export default App;
