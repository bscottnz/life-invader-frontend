import { React, useState } from 'react';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

const Login = ({ setCurrentUser }) => {
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const history = useHistory();

  const login = () => {
    axios({
      method: 'post',
      data: {
        username: loginUsername,
        password: loginPassword,
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/login`,
    }).then((res) => {
      console.log(res.data);
      setCurrentUser(res.data);
      history.push('/');
    });
  };

  return (
    <div>
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
        <p>
          Need an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
