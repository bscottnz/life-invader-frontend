import React, { useContext, useEffect } from 'react';

import NotificationItem from './MainPage/MainContent/Notifications/NotificationItem';
import { NotificationsPopupContext } from './MainPage/NotificationsPopupContext';

const NotificationPopup = () => {
  const { currentNotification, notificationIsOpen, setNotificationIsOpen } =
    useContext(NotificationsPopupContext);

  let notificationType;

  if (currentNotification && currentNotification.notificationType !== undefined) {
    notificationType = currentNotification.notificationType;
  }

  // add or remove visible class to the notification popup
  useEffect(() => {
    const popup = document.querySelector('.notification-item-popup');
    if (!notificationIsOpen) {
      if (popup) {
        popup.classList.remove('notification-item-popup-fade');
      }
    } else {
      if (popup) {
        popup.classList.add('notification-item-popup-fade');
      }
    }
  }, [notificationIsOpen]);

  // after the current notification has been updated and the notification is open,
  // set a timer for 5s to close the notification. if the notification updates
  // during this time, reset the notification.
  useEffect(() => {
    let timer;
    if (notificationIsOpen) {
      timer = setTimeout(() => {
        setNotificationIsOpen(false);
      }, 5000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [currentNotification]);

  if (
    currentNotification &&
    (notificationType === 'like' || notificationType === 'share' || notificationType === 'reply')
  ) {
    return <NotificationItem notification={currentNotification} isPopup={true} />;
  }

  return null;
};

export default NotificationPopup;
