import React, { useEffect, useState } from 'react';

import { MdPlaylistAddCheck } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';

import NotificationItem from './NotificationItem';

import notificationsController from '../../../../notifications';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const NotificationsPage = () => {
  const [notificationsData, setNotificationsData] = useState([]);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/notifications/`,
    })
      .then((res) => {
        setNotificationsData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const markAllAsRead = () => {
    notificationsController.markAsRead();

    const notifications = document.querySelectorAll('.notification.active');
    notifications.forEach((notif) => {
      notif.classList.remove('active');
    });
  };

  const deleteNotifications = () => {
    axios({
      method: 'delete',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/notifications/`,
    })
      .then((res) => setNotificationsData([]))
      .catch((err) => console.log(err));
  };

  const notificationsList = notificationsData.map((notification) => (
    <NotificationItem notification={notification} key={uuidv4()} />
  ));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
      {notificationsData.length > 0 && notificationsList}
    </div>
  );
};

export default NotificationsPage;
