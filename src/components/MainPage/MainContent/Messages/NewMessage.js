import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import UserPreview from '../UserPreview';

import { VscLoading } from 'react-icons/vsc';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const NewMessage = ({ currentUser, setCurrentUser }) => {
  const [text, setText] = useState('');

  // display spinner when search results are loading
  const [isLoading, setIsLoading] = useState(false);

  // search results
  const [userResults, setUserResults] = useState([]);

  // users that have been added to chat
  const [selectedUsers, setSelectedUsers] = useState([]);

  const history = useHistory();

  const makeSearchRequest = (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/search`,
      params: { search: text.trim() },
    })
      .then((res) => {
        // order users alphabetically case insenstitve
        setUserResults(
          res.data.users.sort((a, b) =>
            a.firstName.toLowerCase() + a.lastName.toLowerCase() >
            b.firstName.toLowerCase() + b.lastName.toLowerCase()
              ? 1
              : -1
          )
        );

        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // make a search request 0.9s after searchText has stopped changing.

  useEffect(() => {
    // timer that keeps track of when to send search request to server
    let searchTimer;
    if (text.trim() !== '') {
      searchTimer = setTimeout(() => {
        makeSearchRequest();
      }, 900);
    } else {
      // clear results container
      setUserResults([]);
    }

    return () => {
      clearTimeout(searchTimer);
    };
  }, [text]);

  const addUserToMessage = (user) => {
    setSelectedUsers((prevUsersArray) => [...prevUsersArray, user]);
    setText('');
    document.getElementById('user-search-textbox').focus();
  };

  const removeUserFromMessage = (userId) => {
    let users = [...selectedUsers];
    // console.log(users);
    users = users.filter((user) => {
      return user._id !== userId;
    });
    setSelectedUsers(users);
  };

  const createNewChat = () => {
    const data = JSON.stringify(selectedUsers);

    axios({
      method: 'post',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats`,
      data: { users: data },
    })
      .then((res) => {
        // res.data is the newly created chat. redirect to this chat page.
        history.push(`/messages/${res.data._id}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // only show users that isnt the current user and arent in the chat already
  const userList = userResults
    .filter((user) => {
      return user._id !== currentUser._id;
    })
    .filter((user) => {
      return !selectedUsers.some((u) => u._id === user._id);
    })
    .map((user) => (
      <UserPreview
        currentUser={currentUser}
        user={user}
        key={uuidv4()}
        setCurrentUser={setCurrentUser}
        getUserData={() => makeSearchRequest(false)}
        addToChat={addUserToMessage}
        showFollowBtn={false}
      />
    ));

  const selectedUsersLabels = selectedUsers.map((user) => (
    <p
      className="user-added-to-chat"
      onClick={(e) => removeUserFromMessage(user._id)}
      key={uuidv4()}
    >{`${user.firstName} ${user.lastName}`}</p>
  ));

  return (
    <div>
      <h1 className="main-content-heading">New Message</h1>
      <div className="chat-page-container">
        <div className="chat-title-bar">
          {!isLoading && <label htmlFor="user-search-textbox">To:</label>}
          {isLoading && <VscLoading className="spinner" style={{ marginRight: '16px' }} />}
          <div id="selected-users">
            <input
              autoComplete="off"
              type="text"
              placeholder="Enter message recipients"
              id="user-search-textbox"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        {selectedUsers.length > 0 && <div>{selectedUsersLabels}</div>}
        <div className="results-container">{userResults.length > 0 && userList}</div>
        <button
          id="create-chat-btn"
          className="follow-btn"
          disabled={selectedUsers.length === 0}
          onClick={createNewChat}
        >
          Create new chat
        </button>
      </div>
    </div>
  );
};

export default NewMessage;
