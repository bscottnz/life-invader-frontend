import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

import { HiOutlineEmojiSad } from 'react-icons/hi';
import { FiMail } from 'react-icons/fi';

const ProfilePage = ({ currentUser }) => {
  // const [profileUsername, setProfileUsername] = useState('');

  const profileName = useParams().username;

  // profile user data for the profile page
  const [profileUser, setProfileUser] = useState(null);

  // if the logged in user is following the profile we are viewing
  const [isFollowing, setIsFollowing] = useState(false);

  // show error message if no user is returned
  const [showError, setShowError] = useState(false);

  const getProfileData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/profile/${profileName}`,
    })
      .then((res) => {
        setShowError(false);
        setProfileUser(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setShowError(true);
      });
  };

  useEffect(() => {
    getProfileData();
  }, [profileName]);

  return (
    <div>
      <h1 className="main-content-heading">{profileName}</h1>
      {profileUser !== null && (
        <div className="profile-header-container">
          <div className="cover-photo-container">
            <div className="user-image-container">
              <img
                src={process.env.REACT_APP_BASE_URL + profileUser.profilePic}
                alt="profile pic"
              />
            </div>
          </div>
          <div className="profile-btns-container">
            {profileUser._id !== currentUser._id && (
              <>
                <Link to={`/messages/${profileUser._id}`}>
                  <FiMail />
                </Link>
                <button className={isFollowing ? 'follow-btn following' : 'follow-btn'}>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {showError && (
        <div>
          <h2>User not found</h2>
          <HiOutlineEmojiSad style={{ fontSize: '50px', marginTop: '15px' }} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
