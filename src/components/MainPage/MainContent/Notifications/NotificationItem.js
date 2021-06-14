import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { NotificationsContext } from '../../NotificationsContext';

import notificationsController from '../../../../notifications';
import getNumNotifications from '../../../../utils/getNumNotifications';

const NotificationItem = ({ notification }) => {
  const userFrom = notification.userFrom;
  const history = useHistory();

  const { setNumNotifications } = useContext(NotificationsContext);

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
      return alert('userFrom no populated ');
    }

    const userFromName = userFrom.fullName;

    let text;

    if (notification.notificationType === 'share') {
      text = `${userFromName} shared your ${getGoodAdjective()} post`;
    } else if (notification.notificationType === 'like') {
      text = `${userFromName} disliked your ${getBadAdjective()} post`;
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
    history.push(getNotificationLink(notification));
  };

  const markAsRead = () => {
    if (!notification.read) {
      notificationsController.markAsRead(notification._id);
    }
    getNumNotifications(setNumNotifications);
  };

  // special styling from un-opned notifications
  const notificationClass = notification.read ? '' : 'active';

  return (
    <div
      className={`chat-list-item notification ${notificationClass}`}
      onClick={goToNotificationSubject}
    >
      <div className="results-image-container">
        <img src={process.env.REACT_APP_BASE_URL + userFrom.profilePic} alt="pic" />
      </div>
      <div className="chat-list-item-details ellipsis">
        <span className="ellipsis">{getNotificationText(notification)}</span>
      </div>
    </div>
  );
};

export default NotificationItem;
