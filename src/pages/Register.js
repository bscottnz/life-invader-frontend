import { React, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

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

  return (
    <div>
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
        <p>
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
