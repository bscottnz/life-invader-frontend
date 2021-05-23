import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import axios from 'axios';

const FollowerPage = ({ selectedTab }) => {
  const profileName = useParams().username;

  // the active tab the user is viewing. eg followers or following
  const [activeTab, setActiveTab] = useState(selectedTab);

  // array of users that is following the profile user
  const [usersFollowers, setUsersFollowers] = useState([]);

  // array of users that the profile user is following
  const [usersFollowing, setUsersFollowing] = useState([]);

  const setActiveTabFollowing = () => {
    setActiveTab('Following');
  };

  const setActiveTabFollowers = () => {
    setActiveTab('Followers');
  };

  const getProfileData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/${profileName}/followers`,
    })
      .then((res) => {
        // res.data is the entire profile user data
        setUsersFollowers(res.data.followers);
        setUsersFollowing(res.data.following);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  return (
    <div>
      <h1 className="main-content-heading">{profileName}</h1>
      <div className="tabs-container">
        <div
          className={`tab ${activeTab === 'Following' ? 'active' : ''}`}
          onClick={setActiveTabFollowing}
        >
          Stalking
        </div>
        <div
          className={`tab ${activeTab === 'Followers' ? 'active' : ''}`}
          onClick={setActiveTabFollowers}
        >
          Stalkers
        </div>
      </div>
    </div>
  );
};

FollowerPage.defaultProps = {
  selectedTab: 'Following', // the default tab the page should show
};

export default FollowerPage;
