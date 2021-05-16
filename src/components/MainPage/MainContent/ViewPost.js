import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { HiOutlineEmojiSad } from 'react-icons/hi';
import DeletePostModal from '../../Modals/DeletePostModal';
import CreatePostModal from '../../Modals/CreatePostModal';

import Post from './Post';

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

  // show error message if no post is returned
  const [showError, setShowError] = useState(false);

  // keep track of which comment is being replied to in the modal
  const [replyComment, setReplyComment] = useState(null);

  // keep track of which comment is being deleted
  const [deleteComment, setDeleteComment] = useState(null);

  // get specific post
  const getPost = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${id}`,
    })
      .then((res) => {
        // console.log(res.data);
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

    return () => {
      setPost([]);
    };

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

  // delete post
  const deletePost = (id) => {
    console.log(id);
  };

  const postItem = post.map((post_) => (
    <Post
      postData={post[0]}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPost}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
      makeBig={true}
    />
  ));

  const postReplyItems = postReplies.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getPost}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
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
        setReplyComment={setReplyComment}
        setDeleteComment={setDeleteComment}
      />
    ) : null;

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
      <CreatePostModal
        currentUser={currentUser}
        replyComment={replyComment}
        replyHeading={replyHeading}
        replyTextPlaceholder={replyTextPlaceholder}
        getPost={getPost}
        post={post}
      />
      <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />
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
