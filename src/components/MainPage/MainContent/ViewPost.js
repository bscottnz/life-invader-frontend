import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';

import { HiOutlineEmojiSad } from 'react-icons/hi';
import DeletePostModal from '../../Modals/DeletePostModal';
import ReplyModal from '../../Modals/ReplyModal';
import LoadingSpinner from '../../LoadingSpinner';

import Post from './Post';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import deletePostRequest from '../../../utils/deletePostRequest';

const ViewPost = ({ currentUser, setCurrentUser }) => {
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

  // display loading spinner while fetching posts
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  // dont show loading spinner when updating posts, just on initail page load
  const isInitialPostFetch = useRef(true);

  // get specific post
  const getPost = () => {
    setIsPostsLoading(true);
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${id}`,
    })
      .then((res) => {
        // console.log(res.data);
        // set the post we are viewing
        setPost([res.data.post]);

        // set the post we are viewing is replying to.
        // the null check is for when we are replying to a deleted post.
        if (
          res.data.replyTo !== undefined &&
          res.data.replyTo !== null &&
          res.data.replyTo._id !== undefined
        ) {
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

        if (isInitialPostFetch.current) {
          isInitialPostFetch.current = false;
        }

        setIsPostsLoading(false);
      })
      .catch((err) => {
        console.log(err);

        // need to reset post data, so that when you delete the subject of a view post page,
        // it doesnt still show the posts as well as the error message.
        setPost([]);
        setReplyingTo(null);
        setPostReplies([]);
        setIsPostsLoading(false);

        setShowError(true);
        // user has been signed out. redirect to home page
        if (err.response && err.response.status == 401) {
          window.location.reload();
        }
      });
  };

  // fetch post on page load
  useEffect(() => {
    getPost();

    return () => {
      // im not sure why i had this, i may need it for something
      // setPost([]);
    };

    // need to update on id because the page doesnt refresh when
    // you view a new post from the view post page
  }, [id]);

  // update the reply comment to its new data after being disliked or shared.
  // this allows the dislike and share button to update within the reply modal.
  // need to seperatley check replyTo, post and post replies for the right comment.

  useEffect(() => {
    if (replyComment) {
      // check the subject post
      // console.log(post[0]);
      if (post.length > 0 && post[0]._id === replyComment._id) {
        setReplyComment(post[0]);
      }
    }
  }, [post]);

  useEffect(() => {
    if (replyComment) {
      // check the comment the subject post is replying to
      if (replyingTo) {
        // if this was the comment we are interacting with in reply modal
        if (replyingTo._id === replyComment._id) {
          setReplyComment(replyingTo);
        }
      }
    }
  }, [replyingTo]);

  useEffect(() => {
    if (replyComment) {
      // check subject post replies
      if (postReplies.length > 0) {
        postReplies.map((reply) => {
          if (reply._id === replyComment._id) {
            setReplyComment(reply);
          }
        });
      }
    }
  }, [postReplies]);

  // delete post
  const deletePost = (id) => {
    deletePostRequest(id, getPost);
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
      <ReplyModal
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        replyComment={replyComment}
        replyHeading={replyHeading}
        replyTextPlaceholder={replyTextPlaceholder}
        getPost={getPost}
      />
      <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />
      <h1 className="main-content-heading">View Post</h1>
      {isPostsLoading && isInitialPostFetch.current && <LoadingSpinner />}

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
