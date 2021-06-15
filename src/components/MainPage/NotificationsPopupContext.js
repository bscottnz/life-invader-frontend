import react, { useState, createContext } from 'react';

export const NotificationsPopupContext = createContext();

// the number of unread messages and notifications

export const NotificationsPopupProvider = (props) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  return (
    <NotificationsPopupContext.Provider
      value={{
        currentNotification,
        setCurrentNotification,
        notificationIsOpen,
        setNotificationIsOpen,
      }}
    >
      {props.children}
    </NotificationsPopupContext.Provider>
  );
};
