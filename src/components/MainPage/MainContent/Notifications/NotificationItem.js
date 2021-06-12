import React from 'react';
import { useHistory } from 'react-router-dom';

const NotificationItem = ({ notification }) => {
  const userFrom = notification.userFrom;
  const history = useHistory();

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
    history.push(getNotificationLink(notification));
  };

  return (
    <div className="chat-list-item notification" onClick={goToNotificationSubject}>
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
