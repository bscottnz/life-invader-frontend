import React from 'react';
import { Link } from 'react-router-dom';

const UserPreview = ({ user }) => {
  return (
    <div className="user-preview">
      <div className="user-image-container">
        <img src={process.env.REACT_APP_BASE_URL + user.profilePic} alt="user profile picture" />
      </div>
      <div className="user-details-container">
        <div className="header">
          <Link to={`/profile/${user.username}`}>{`${user.firstName} ${user.lastName}`}</Link>
          <span className="username">{`@${user.username}`}</span>
        </div>
      </div>
    </div>
  );
};

export default UserPreview;
