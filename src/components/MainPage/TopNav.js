import React from 'react';

import { useHistory } from 'react-router-dom';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

const TopNav = ({ toggleDropdown }) => {
  const iconStyles = {
    fontSize: '28px',
    cursor: 'pointer',
  };

  const history = useHistory();

  const goToHomePage = () => {
    history.push(`/`);
    toggleDropdown(true);
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="top-nav-group">
          <BiHomeAlt style={iconStyles} onClick={goToHomePage} />
        </div>
        <div className="top-nav-group">
          <BiBell style={iconStyles} />
        </div>
        <div className="top-nav-group">
          <FiMail style={iconStyles} />
        </div>
        <div className="top-nav-group">
          <HiOutlineMenuAlt3 style={iconStyles} onClick={(e) => toggleDropdown()} />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
