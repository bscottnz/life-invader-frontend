import react, { useState, createContext } from 'react';

export const NotificationsContext = createContext();

// the number of unread messages and notifications

export const NotificationsProvider = (props) => {
  const [numMessages, setNumMessages] = useState(0);
  const [numNotifications, setNumNotifications] = useState(0);

  return (
    <NotificationsContext.Provider
      value={{
        numMessages,
        setNumMessages,
        numNotifications,
        setNumNotifications,
      }}
    >
      {props.children}
    </NotificationsContext.Provider>
  );
};
