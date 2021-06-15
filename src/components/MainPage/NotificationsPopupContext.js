import react, { useState, createContext } from 'react';

export const NotificationsPopupContext = createContext();

export const NotificationsPopupProvider = (props) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [notificationIsOpen, setNotificationIsOpen] = useState(false);

  return (
    <NotificationsPopupContext.Provider
      value={{
        currentNotification,
        setCurrentNotification,
        currentChat,
        setCurrentChat,
        notificationIsOpen,
        setNotificationIsOpen,
      }}
    >
      {props.children}
    </NotificationsPopupContext.Provider>
  );
};
