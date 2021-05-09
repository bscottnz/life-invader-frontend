import React from 'react';
import { useState, useEffect } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

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
      backgroundColor: 'rgba(0, 0, 0, .9)',
      height: 'calc(100vh + 100px)',
      zIndex: 3,
    },
    content: {
      backgroundColor: 'rgb(21, 24, 28)',
      maxWidth: '600px',
      height: 'fit-content',
      zIndex: 3,
      marginLeft: 'auto',
      marginRight: 'auto',
      top: 'calc(50% - 50px)',
      left: '10px',
      right: '10px',
      // transform: 'translateY(-50%)',
      borderRadius: '15px',
      border: '1px solid #3a3a3a',
      border: 'none',
    },
  };

  let replyHeading = '';
  let replyTextPlaceholder = '';

  // generates custom reply popup message depending on who you reply to
  if (replyComment !== null) {
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
      <Modal
        style={modalStyle}
        isOpen={modalIsOpen}
        closeTimeoutMS={300}
        onRequestClose={() => setModalIsOpen(false)}
      >
        <div
          className="heading-container"
          style={{ display: 'flex', justifyContent: 'space-between' }}
        >
          <h2 className="main-content-heading">{replyHeading}</h2>

          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setModalIsOpen(false)}
          />
        </div>

        <Post
          postData={replyComment}
          currentUser={currentUser}
          key={uuidv4()}
          forceUpdate={getPosts}
          setModalIsOpen={setModalIsOpen}
        />

        <CreatePostForm
          currentUser={currentUser}
          setPosts={setPosts}
          posts={posts}
          textPlaceholder={replyTextPlaceholder}
          buttonText={'Reply'}
          setModalIsOpen={setModalIsOpen}
        />
      </Modal>
      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
