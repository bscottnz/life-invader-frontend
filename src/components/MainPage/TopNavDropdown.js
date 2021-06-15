import React from 'react';

import { useHistory } from 'react-router-dom';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { BiShoppingBag } from 'react-icons/bi';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

const TopNav = ({ logOut, currentUser }) => {
  const iconStyles = {
    fontSize: '28px',
    cursor: 'pointer',
  };

  const history = useHistory();

  const goToProfilePage = () => {
    history.push(`/profile/${currentUser.username}`);
  };

  const goToSearchPage = () => {
    history.push('/search');
  };

  const goToStore = () => {
    history.push('/store');
  };

  return (
    <nav className="navbar navbar-dropdown">
      <div className="navbar-container">
        <div className="top-nav-group" onClick={goToProfilePage}>
          <BiUser style={iconStyles} />
        </div>
        <div className="top-nav-group" onClick={goToSearchPage}>
          <BiSearch style={iconStyles} />
        </div>
        <div className="top-nav-group top-nav-group-shop" onClick={goToStore}>
          <BiShoppingBag style={iconStyles} />
        </div>
        <div className="top-nav-group" onClick={logOut}>
          <FiLogOut style={iconStyles} />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
