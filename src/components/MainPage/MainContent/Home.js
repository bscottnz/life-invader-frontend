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
    />
  ));

  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, .55)',
      zIndex: 3,
    },
    content: {
      backgroundColor: 'rgb(21, 24, 28)',
      maxWidth: '600px',
      height: '500px',
      zIndex: 3,
      marginLeft: 'auto',
      marginRight: 'auto',
      top: '50%',
      left: '10px',
      right: '10px',
      transform: 'translateY(-50%)',
      borderRadius: '15px',
      border: '1px solid #3a3a3a',
    },
  };

  return (
    <div>
      <Modal style={modalStyle} isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Modal title</h2>
        <p>Modal body</p>
        <button onClick={() => setModalIsOpen(false)}>Close</button>
      </Modal>
      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
