import React, { useState } from 'react';

import { BiSearch } from 'react-icons/bi';

const SearchPage = () => {
  // the active tab the user is viewing. eg posts or users
  const [activeTab, setActiveTab] = useState('Posts');

  const [searchText, setSearchText] = useState('');

  const setActiveTabPosts = () => {
    setActiveTab('Posts');
  };

  const setActiveTabUsers = () => {
    setActiveTab('Users');
  };

  return (
    <div>
      <h1 className="main-content-heading">Search</h1>
      <div className="search-container">
        <BiSearch />
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder={`Search ${activeTab === 'Posts' ? 'posts' : 'users'}`}
        />
      </div>
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
