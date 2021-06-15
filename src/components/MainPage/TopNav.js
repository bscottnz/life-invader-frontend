import React, { useContext, useEffect } from 'react';

import { useHistory } from 'react-router-dom';

import { BiHomeAlt } from 'react-icons/bi';
import { BiUser } from 'react-icons/bi';
import { BiBell } from 'react-icons/bi';
import { FiMail } from 'react-icons/fi';
import { BiSearch } from 'react-icons/bi';
import { FiLogOut } from 'react-icons/fi';
import { HiOutlineMenuAlt3 } from 'react-icons/hi';

import { NotificationsContext } from './NotificationsContext';

import getNumMessages from '../../utils/getNumMessages';
import getNumNotifications from '../../utils/getNumNotifications';

const TopNav = ({ toggleDropdown }) => {
  const { numMessages, setNumMessages, numNotifications, setNumNotifications } =
    useContext(NotificationsContext);

  const iconStyles = {
    fontSize: '28px',
    cursor: 'pointer',
  };

  const history = useHistory();

  const goToHomePage = () => {
    history.push(`/`);
    toggleDropdown(true);
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
    <nav className="navbar">
      <div className="navbar-container">
        <div className="top-nav-group">
          <BiHomeAlt style={iconStyles} onClick={goToHomePage} />
        </div>
        <div className="top-nav-group" onClick={goToNotifications}>
          <div className="badge-wrapper">
            <BiBell style={iconStyles} />
            <span id="notification-badge" className={numNotifications > 0 ? 'active' : ''}>
              {numNotifications}
            </span>
          </div>
        </div>
        <div className="top-nav-group top-nav-group-mail" onClick={goToMessages}>
          <div className="badge-wrapper">
            <FiMail style={iconStyles} />
            <span id="messages-badge" className={numMessages > 0 ? 'active' : ''}>
              {numMessages}
            </span>
          </div>
        </div>
        <div className="top-nav-group">
          <HiOutlineMenuAlt3 style={iconStyles} onClick={(e) => toggleDropdown()} />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
