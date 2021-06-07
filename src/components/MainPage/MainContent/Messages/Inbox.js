import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import ChatListItem from './ChatListItem';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { BiMessageAdd } from 'react-icons/bi';

const Inbox = ({ currentUser }) => {
  const history = useHistory();

  const [chats, setChats] = useState([]);

  const goToNewMessagePage = () => {
    history.push('/messages/new');
  };

  const getChats = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats`,
    })
      .then((res) => {
        setChats(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getChats();
  }, []);

  const chatList = chats.map((chat) => (
    <ChatListItem chat={chat} key={uuidv4()} currentUser={currentUser} />
  ));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="main-content-heading">Inbox</h1>
        <BiMessageAdd
          className="blue-on-hover"
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={goToNewMessagePage}
        />
      </div>
      {chats.length > 0 && chatList}
    </div>
  );
};

export default Inbox;
