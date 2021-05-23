import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import UserPreview from './UserPreview';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const FollowerPage = ({ currentUser, setCurrentUser, selectedTab }) => {
  const profileName = useParams().username;

  // the active tab the user is viewing. eg followers or following
  const [activeTab, setActiveTab] = useState(selectedTab);

  // array of users that is following the profile user
  const [usersFollowers, setUsersFollowers] = useState([]);

  // array of users that the profile user is following
  const [usersFollowing, setUsersFollowing] = useState([]);

  // when unfollowing someone from the followers or following tab, I want the user preview
  // to still show but with the follow button style changed, then when i click between tabs i want
  // the followers / following list to update. after following/ unfollowing, store the
  // newly returned user data in this varaible, then when swapping tabs update profile user
  // to this intermediate user variable.
  const [userData, setUserData] = useState([]);

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
        // res.data is the entire profile user data.
        // sort users alphabeticaly
        setUsersFollowers(
          res.data.followers.sort((a, b) =>
            a.firstName + a.lastName > b.firstName + b.lastName ? 1 : -1
          )
        );
        setUsersFollowing(
          res.data.following.sort((a, b) =>
            a.firstName + a.lastName > b.firstName + b.lastName ? 1 : -1
          )
        );
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // this is for the intermediate user variable
  const getUserData = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/${profileName}/followers`,
    })
      .then((res) => {
        // res.data is the entire profile user data
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (userData.followers) {
      setUsersFollowers(
        userData.followers.sort((a, b) =>
          a.firstName + a.lastName > b.firstName + b.lastName ? 1 : -1
        )
      );
    } else {
      setUsersFollowers([]);
    }

    if (userData.following) {
      setUsersFollowing(
        userData.following.sort((a, b) =>
          a.firstName + a.lastName > b.firstName + b.lastName ? 1 : -1
        )
      );
    } else {
      setUsersFollowing([]);
    }
  }, [activeTab]);

  useEffect(() => {
    getProfileData();
  }, []);

  const followersList = usersFollowers.map((user) => (
    <UserPreview
      currentUser={currentUser}
      user={user}
      key={uuidv4()}
      setCurrentUser={setCurrentUser}
      getProfileData={getProfileData}
      getUserData={getUserData}
    />
  ));

  const followingList = usersFollowing.map((user) => (
    <UserPreview
      currentUser={currentUser}
      user={user}
      key={uuidv4()}
      setCurrentUser={setCurrentUser}
      getUserData={getUserData}
    />
  ));

  return (
    <div>
      <Link to={`/profile/${profileName}`} style={{ color: 'white', textDecoration: 'none' }}>
        <h1 className="main-content-heading">{profileName}</h1>
      </Link>
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
