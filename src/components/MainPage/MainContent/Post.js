import React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
} from 'react-router-dom';

import { ModalContext } from '../../Modals/ModalContext';

import { FaRegComment } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import { AiOutlineDislike } from 'react-icons/ai';
import { RiDeleteBin2Fill } from 'react-icons/ri';

import relativeTime from '../../../utils/relativeTime';
import axios from 'axios';

const Post = ({
  postData,
  currentUser,
  forceUpdate,
  setReplyComment,
  setDeleteComment,
  allowComments,
  makeBig,
  isDeletable,
}) => {
  const { setDeleteModalIsOpen, setModalIsOpen } = useContext(ModalContext);

  // is the post written by the current user
  const isCurrentUsersPost = postData.author._id === currentUser._id;

  // store if the current post is a shared post or original post
  const isRepost = postData.sharedPostData !== undefined;

  const isReply = postData.replyTo !== undefined;

  // store name of reposter if the post is a repost
  const repostedBy = isRepost ? postData.author.username : null;

  // if post is a repost, set post data to be the data of the original post
  postData = isRepost ? postData.sharedPostData : postData;

  // if the current user dislikes the post or not
  const isDisliked = postData.dislikes.includes(currentUser._id);

  // if the current user has shared the post or not
  const isShared = postData.sharedBy.includes(currentUser._id);

  // url of the post author display picture
  const postImage = `${process.env.REACT_APP_BASE_URL}${postData.author.profilePic}`;

  // combine author names into full name
  const userFullName = `${postData.author.firstName} ${postData.author.lastName}`;

  // convert the post date to a relative time, eg '2 hours ago'
  const timestamp = relativeTime(new Date(), new Date(postData.createdAt));

  const history = useHistory();

  const dislikePost = (e) => {
    e.stopPropagation();
    axios({
      method: 'put',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${postData._id}/dislike`,
    }).then((res) => {
      //rerender posts
      forceUpdate();
    });
  };

  const sharePost = (e) => {
    e.stopPropagation();
    axios({
      method: 'post',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${postData._id}/share`,
    }).then((res) => {
      // rerender posts
      forceUpdate();
    });
  };

  const openReplyModal = (postData) => {
    // only open modal if the modal is not already open.
    // otherwise close the modal
    if (allowComments) {
      setReplyComment(postData);
      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  };

  const viewPost = (e) => {
    // only redirect to post page if the user is not clicking a link.
    // buttons are handled in their own click events with stopPropogation()
    if (postData._id !== undefined && e.target.tagName != 'A') {
      setModalIsOpen(false);
      history.push(`/post/${postData._id}`);
    }
  };

  const openDeleteModal = (e) => {
    e.stopPropagation();
    setDeleteComment(postData._id);
    setDeleteModalIsOpen(true);
  };

  const buttonIconStyle = {
    fontSize: makeBig ? '30px' : '22px',
  };

  const dislikeActiveStyle = {
    color: 'rgb(226, 34, 94)',
    fontSize: makeBig ? '30px' : '22px',
  };

  const shareActiveStyle = {
    color: 'rgb(22, 191, 99)',
    fontSize: makeBig ? '30px' : '22px',
  };

  const deleteBtnStyle = {
    color: 'inherit',
  };

  return (
    <div className="post" onClick={viewPost}>
      {isRepost && (
        <div className="shared-by-heading">
          <AiOutlineRetweet style={{ marginRight: '4px', transform: 'translateY(2px)' }} />
          Shared by{' '}
          <Link
            to={`/profile/${repostedBy}`}
            onClick={(e) => setModalIsOpen(false)}
            style={{ color: 'rgb(29, 161, 242)' }}
          >
            @{repostedBy}
          </Link>
        </div>
      )}

      {isReply && postData.replyTo._id && (
        <div className="shared-by-heading">
          <FaRegComment style={{ marginRight: '4px', transform: 'translateY(2px)' }} />
          Replying to{' '}
          <Link
            to={`/profile/${postData.replyTo.author.username}`}
            onClick={(e) => setModalIsOpen(false)}
            style={{ color: 'rgb(29, 161, 242)' }}
          >
            @{postData.replyTo.author.username}
          </Link>
        </div>
      )}
      <div className="main-content-container">
        <div className="user-image-container">
          <img src={postImage} alt="post author profile pic" />
        </div>
        <div className="post-content-container">
          <div className="post-header">
            <span className="display-name" onClick={(e) => setModalIsOpen(false)}>
              <Link to={`/profile/${postData.author.username}`}>{userFullName}</Link>
            </span>
            <span className="username">@{postData.author.username}</span>
            <span className="date">{timestamp}</span>
            {/* only show delete if it is not a repost, since that would delete the original
            post as the repost data is copied over to the repost */}
            {isCurrentUsersPost && !isRepost && isDeletable && (
              <div className="delete-post-btn">
                <RiDeleteBin2Fill style={deleteBtnStyle} onClick={openDeleteModal} />{' '}
              </div>
            )}
          </div>
          <div
            className="post-body"
            style={{ whiteSpace: 'pre-wrap', fontSize: makeBig ? '24px' : '16px' }}
          >
            {postData.content}
          </div>
          <div className="post-footer">
            <div className="post-button-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openReplyModal(postData);
                }}
              >
                <FaRegComment style={{ fontSize: makeBig ? '26px' : '18px' }} />
              </button>
            </div>
            <div className="post-button-container post-button-container-share">
              <button onClick={sharePost}>
                <AiOutlineRetweet style={isShared ? shareActiveStyle : buttonIconStyle} />
                <span
                  className={`number-shares ${isShared ? 'number-shares-active' : ''}`}
                  style={{ fontSize: makeBig ? '24px' : '16px' }}
                >
                  {postData.sharedBy.length || ''}
                </span>
              </button>
            </div>
            <div className="post-button-container post-button-container-dislike">
              <button className="dislike-button" onClick={dislikePost}>
                <AiOutlineDislike style={isDisliked ? dislikeActiveStyle : buttonIconStyle} />
                <span
                  className={`number-dislikes ${isDisliked ? 'number-dislikes-active' : ''}`}
                  style={{ fontSize: makeBig ? '24px' : '16px' }}
                >
                  {postData.dislikes.length || ''}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Post.defaultProps = {
  allowComments: true, // i cant remember what this is for, but it is important. i think its to do with commenting from within a modal
  makeBig: false, // this is to make the text and buttons of a post bigger
  isDeletable: true, // this is to not allow deleting from within a modal. i could have multiple modals up but this is easier
};

export default Post;
