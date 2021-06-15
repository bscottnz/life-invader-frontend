import React, { useState, useEffect } from 'react';

import Post from './Post';
import UserPreview from './UserPreview';
import DeletePostModal from '../../Modals/DeletePostModal';
import ReplyModal from '../../Modals/ReplyModal';

import { BiSearch } from 'react-icons/bi';
import { VscLoading } from 'react-icons/vsc';

import deletePostRequest from '../../../utils/deletePostRequest';

import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';

const SearchPage = ({ currentUser, setCurrentUser }) => {
  // the active tab the user is viewing. eg posts or users
  const [activeTab, setActiveTab] = useState('Posts');

  const [searchText, setSearchText] = useState('');

  // display spinner when search results are loading
  const [isLoading, setIsLoading] = useState(false);

  // keep track of which comment is being replied to in the modal
  const [replyComment, setReplyComment] = useState(null);

  // keep track of which comment is being deleted
  const [deleteComment, setDeleteComment] = useState(null);

  // search results
  const [postResults, setPostResults] = useState([]);
  const [userResults, setUserResults] = useState([]);

  // no results error/message
  const [noPostResults, setNoPostResults] = useState(false);
  const [noUserResults, setNoUserResults] = useState(false);

  const setActiveTabPosts = () => {
    setActiveTab('Posts');
  };

  const setActiveTabUsers = () => {
    setActiveTab('Users');
  };

  // make a search request 0.9s after searchText has stopped changing.

  useEffect(() => {
    // timer that keeps track of when to send search request to server
    let searchTimer;
    if (searchText.trim() !== '') {
      searchTimer = setTimeout(() => {
        makeSearchRequest();
      }, 900);
    } else {
      // clear results container
      setUserResults([]);
      setPostResults([]);
    }

    return () => {
      clearTimeout(searchTimer);
    };
  }, [searchText]);

  // dont want to show loading spinner when we are just updating data after liking / following
  // a search result
  const makeSearchRequest = (showLoading = true) => {
    if (showLoading) {
      setIsLoading(true);
    }

    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/search`,
      params: { search: searchText.trim() },
    })
      .then((res) => {
        setPostResults(res.data.posts);
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

        // set no results messages

        if (res.data.posts.length === 0) {
          setNoPostResults(true);
        } else {
          setNoPostResults(false);
        }

        if (res.data.users.length === 0) {
          setNoUserResults(true);
        } else {
          setNoUserResults(false);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  // delete post
  const deletePost = (id) => {
    deletePostRequest(id, makeSearchRequest);
  };

  const postList = postResults.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={() => makeSearchRequest(false)}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
    />
  ));

  const userList = userResults.map((user) => (
    <UserPreview
      currentUser={currentUser}
      user={user}
      key={uuidv4()}
      setCurrentUser={setCurrentUser}
      getUserData={() => makeSearchRequest(false)}
    />
  ));

  let replyHeading = '';
  let replyTextPlaceholder = '';

  // generates custom reply popup message depending on who you reply to
  // the check for undefined stops the app from crashing when you reply to a reply from within
  // the view post page. i dont really understand why it crashes without it.
  if (replyComment !== null && replyComment !== undefined) {
    if (replyComment.author.username === currentUser.username) {
      replyHeading = 'Reply to... yourself?';
      replyTextPlaceholder = 'Replying to yourself huh? You must have a lot of friends...';
    } else {
      replyHeading = `Reply to ${replyComment.author.username}`;
      replyTextPlaceholder = `Give ${replyComment.author.username} a piece of your mind..`;
    }
  }

  const noResultsStyle = { marginTop: '20px', fontSize: '16px' };

  return (
    <div style={{ maxWidth: '100%' }}>
      <ReplyModal
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        replyComment={replyComment}
        replyHeading={replyHeading}
        replyTextPlaceholder={replyTextPlaceholder}
        getPost={makeSearchRequest}
      />
      <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />
      <h1 className="main-content-heading">Search lifeinvader</h1>
      <div className="search-container">
        {isLoading ? <VscLoading className="spinner" /> : <BiSearch />}

        <input
          autoComplete="off"
          spellCheck="false"
          type="text"
          value={searchText}
          id="search-box"
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={`Search ${activeTab === 'Posts' ? 'posts' : 'users'}`}
        />
      </div>
      <div className="tabs-container">
        <div className={`tab ${activeTab === 'Posts' ? 'active' : ''}`} onClick={setActiveTabPosts}>
          Posts
        </div>
        <div className={`tab ${activeTab === 'Users' ? 'active' : ''}`} onClick={setActiveTabUsers}>
          Users
        </div>
      </div>
      {postResults.length > 0 && activeTab === 'Posts' && postList}
      {userResults.length > 0 && activeTab === 'Users' && userList}

      {noPostResults && activeTab === 'Posts' && searchText !== '' && !isLoading && (
        <h2 style={noResultsStyle}>No posts found</h2>
      )}

      {noUserResults && activeTab === 'Users' && searchText !== '' && !isLoading && (
        <h2 style={noResultsStyle}>No users found</h2>
      )}
    </div>
  );
};

export default SearchPage;
