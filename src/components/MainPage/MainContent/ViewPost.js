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

  // the post we are currently viewing
  const [post, setPost] = useState([]);

  // the post this post is replying to, if this post is a reply
  const [replyingTo, setReplyingTo] = useState(null);

  // the replies to this post we are viewing
  const [postReplies, setPostReplies] = useState([]);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  // show error message if no post is returned
  const [showError, setShowError] = useState(false);

  // keep track of which comment is being replied to in the modal
  const [replyComment, setReplyComment] = useState(null);

  // get specific post
  const getPost = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${id}`,
    })
      .then((res) => {
        console.log(res.data);
        // set the post we are viewing
        setPost([res.data.post]);

        // set the post we are viewing is replying to
        if (res.data.replyTo !== undefined && res.data.replyTo._id !== undefined) {
          setReplyingTo(res.data.replyTo);
        } else {
          // in the case when switching between view post pages,
          // we need to reset this so if we view a comment that is not a reply,
          // it wont still show the previous reply that was loaded
          setReplyingTo(null);
        }

        // set any replies to the post we are viewing
        setPostReplies(res.data.replies);

        // turn off the error
        setShowError(false);
      })
      .catch((err) => setShowError(true));
  };

  // fetch post on page load
  useEffect(() => {
    getPost();
    // need to update on id because the page doesnt refresh when
    // you view a new post from the view post page
  }, [id]);

  // update the reply comment to its new data after being disliked or shared.
  // this allows the dislike and share button to update within the reply modal.
  useEffect(() => {
    if (replyComment) {
      const updatedReplyComment = post.filter((post_) => post_._id === replyComment._id);

      setReplyComment(updatedReplyComment[0]);
    }
  }, [post]);

  const postItem = post.map((post_) => (
    <Post
      postData={post[0]}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPost}
      setModalIsOpen={setModalIsOpen}
      setReplyComment={setReplyComment}
      makeBig={true}
    />
  ));

  const postReplyItems = postReplies.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPost}
      setModalIsOpen={setModalIsOpen}
      setReplyComment={setReplyComment}
    />
  ));
  postReplyItems.reverse();

  const replyToItem =
    replyingTo !== null ? (
      <Post
        postData={replyingTo}
        currentUser={currentUser}
        key={uuidv4()}
        forceUpdate={getPost}
        setModalIsOpen={setModalIsOpen}
        setReplyComment={setReplyComment}
      />
    ) : null;

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
          forceUpdate={getPost}
        />
      </Modal>
      <h1 className="main-content-heading">View Post</h1>

      <div className="posts-container">
        {replyToItem}
        {postItem.length > 0 && postItem[0]}
        {postReplies.length > 0 && postReplyItems}
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
