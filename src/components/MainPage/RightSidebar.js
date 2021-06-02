import React, { useState, useEffect } from 'react';

import UserPreview from './MainContent/UserPreview';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const RightSidebar = ({ currentUser, setCurrentUser }) => {
  // array of suggested users to follow
  const [followSuggestions, setFollowSuggestions] = useState([]);

  const getFollowSuggestions = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/suggestions`,
    })
      .then((res) => {
        let followSuggestionResults = res.data;

        // limit suggestions to 3 users at a time
        if (followSuggestionResults.length > 3) {
          followSuggestionResults = followSuggestionResults.slice(0, 3);
        }
        setFollowSuggestions(followSuggestionResults);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // get suggestions on page load
  useEffect(() => {
    getFollowSuggestions();
  }, [currentUser]);

  const userList = followSuggestions.map((user) => (
    <UserPreview
      currentUser={currentUser}
      user={user}
      key={uuidv4()}
      setCurrentUser={setCurrentUser}
      getUserData={() => 1} /* a do nothing function */
      makeSmall={true}
      isSidebar={true}
    />
  ));

  return (
    <section className="layout__right-sidebar-container">
      <div className="layout__right-sidebar custom-scroll">
        {followSuggestions.length > 0 && userList}
      </div>
    </section>
  );
};

export default RightSidebar;
