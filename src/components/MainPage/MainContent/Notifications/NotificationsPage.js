import React, { useEffect, useState } from 'react';

import { MdPlaylistAddCheck } from 'react-icons/md';

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

  const notificationsList = notificationsData.map((notification) => (
    <NotificationItem notification={notification} key={uuidv4()} />
  ));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="main-content-heading">Notifications</h1>
        <MdPlaylistAddCheck
          className="blue-on-hover"
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={markAllAsRead}
        />
      </div>
      {notificationsData.length > 0 && notificationsList}
    </div>
  );
};

export default NotificationsPage;
