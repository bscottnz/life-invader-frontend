import React from 'react';

const NotificationItem = ({ notification }) => {
  const userFrom = notification.userFrom;

  return (
    <div className="chat-list-item">
      <div className="results-image-container">
        <img src={process.env.REACT_APP_BASE_URL + userFrom.profilePic} alt="pic" />
        <div className="chat-list-item-details ellipsis">
          <span className="ellipses">This is the notification</span>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
