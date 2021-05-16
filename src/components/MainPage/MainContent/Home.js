import React from 'react';
import { useState, useEffect, useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import CreatePostForm from './CreatePostForm';
import Post from './Post';
import DeletePostModal from '../../Modals/DeletePostModal';
import { ModalContext } from '../../Modals/ModalContext';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import modalStyle from '../../Modals/modalStyle';

Modal.setAppElement('#root');

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);

  const { modalIsOpen, setModalIsOpen } = useContext(ModalContext);

  // keep track of which comment is being replied to
  const [replyComment, setReplyComment] = useState(null);

  // keep track of the id of which comment is being deleted
  const [deleteComment, setDeleteComment] = useState(null);

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
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
    />
  ));

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
      {/* this modal behaves differently to the other create post modals so i left it 
      here like this */}
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
          allowComments={false}
          isDeletable={false}
        />

        <CreatePostForm
          currentUser={currentUser}
          setPosts={setPosts}
          posts={posts}
          textPlaceholder={replyTextPlaceholder}
          buttonText={'Reply'}
          setModalIsOpen={setModalIsOpen}
          isReply={true}
          replyComment={replyComment}
        />
      </Modal>

      <DeletePostModal deleteComment={deleteComment} />

      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
