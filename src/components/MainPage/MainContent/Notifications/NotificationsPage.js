import React, { useEffect, useState } from 'react';

import NotificationItem from './NotificationItem';

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

  const notificationsList = notificationsData.map((notification) => (
    <NotificationItem notification={notification} key={uuidv4()} />
  ));

  return (
    <div>
      <h1 className="main-content-heading">Notifications</h1>
      {notificationsData.length > 0 && notificationsList}
    </div>
  );
};

export default NotificationsPage;
