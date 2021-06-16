import React, { useEffect, useState, useContext, useRef } from 'react';

import { MdPlaylistAddCheck } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';

import NotificationItem from './NotificationItem';

import { NotificationsContext } from '../../NotificationsContext';

import notificationsController from '../../../../notifications';
import getNumNotifications from '../../../../utils/getNumNotifications';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import sockets from '../../../../sockets';
import LoadingSpinner from '../../../LoadingSpinner';

const NotificationsPage = () => {
  const [notificationsData, setNotificationsData] = useState([]);

  const [noNotifications, setNoNotifications] = useState(null);

  const { setNumNotifications } = useContext(NotificationsContext);

  // display loading spinner while fetching posts
  const [isPostsLoading, setIsPostsLoading] = useState(false);
  // dont show loading spinner when updating posts, just on initail page load
  const isInitialPostFetch = useRef(true);

  useEffect(() => {
    getNotifications();
  }, []);

  // update new notification if user is on notifications page
  useEffect(() => {
    sockets.socket.on('notification received', () => {
      getNotifications();
    });
  }, []);

  const getNotifications = () => {
    setIsPostsLoading(true);
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/notifications/`,
    })
      .then((res) => {
        setNotificationsData(res.data);
        if (res.data.length === 0) {
          setNoNotifications(true);
        } else {
          setNoNotifications(false);
        }
        setIsPostsLoading(false);

        if (isInitialPostFetch.current) {
          isInitialPostFetch.current = false;
        }
      })
      .catch((err) => {
        console.log(err);
        setIsPostsLoading(false);
      });
  };

  const markAllAsRead = () => {
    // const unMarkActive = () => {
    //   const notifications = document.querySelectorAll('.notification.active');
    //   notifications.forEach((notif) => {
    //     // notif.classList.remove('active');
    //     // need to do inline stlying or it doesnt persist for some reason.
    //     notif.style.borderLeft = 'none';
    //   });
    // };

    notificationsController.markAsRead(null, getNotifications);

    getNumNotifications(setNumNotifications);
    setTimeout(() => {
      // sometimes it wont clear the notifiaction from the side bar without this
      getNumNotifications(setNumNotifications);
    }, 0);
  };

  const deleteNotifications = () => {
    axios({
      method: 'delete',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/notifications/`,
    })
      .then((res) => {
        setNotificationsData([]);
        setNoNotifications(true);
        getNumNotifications(setNumNotifications);
      })
      .catch((err) => console.log(err));
  };

  const notificationsList = notificationsData.map((notification) => (
    <NotificationItem notification={notification} key={uuidv4()} />
  ));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '100%' }}>
        <h1 className="main-content-heading">Notifications</h1>
        <div className="notifications-heading-btns-container">
          <MdPlaylistAddCheck
            className="blue-on-hover"
            style={{ fontSize: '24px', cursor: 'pointer' }}
            onClick={markAllAsRead}
          />
          <RiDeleteBinLine
            className="blue-on-hover"
            style={{ fontSize: '22px', cursor: 'pointer', marginLeft: '16px' }}
            onClick={deleteNotifications}
          />
        </div>
      </div>
      {isPostsLoading && isInitialPostFetch.current && <LoadingSpinner />}
      {notificationsData.length > 0 && notificationsList}
      {noNotifications && (
        <div>
          <p style={{ fontSize: '16px' }}>No notifications</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
