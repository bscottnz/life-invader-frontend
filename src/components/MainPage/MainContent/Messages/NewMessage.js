import React, { useState, useEffect } from 'react';

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
    console.log(user);
  };

  // only show users that isnt the current user and arent in the chat already
  const userList = userResults
    .filter((user) => {
      return user._id !== currentUser._id;
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

  return (
    <div>
      <h1 className="main-content-heading">New Message</h1>
      <div className="chat-page-container">
        <div className="chat-title-bar">
          {!isLoading && <label htmlFor="user-search-textbox">To:</label>}
          {isLoading && <VscLoading className="spinner" style={{ marginRight: '16px' }} />}
          <div id="selected-users">
            <input
              type="text"
              placeholder="Enter message recipients"
              id="user-search-textbox"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="results-container">{userResults.length > 0 && userList}</div>
        <button id="create-chat-btn" className="follow-btn" disabled={text.length === 0}>
          Create new chat
        </button>
      </div>
    </div>
  );
};

export default NewMessage;