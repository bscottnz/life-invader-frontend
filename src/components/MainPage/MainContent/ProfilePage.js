import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { useParams } from 'react-router-dom';

import { HiOutlineEmojiSad } from 'react-icons/hi';

const ProfilePage = () => {
  // const [profileUsername, setProfileUsername] = useState('');

  const profileName = useParams().username;

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
