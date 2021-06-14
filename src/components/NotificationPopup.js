import React, { useContext } from 'react';

import NotificationItem from './MainPage/MainContent/Notifications/NotificationItem';
import { NotificationsPopupContext } from './MainPage/NotificationsPopupContext';

const NotificationPopup = () => {
  const { currentNotification } = useContext(NotificationsPopupContext);

  let notificationType;

  if (currentNotification && currentNotification.notificationType !== undefined) {
    notificationType = currentNotification.notificationType;
  }

  if (currentNotification && notificationType === 'like') {
    return <NotificationItem notification={currentNotification} isPopup={true} />;
  }

  return (
    <div id="notification-popup">
      <h1>{notificationType}</h1>
    </div>
  );
};

export default NotificationPopup;
