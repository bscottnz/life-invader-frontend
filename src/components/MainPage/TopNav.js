import React from 'react';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

const toggleDropdown = () => {
  const dropDownMenu = document.querySelector('.navbar-dropdown');
  dropDownMenu.classList.toggle('dropdown-active');
};

const TopNav = () => {
  const iconStyles = {
    fontSize: '28px',
    cursor: 'pointer',
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="top-nav-group">
          <BiHomeAlt style={iconStyles} />
        </div>
        <div className="top-nav-group">
          <BiBell style={iconStyles} />
        </div>
        <div className="top-nav-group">
          <FiMail style={iconStyles} />
        </div>
        <div className="top-nav-group">
          <HiOutlineMenuAlt3 style={iconStyles} onClick={toggleDropdown} />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
