import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios';

const UserPreview = ({
  currentUser,
  user,
  showFollowBtn,
  setCurrentUser,
  getUserData,
  makeSmall,
}) => {
  // if the logged in user is following the user in the preview
  const [isFollowing, setIsFollowing] = useState(currentUser.following.includes(user._id));

  const followUser = () => {
    axios({
      method: 'put',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/${user._id}/follow`,
    })
      .then((res) => {
        // res.data is the newly updated current user
        setCurrentUser(res.data);

        setIsFollowing(res.data.following.includes(user._id));

        // this updates the intermediate user data varaible on the follower page.
        // then when i switch tabs this intermediate data overwrites the exsisting user data
        getUserData();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // this fixes a memory leak
  useEffect(() => {
    return () => {
      setIsFollowing(currentUser.following.includes(user._id));
    };
  }, []);

  // special gold name styling just for my profile
  const displayNameStyle = {};
  if (user && user.goldenName) {
    displayNameStyle.color = 'goldenrod';
  }

  let followBtn = null;
  if (showFollowBtn && user._id !== currentUser._id) {
    followBtn = (
      <div className="follow-btn-container">
        <button
          className={isFollowing ? 'follow-btn following' : 'follow-btn'}
          onClick={followUser}
        >
          {isFollowing ? 'Stalking' : 'Stalk'}
        </button>
      </div>
    );
  }

  return (
    <div className="user-preview">
      {!makeSmall && (
        <div className="user-image-container">
          <img src={process.env.REACT_APP_BASE_URL + user.profilePic} alt="user profile picture" />
        </div>
      )}
      <div className="user-details-container" style={makeSmall ? { paddingLeft: '0' } : {}}>
        <div className="header">
          <Link
            to={`/profile/${user.username}`}
            style={displayNameStyle}
          >{`${user.firstName} ${user.lastName}`}</Link>
          {makeSmall && <br></br>}
          <span
            className="username"
            style={makeSmall ? { marginLeft: '0' } : {}}
          >{`@${user.username}`}</span>
        </div>
      </div>
      {showFollowBtn && followBtn}
    </div>
  );
};

UserPreview.defaultProps = {
  showFollowBtn: true, // show a follow button or not
  makeSmall: false, // show a condensed preview (no picture)
};

export default UserPreview;
