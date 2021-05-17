import React from 'react';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { BiShoppingBag } from 'react-icons/bi';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

const TopNav = ({ logOut }) => {
  const iconStyles = {
    fontSize: '28px',
    cursor: 'pointer',
  };
  return (
    <nav className="navbar navbar-dropdown">
      <div className="navbar-container">
        <div className="top-nav-group">
          <BiUser style={iconStyles} />
        </div>
        <div className="top-nav-group">
          <BiSearch style={iconStyles} />
        </div>
        <div className="top-nav-group">
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
