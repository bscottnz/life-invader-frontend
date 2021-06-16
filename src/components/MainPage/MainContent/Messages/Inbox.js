import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';

import ChatListItem from './ChatListItem';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import sockets from '../../../../sockets';

import { BiMessageAdd } from 'react-icons/bi';
import LoadingSpinner from '../../../LoadingSpinner';

const Inbox = ({ currentUser }) => {
  const history = useHistory();

  const [chats, setChats] = useState([]);

  // display loading spinner while fetching posts
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  // dont show loading spinner when updating posts, just on initail page load
  const isInitialPostFetch = useRef(true);

  const goToNewMessagePage = () => {
    history.push('/messages/new');
  };

  const getChats = () => {
    setIsPostsLoading(true);
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats`,
    })
      .then((res) => {
        setChats(res.data);
        setIsPostsLoading(false);
        if (isInitialPostFetch.current) {
          isInitialPostFetch.current = false;
        }
      })
      .catch((err) => {
        console.log(err);
        setIsPostsLoading(false);
      });
  };

  useEffect(() => {
    getChats();
  }, []);

  useEffect(() => {
    // update inbox list when a new message is received
    sockets.socket.on('message recieved', (newMessage) => {
      const messageSocketResponse = sockets.messageReceived(newMessage);
      if (messageSocketResponse && messageSocketResponse.onInboxPage) {
        getChats();
      }
    });
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
      {isPostsLoading && isInitialPostFetch.current && <LoadingSpinner />}
      {chats.length > 0 && chatList}
    </div>
  );
};

export default Inbox;
