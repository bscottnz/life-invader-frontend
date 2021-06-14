import react, { useState, createContext } from 'react';

export const NotificationsPopupContext = createContext();

// the number of unread messages and notifications

export const NotificationsPopupProvider = (props) => {
  const [currentNotification, setCurrentNotification] = useState(null);

  return (
    <NotificationsPopupContext.Provider
      value={{
        currentNotification,
        setCurrentNotification,
      }}
    >
      {props.children}
    </NotificationsPopupContext.Provider>
  );
};
