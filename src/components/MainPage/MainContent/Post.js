import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { FaRegComment } from 'react-icons/fa';
import { AiOutlineRetweet } from 'react-icons/ai';
import { AiOutlineDislike } from 'react-icons/ai';

import relativeTime from '../../../utils/relativeTime';
import axios from 'axios';

const Post = ({ postData, currentUser }) => {
  const [numDislikes, setNumDislikes] = useState(0);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    // set num dislikes
    setNumDislikes(postData.dislikes.length);

    // set if the current user has disliked the post
    setIsDisliked(postData.dislikes.includes(currentUser._id));
  }, []);

  const dislikePost = () => {
    axios({
      method: 'put',
      data: {
        content: 'postText',
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts/${postData._id}/dislike`,
    }).then((res) => {
      console.log(res.data);
      setNumDislikes(res.data.dislikes.length);
      setIsDisliked((isDisliked) => !isDisliked);
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

  return (
    <div className="post">
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
              <button>
                <AiOutlineRetweet style={buttonIconStyle} />
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
