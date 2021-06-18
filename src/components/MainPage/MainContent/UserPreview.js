import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';

import { FollowingContext } from '../../MainPage/FollowingContext';

import axios from 'axios';

const UserPreview = ({
  currentUser,
  user,
  showFollowBtn,
  setCurrentUser,
  getUserData,
  makeSmall,
  isSidebar,
  addToChat,
}) => {
  // if the logged in user is following the user in the preview
  const [isFollowing, setIsFollowing] = useState(currentUser.following.includes(user._id));

  const { usersFollowing, setUsersFollowing } = useContext(FollowingContext);

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

        // on the right sidebar it justs gets a new list of people to follow
        getUserData();

        // this updates the main followers page correctly, when following someone
        // via the side bar.
        if (isSidebar) {
          let updatedFollowingList = [...usersFollowing];
          updatedFollowingList.push(user);
          updatedFollowingList.sort((a, b) =>
            a.firstName.toLowerCase() + a.lastName.toLowerCase() >
            b.firstName.toLowerCase() + b.lastName.toLowerCase()
              ? 1
              : -1
          );
          // since i still show users immediatly after they have been unfollowed in the following page,
          // there can be duplicates if adding that user back in via the side bar.

          const seen = new Set();
          updatedFollowingList = updatedFollowingList.filter((el) => {
            const duplicate = seen.has(el._id);
            seen.add(el._id);
            return !duplicate;
          });

          setUsersFollowing(updatedFollowingList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addUser = () => {
    if (addToChat !== null) {
      addToChat(user);
    }
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
    <div
      className="user-preview"
      onClick={addUser}
      style={{ cursor: addToChat !== null ? 'pointer' : 'auto' }}
    >
      {!makeSmall && (
        <div className="user-image-container">
          <img src={user.profilePic.url} alt="user profile picture" />
        </div>
      )}
      <div
        className="user-details-container"
        style={makeSmall ? { paddingLeft: '0', paddingRight: '0' } : {}}
      >
        <div className="header">
          {addToChat === null && (
            <Link
              to={`/profile/${user.username}`}
              style={displayNameStyle}
            >{`${user.firstName} ${user.lastName}`}</Link>
          )}
          {addToChat !== null && (
            <Link
              to="/messages/new"
              style={displayNameStyle}
            >{`${user.firstName} ${user.lastName}`}</Link>
            // <span style={displayNameStyle}>{`${user.firstName} ${user.lastName}`}</span>
          )}

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
  isSidebar: false, // different behaviour for the sidebar user previews
  addToChat: null, // different behaviour for add to chat preview
};

export default UserPreview;
