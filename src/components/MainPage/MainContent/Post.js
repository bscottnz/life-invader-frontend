import React from 'react';
import { Link } from 'react-router-dom';

import { MdChatBubbleOutline } from 'react-icons/md';
import { AiOutlineRetweet } from 'react-icons/ai';
import { AiOutlineDislike } from 'react-icons/ai';

import relativeTime from '../../../utils/relativeTime';

const Post = ({ postData }) => {
  const postImage = `${process.env.REACT_APP_BASE_URL}${postData.author.profilePic}`;
  const userFullName = `${postData.author.firstName} ${postData.author.lastName}`;
  const timestamp = relativeTime(new Date(), new Date(postData.createdAt));
  const buttonIconStyle = {
    fontSize: '20px',
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
                <MdChatBubbleOutline style={buttonIconStyle} />
              </button>
            </div>
            <div className="post-button-container">
              <button>
                <AiOutlineRetweet style={buttonIconStyle} />
              </button>
            </div>
            <div className="post-button-container">
              <button>
                <AiOutlineDislike style={buttonIconStyle} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
