import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { HiOutlineEmojiSad } from 'react-icons/hi';

import Post from './Post';
import CreatePostForm from './CreatePostForm';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ViewPost = ({ currentUser }) => {
  // this entire component needs to be re written, this feels like a hack to get it working rather
  // than a nice solution
  const id = useParams().id;

  const [post, setPost] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  // show error message if no post is returned
  const [showError, setShowError] = useState(false);

  // keep track of which comment is being replied to
  const [replyComment, setReplyComment] = useState(null);

  // get specific post
  const getPost = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${id}`,
    })
      .then((res) => {
        setPost([res.data]);
        setShowError(false);
      })
      .catch((err) => setShowError(true));
  };

  // fetch post on page load
  useEffect(() => {
    getPost();
  }, []);

  // update the reply comment to its new data after being disliked or shared.
  // this allows the dislike and share button to update within the reply modal.
  useEffect(() => {
    if (replyComment) {
      const updatedReplyComment = post.filter((post_) => post_._id === replyComment._id);

      setReplyComment(updatedReplyComment[0]);
    }
  }, [post]);

  const postItems = post.map((post_) => (
    <Post
      postData={post[0]}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPost}
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
          forceUpdate={getPost}
          setModalIsOpen={setModalIsOpen}
          allowComments={false}
        />

        <CreatePostForm
          currentUser={currentUser}
          posts={post}
          textPlaceholder={replyTextPlaceholder}
          buttonText={'Reply'}
          setModalIsOpen={setModalIsOpen}
          isReply={true}
          replyComment={replyComment}
        />
      </Modal>
      <h1 className="main-content-heading">View Post</h1>

      <div className="posts-container">
        {postItems.length > 0 && postItems[0]}
        {showError && (
          <div>
            <h2>Post not found</h2>
            <HiOutlineEmojiSad style={{ fontSize: '50px', marginTop: '15px' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPost;
