import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import UserPreview from './UserPreview';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProfileData();
  }, []);

  const followersList = usersFollowers.map((user) => <UserPreview user={user} key={uuidv4()} />);

  const followingList = usersFollowing.map((user) => <UserPreview user={user} key={uuidv4()} />);

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
      {usersFollowers.length > 0 && activeTab === 'Followers' && followersList}
      {usersFollowing.length > 0 && activeTab === 'Following' && followingList}
    </div>
  );
};

FollowerPage.defaultProps = {
  selectedTab: 'Following', // the default tab the page should show
};

export default FollowerPage;
