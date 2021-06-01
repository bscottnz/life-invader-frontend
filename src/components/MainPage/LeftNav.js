import React from 'react';

import { useHistory } from 'react-router-dom';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { BiPlus } from 'react-icons/bi';
import { BiShoppingBag } from 'react-icons/bi';

import logoIcon from '../../images/logo-small.png';

const LeftNav = ({ logOut, currentUser }) => {
  const iconStyle = {
    fontSize: '28px',
  };

  const history = useHistory();

  const goToProfilePage = () => {
    history.push(`/profile/${currentUser.username}`);
  };

  const goToHomePage = () => {
    history.push('/');
  };

  const goToSearchPage = () => {
    history.push('/search');
  };

  const goToStore = () => {
    history.push('/store');
  };

  return (
    <nav className="layout__left-container custom-scroll">
      <div className="layout__left-content custom-scroll">
        <div className="left-nav-logo-container" onClick={goToHomePage}>
          <img src={logoIcon} alt="" />
        </div>

        <div className="left-nav-group" onClick={goToHomePage}>
          <BiHomeAlt style={iconStyle} />
          <h2 className="left-nav-heading">Home</h2>
        </div>
        <div className="left-nav-group" onClick={goToProfilePage}>
          <BiUser style={iconStyle} />
          <h2 className="left-nav-heading">Profile</h2>
        </div>
        <div className="left-nav-group">
          <BiBell style={{ ...iconStyle }} />
          <h2 className="left-nav-heading">Notifications</h2>
        </div>
        <div className="left-nav-group">
          <FiMail style={iconStyle} />
          <h2 className="left-nav-heading">Messages</h2>
        </div>
        <div className="left-nav-group" onClick={goToSearchPage}>
          <BiSearch style={iconStyle} />
          <h2 className="left-nav-heading">Search</h2>
        </div>
        <div className="left-nav-group" onClick={goToStore}>
          <BiShoppingBag style={iconStyle} />
          <h2 className="left-nav-heading">Store</h2>
        </div>
        <div className="left-nav-group" onClick={logOut}>
          <FiLogOut style={iconStyle} />
          <h2 className="left-nav-heading">Logout</h2>
        </div>
        <button className="btn btn-fill new-post">Invade</button>
        <div className="new-post-btn-wrapper">
          <BiPlus style={{ ...iconStyle, fontSize: '32px' }} />
        </div>
      </div>
    </nav>
  );
};

export default LeftNav;
