import React from 'react';
import { useState, useEffect } from 'react';

import Modal from 'react-modal';

import CreatePostForm from './CreatePostForm';
import Post from './Post';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

Modal.setAppElement('#root');

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // keep track of which comment is being replied to
  const [replyComment, setReplyComment] = useState(null);

  const getPosts = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
    }).then((res) => {
      // set retrieved posts to post state array
      if (res.data.length > 0 && res.data[0].author.firstName === undefined) {
        return alert('author data not populated ');
      }

      setPosts(res.data);
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

  const postItems = posts.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPosts}
      setModalIsOpen={setModalIsOpen}
      setReplyComment={setReplyComment}
    />
  ));

  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, .75)',
      height: 'calc(100vh + 100px)',
      zIndex: 3,
    },
    content: {
      backgroundColor: 'rgb(21, 24, 28)',
      maxWidth: '600px',
      height: '500px',
      zIndex: 3,
      marginLeft: 'auto',
      marginRight: 'auto',
      top: 'calc(50% - 50px)',
      left: '10px',
      right: '10px',
      transform: 'translateY(-50%)',
      borderRadius: '15px',
      border: '1px solid #3a3a3a',
      border: 'none',
    },
  };

  return (
    <div>
      <Modal
        style={modalStyle}
        isOpen={modalIsOpen}
        closeTimeoutMS={300}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <h2 className="main-content-heading">Reply</h2>

        <Post
          postData={replyComment}
          currentUser={currentUser}
          key={uuidv4()}
          forceUpdate={getPosts}
          setModalIsOpen={setModalIsOpen}
        />

        <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
