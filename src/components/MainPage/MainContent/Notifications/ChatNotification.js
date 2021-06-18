import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { NotificationsPopupContext } from '../../NotificationsPopupContext';

const ChatNotification = ({ notification }) => {
  const history = useHistory();

  const { setNotificationIsOpen } = useContext(NotificationsPopupContext);

  useEffect(() => {
    const popup = document.querySelector('.notification-item-popup');

    if (popup) {
      popup.classList.add('notification-item-popup-fade');
    }
  }, []);

  const goToChat = () => {
    setNotificationIsOpen(false);
    history.push(`/messages/${notification.chat._id}`);
  };

  let displayLatestMessage = `${notification.sender.firstName} ${notification.sender.lastName}: ${notification.content}`;
  return (
    <div
      className={'chat-list-item notification notification-item-popup active'}
      onClick={goToChat}
    >
      <div className="results-image-container">
        <img src={`${notification.sender.profilePic.url}`} alt="" />
      </div>
      <div className="chat-list-item-details ellipsis">
        <span className="heading ellipsis"></span>
        <span className="subtext subtext-notification ellipsis">{displayLatestMessage}</span>
      </div>
    </div>
  );
  // return null;
};

export default ChatNotification;
