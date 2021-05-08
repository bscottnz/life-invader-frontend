import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FaRegComment } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import { AiOutlineDislike } from 'react-icons/ai';

import relativeTime from '../../../utils/relativeTime';
import axios from 'axios';

const Post = ({ postData, currentUser }) => {
  // total number of dislikes for the post
  const [numDislikes, setNumDislikes] = useState(0);
  // if the current user has disliked the post
  const [isDisliked, setIsDisliked] = useState(false);

  const [numShares, setNumShares] = useState(0);
  const [isShared, setIsShared] = useState(false);

  // store if the current post is a shared post or original post
  const isRepost = postData.sharedPostData !== undefined;
  // store name of reposter if the post is a repost
  const repostedBy = isRepost ? postData.author.username : null;
  // if post is a repost, set post data to be the data of the original post
  postData = isRepost ? postData.sharedPostData : postData;

  useEffect(() => {
    // set num dislikes
    setNumDislikes(postData.dislikes.length);

    // set if the current user has disliked the post
    setIsDisliked(postData.dislikes.includes(currentUser._id));

    setNumShares(postData.sharedBy.length);
    setIsShared(postData.sharedBy.includes(currentUser._id));
  }, []);

  const dislikePost = () => {
    axios({
      method: 'put',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${postData._id}/dislike`,
    }).then((res) => {
      console.log(res.data);
      setNumDislikes(res.data.dislikes.length);
      setIsDisliked((isDisliked) => !isDisliked);
    });
  };

  const sharePost = () => {
    axios({
      method: 'post',

      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${postData._id}/share`,
    }).then((res) => {
      console.log(res.data);
      setNumShares(res.data.sharedBy.length);
      setIsShared((isShared) => !isShared);
    });
  };

  const postImage = `${process.env.REACT_APP_BASE_URL}${postData.author.profilePic}`;
  const userFullName = `${postData.author.firstName} ${postData.author.lastName}`;
  const timestamp = relativeTime(new Date(), new Date(postData.createdAt));

  const buttonIconStyle = {
    fontSize: '22px',
  };

  const dislikeActiveStyle = {
    color: 'rgb(226, 34, 94)',
    fontSize: '22px',
  };

  const shareActiveStyle = {
    color: 'rgb(22, 191, 99)',
    fontSize: '22px',
  };

  return (
    <div className="post">
      {isRepost && (
        <div className="shared-by-heading">
          <AiOutlineRetweet style={{ marginRight: '4px', transform: 'translateY(2px)' }} />
          Shared by <Link to={`/profile/${repostedBy}`}>@{repostedBy}</Link>
        </div>
      )}
      <div className="main-content-container">
        <div className="user-image-container">
          <img src={postImage} alt="post author profile pic" />
        </div>
        <div className="post-content-container">
          <div className="post-header">
            <span className="display-name">
              <Link to={`/profile/${postData.author.username}`}>{userFullName}</Link>
            </span>
            <span className="username">@{postData.author.username}</span>
            <span className="date">{timestamp}</span>
          </div>
          <div className="post-body">{postData.content}</div>
          <div className="post-footer">
            <div className="post-button-container">
              <button>
                <FaRegComment style={{ fontSize: '18px' }} />
              </button>
            </div>
            <div className="post-button-container">
              <button onClick={sharePost}>
                <AiOutlineRetweet style={isShared ? shareActiveStyle : buttonIconStyle} />
                <span className={`number-shares ${isShared ? 'number-shares-active' : ''}`}>
                  {numShares || ''}
                </span>
              </button>
            </div>
            <div className="post-button-container">
              <button className="dislike-button" onClick={dislikePost}>
                <AiOutlineDislike style={isDisliked ? dislikeActiveStyle : buttonIconStyle} />
                <span className={`number-dislikes ${isDisliked ? 'number-dislikes-active' : ''}`}>
                  {numDislikes || ''}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
