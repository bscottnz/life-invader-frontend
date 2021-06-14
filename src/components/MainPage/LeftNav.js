import React, { useEffect, useState, useContext } from 'react';

import { useHistory, useParams, useLocation } from 'react-router-dom';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { BiPlus } from 'react-icons/bi';
import { BiShoppingBag } from 'react-icons/bi';

import { NotificationsContext } from './NotificationsContext';

import getNumMessages from '../../utils/getNumMessages';
import getNumNotifications from '../../utils/getNumNotifications';

import logoIcon from '../../images/logo-small.png';

const LeftNav = ({ logOut, currentUser }) => {
  const iconStyle = {
    fontSize: '28px',
  };

  const location = useLocation();

  const { numMessages, setNumMessages, numNotifications, setNumNotifications } =
    useContext(NotificationsContext);

  // checks what page you are on, and gives the relevant side bar link active styling
  useEffect(() => {
    const currentPage = location.pathname;

    // first remove all sidebar active classes
    const sideBarElements = document.querySelectorAll('.left-nav-group');
    sideBarElements.forEach((el) => {
      el.classList.remove('left-nav-group__active');
    });

    // check current url against possible sidebar link matches and apply active styling
    const homeLink = document.querySelector('#left-nav-home');
    const profileLink = document.querySelector('#left-nav-profile');
    const notificationsLink = document.querySelector('#left-nav-notifications');
    const messagesLink = document.querySelector('#left-nav-messages');
    const searchLink = document.querySelector('#left-nav-search');
    const storeLink = document.querySelector('#left-nav-store');

    if (currentPage === '/' || currentPage === '/login') {
      //right after logging in, currentPage is still '/login'
      homeLink.classList.add('left-nav-group__active');
    } else if (currentPage.includes('/profile')) {
      profileLink.classList.add('left-nav-group__active');
    } else if (currentPage.includes('/notifications')) {
      notificationsLink.classList.add('left-nav-group__active');
    } else if (currentPage.includes('/messages')) {
      messagesLink.classList.add('left-nav-group__active');
    } else if (currentPage.includes('/search')) {
      searchLink.classList.add('left-nav-group__active');
    } else if (currentPage.includes('/store')) {
      storeLink.classList.add('left-nav-group__active');
    }
  }, [location]);

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

  const goToMessages = () => {
    history.push('/messages');
  };

  const goToNotifications = () => {
    history.push('/notifications');
  };

  useEffect(() => {
    getNumMessages(setNumMessages);
    getNumNotifications(setNumNotifications);
  }, []);

  return (
    <nav className="layout__left-container custom-scroll">
      <div className="layout__left-content custom-scroll">
        <div className="left-nav-logo-container" onClick={goToHomePage}>
          <img src={logoIcon} alt="" />
        </div>

        <div className="left-nav-group" id="left-nav-home" onClick={goToHomePage}>
          <BiHomeAlt style={iconStyle} />
          <h2 className="left-nav-heading">Home</h2>
        </div>
        <div className="left-nav-group" id="left-nav-profile" onClick={goToProfilePage}>
          <BiUser style={iconStyle} />
          <h2 className="left-nav-heading">Profile</h2>
        </div>
        <div className="left-nav-group" id="left-nav-notifications" onClick={goToNotifications}>
          <div className="badge-wrapper">
            <BiBell style={{ ...iconStyle }} />
            <span id="notification-badge" className={numNotifications > 0 ? 'active' : ''}>
              {numNotifications}
            </span>
          </div>
          <h2 className="left-nav-heading">Notifications</h2>
        </div>
        <div className="left-nav-group" id="left-nav-messages" onClick={goToMessages}>
          <div className="badge-wrapper">
            <FiMail style={iconStyle} />
            <span id="messages-badge" className={numMessages > 0 ? 'active' : ''}>
              {numMessages}
            </span>
          </div>
          <h2 className="left-nav-heading">Messages</h2>
        </div>
        <div className="left-nav-group" id="left-nav-search" onClick={goToSearchPage}>
          <BiSearch style={iconStyle} />
          <h2 className="left-nav-heading">Search</h2>
        </div>
        <div className="left-nav-group" id="left-nav-store" onClick={goToStore}>
          <BiShoppingBag style={iconStyle} />
          <h2 className="left-nav-heading">Store</h2>
        </div>
        <div className="left-nav-group" onClick={logOut} style={{ marginBottom: '5px' }}>
          <FiLogOut style={iconStyle} />
          <h2 className="left-nav-heading">Logout</h2>
        </div>
        {/* I may want to add this add post button back to the side bar at some point */}
        {/* <button className="btn btn-fill new-post">Invade</button>
        <div className="new-post-btn-wrapper">
          <BiPlus style={{ ...iconStyle, fontSize: '32px' }} />
        </div> */}
      </div>
    </nav>
  );
};

export default LeftNav;
