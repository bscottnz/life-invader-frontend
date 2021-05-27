import React, { useState } from 'react';

const SearchPage = () => {
  // the active tab the user is viewing. eg posts or users
  const [activeTab, setActiveTab] = useState('Posts');

  const setActiveTabPosts = () => {
    setActiveTab('Posts');
  };

  const setActiveTabUsers = () => {
    setActiveTab('Users');
  };

  return (
    <div>
      <h1 className="main-content-heading">Search</h1>
      <div className="tabs-container">
        <div className={`tab ${activeTab === 'Posts' ? 'active' : ''}`} onClick={setActiveTabPosts}>
          Posts
        </div>
        <div className={`tab ${activeTab === 'Users' ? 'active' : ''}`} onClick={setActiveTabUsers}>
          Users
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
