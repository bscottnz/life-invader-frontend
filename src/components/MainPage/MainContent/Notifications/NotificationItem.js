import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { NotificationsContext } from '../../NotificationsContext';
import { NotificationsPopupContext } from '../../NotificationsPopupContext';

import notificationsController from '../../../../notifications';
import getNumNotifications from '../../../../utils/getNumNotifications';

const NotificationItem = ({ notification, isPopup }) => {
  const userFrom = notification.userFrom;
  const history = useHistory();

  const { setNumNotifications } = useContext(NotificationsContext);
  const { setNotificationIsOpen } = useContext(NotificationsPopupContext);

  const getGoodAdjective = () => {
    const adjectives = [
      'amazing',
      'astounding',
      'stunning',
      'prodigious',
      'maervelous',
      'incredible',
      'astonishing',
      'breathtaking',
      'fantastic',
    ];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  };

  const getBadAdjective = () => {
    const adjectives = [
      'terrible',
      'horrible',
      'no-good',
      'dissatisfactory',
      'mediocre',
      'displeasing',
      'distasteful',
      'obnoxious',
      'awful',
      'nasty',
      'unpleasant',
    ];
    return adjectives[Math.floor(Math.random() * adjectives.length)];
  };

  const getNotificationText = (notification) => {
    if (!userFrom.firstName) {
      return console.log('userFrom not populated ');
    }

    const userFromName = userFrom.fullName;

    let text;

    if (notification.notificationType === 'share') {
      // text = `${userFromName} shared your ${getGoodAdjective()} post`;
      // until i find a good way to not create a new adjective on component refresh,
      // (when updating notifications page on new notification) just show the same message
      text = `${userFromName} shared your post`;
    } else if (notification.notificationType === 'like') {
      // text = `${userFromName} disliked your ${getBadAdjective()} post`;
      text = `${userFromName} disliked your post`;
    } else if (notification.notificationType === 'reply') {
      text = `${userFromName} replied to your post`;
    } else if (notification.notificationType === 'follow') {
      text = `${userFromName} is stalking you`;
    }

    // text for disliking or sharing own post

    if (
      notification.notificationType === 'like' &&
      notification.userTo._id === notification.userFrom._id
    ) {
      text = 'Congratulations, you disliked your own post';
    }

    if (
      notification.notificationType === 'share' &&
      notification.userTo._id === notification.userFrom._id
    ) {
      text = 'Congratulations, you shared your own post';
    }

    if (text) {
      return text;
    } else return 'Notification';
  };

  const getNotificationLink = (notification) => {
    let url;

    if (
      notification.notificationType === 'share' ||
      notification.notificationType === 'like' ||
      notification.notificationType === 'reply'
    ) {
      url = `/post/${notification.entityId}`;
    } else if (notification.notificationType === 'follow') {
      url = `/profile/${notification.userFrom.username}`;
    }

    if (url) {
      return url;
    } else return '/notifications';
  };

  const goToNotificationSubject = () => {
    markAsRead();
    if (isPopup) {
      setNotificationIsOpen(false);
    }
    // sometimes it wont mark as read when clicking on popup but this seems
    // to help
    setTimeout(() => {
      markAsRead();
      history.push(getNotificationLink(notification));
    }, 0);
  };

  const markAsRead = () => {
    if (!notification.read) {
      notificationsController.markAsRead(notification._id);
    }
    getNumNotifications(setNumNotifications);
  };

  // special styling from un-opned notifications
  const notificationClass = notification.read ? '' : 'active';
  const popupClass = isPopup ? 'notification-item-popup' : ``;

  useEffect(() => {
    if (isPopup) {
      const popup = document.querySelector('.notification-item-popup');

      if (popup) {
        popup.classList.add('notification-item-popup-fade');
      }
    }
  }, []);

  return (
    <div
      className={`chat-list-item notification ${notificationClass} ${popupClass}`}
      onClick={goToNotificationSubject}
    >
      <div className="results-image-container">
        <img src={userFrom.profilePic.url} alt="pic" />
      </div>
      <div className="chat-list-item-details">
        <span style={{ wordBreak: 'break-word' }}>{getNotificationText(notification)}</span>
      </div>
    </div>
  );
};

NotificationItem.defaultProps = {
  isPopup: false, // special styling for when this component is used to render a new notifcation as a popup
};

export default NotificationItem;
