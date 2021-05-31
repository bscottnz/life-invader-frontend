import React from 'react';
import { useContext } from 'react';
import { BrowserRouter as Router, Link, useHistory } from 'react-router-dom';

import { ModalContext } from '../../Modals/ModalContext';

import { FaRegComment } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import { AiOutlineDislike } from 'react-icons/ai';
import { IoCloseOutline } from 'react-icons/io5';
import { AiOutlinePushpin } from 'react-icons/ai';

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
  showPin,
  showPinHeading,
}) => {
  const {
    setDeleteModalIsOpen,
    setModalIsOpen,
    setPinModalIsOpen,
    setUnPinModalIsOpen,
    setPinPostId,
  } = useContext(ModalContext);

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

  // if the current user has commented on the post
  const isCommentedOn = postData.replies.some((reply) => reply.author === currentUser._id);

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

  const openPinModal = (e) => {
    e.stopPropagation();
    setPinPostId(postData._id);
    setPinModalIsOpen(true);
  };

  const unpin = (e) => {
    e.stopPropagation();
    setPinPostId(postData._id);
    setUnPinModalIsOpen(true);
  };

  const buttonIconStyle = {
    fontSize: makeBig ? '30px' : '22px',
  };

  // comment button needs to be smaller since the icon is larger than the others
  const commentIconStyle = {
    fontSize: makeBig ? '24px' : '18px',
  };

  const commentActiveStyle = {
    color: 'rgb(29, 161, 242)',
    fontSize: makeBig ? '24px' : '18px',
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
    fontSize: '18px',
  };

  // special gold name styling just for my profile
  const displayNameStyle = {};
  if (postData.author.goldenName) {
    displayNameStyle.color = 'rgb(240, 173, 1)';
  }

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

      {isReply && postData.replyTo !== null && postData.replyTo._id && (
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
      {/* this is for when the post is a reply to a deleted post */}
      {isReply && postData.replyTo === null && (
        <div className="shared-by-heading">
          <FaRegComment style={{ marginRight: '4px', transform: 'translateY(2px)' }} />
          Replying to DELETED POST{' '}
        </div>
      )}
      {/* pinned post heading */}
      {postData.pinned && !isRepost && showPinHeading && (
        <div className="shared-by-heading">
          <AiOutlinePushpin style={{ marginRight: '4px', transform: 'translateY(1px)' }} />
          Pinned post
        </div>
      )}
      <div className="main-content-container">
        <div className="user-image-container">
          <img src={postImage} alt="post author profile pic" />
        </div>
        <div className="post-content-container">
          <div className="post-header">
            <span className="display-name" onClick={(e) => setModalIsOpen(false)}>
              <Link to={`/profile/${postData.author.username}`} style={displayNameStyle}>
                {userFullName}
              </Link>
            </span>
            <span className="username">@{postData.author.username}</span>

            {/* only show delete if it is not a repost, since that would delete the original
            post as the repost data is copied over to the repost */}
            {isCurrentUsersPost && !isRepost && isDeletable && (
              <div style={{ marginLeft: 'auto', display: 'flex' }}>
                {showPin && (
                  <div className="delete-post-btn">
                    <AiOutlinePushpin
                      onClick={postData.pinned === true ? unpin : openPinModal}
                      style={postData.pinned === true ? { color: 'rgb(226, 34, 94)' } : {}}
                    />
                  </div>
                )}
                <div className="delete-post-btn" style={{ marginLeft: '10px' }}>
                  <IoCloseOutline style={deleteBtnStyle} onClick={openDeleteModal} />{' '}
                </div>
              </div>
            )}
          </div>
          <div
            className="post-body"
            style={{ whiteSpace: 'pre-wrap', fontSize: makeBig ? '24px' : '16px' }}
          >
            {postData.content}
          </div>
          <div className="date">{timestamp}</div>
          <div className="post-footer">
            <div className="post-button-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openReplyModal(postData);
                }}
              >
                <FaRegComment style={isCommentedOn ? commentActiveStyle : commentIconStyle} />
                <span
                  className={`number-comments ${isCommentedOn ? 'number-comments-active' : ''}`}
                  style={{ fontSize: makeBig ? '24px' : '16px', marginLeft: '5px' }}
                >
                  {postData.replies.length || ''}
                </span>
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
  showPin: false, // only show pin on profile page
  showPinHeading: false, // need a seperate flag for heading to be able to see the heading on other profiles
};

export default Post;
