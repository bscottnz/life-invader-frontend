import React from 'react';
import { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';

import CreatePostForm from './CreatePostForm';
import Post from './Post';
import DeletePostModal from '../../Modals/DeletePostModal';
import ReplyModal from '../../Modals/ReplyModal';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import deletePostRequest from '../../../utils/deletePostRequest';

Modal.setAppElement('#root');

const Home = ({ currentUser, setCurrentUser }) => {
  const [posts, setPosts] = useState([]);

  // keep track of which comment is being replied to
  const [replyComment, setReplyComment] = useState(null);

  // keep track of the id of which comment is being deleted
  const [deleteComment, setDeleteComment] = useState(null);

  const getPosts = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
      params: { followingPostsOnly: true },
    })
      .then((res) => {
        // set retrieved posts to post state array
        if (res.data.length > 0 && res.data[0].author.firstName === undefined) {
          return alert('author data not populated ');
        }

        setPosts(res.data);
      })
      .catch((err) => {
        console.log(err);
        // user has been signed out. redirect to home page
        if (err.response && err.response.status == 401) {
          window.location.reload();
        }
      });
  };

  // update the reply comment to its new data after being disliked or shared.
  // this allows the dislike and share button to update within the reply modal.
  useEffect(() => {
    if (replyComment) {
      const updatedReplyComment = posts.filter((post) => post._id === replyComment._id);

      setReplyComment(updatedReplyComment[0]);
    }
  }, [posts]);

  // fetch posts on page load
  useEffect(() => {
    getPosts();
  }, []);

  // delete post
  const deletePost = (id) => {
    deletePostRequest(id, getPosts);
  };

  const postItems = posts.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPosts}
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
        setCurrentUser={setCurrentUser}
        replyComment={replyComment}
        replyHeading={replyHeading}
        replyTextPlaceholder={replyTextPlaceholder}
        getPost={getPosts}
      />

      <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />

      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm
        currentUser={currentUser}
        forceUpdate={getPosts}
        setCurrentUser={setCurrentUser}
        textPlaceholder={`Hey ${currentUser.firstName}, what's going on?`}
      />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
