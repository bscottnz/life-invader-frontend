import React, { useState, useEffect } from 'react';

import Post from './Post';
import DeletePostModal from '../../Modals/DeletePostModal';
import ReplyModal from '../../Modals/ReplyModal';

import { BiSearch } from 'react-icons/bi';
import { VscLoading } from 'react-icons/vsc';

import deletePostRequest from '../../../utils/deletePostRequest';

import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';

const SearchPage = ({ currentUser }) => {
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

  const setActiveTabPosts = () => {
    setActiveTab('Posts');
  };

  const setActiveTabUsers = () => {
    setActiveTab('Users');
  };

  // make a search request 1.5s after searchText has stopped changing.

  // timer that keeps track of when to send search request to server
  let searchTimer;

  useEffect(() => {
    if (searchText.trim() !== '') {
      searchTimer = setTimeout(() => {
        makeSearchRequest();
      }, 1500);
    }

    return () => {
      clearTimeout(searchTimer);
    };
  }, [searchText]);

  const makeSearchRequest = () => {
    setIsLoading(true);

    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/search`,
      params: { search: searchText.trim() },
    })
      .then((res) => {
        console.log(res.data);
        setPostResults(res.data.posts);
        setIsLoading(false);
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
      forceUpdate={makeSearchRequest}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
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

  return (
    <div>
      <ReplyModal
        currentUser={currentUser}
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
    </div>
  );
};

export default SearchPage;
