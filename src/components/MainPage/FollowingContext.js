import react, { useState, createContext } from 'react';

export const FollowingContext = createContext();

// to properly update the following users state the way i want, between the side bar and main followers page,
// need to use context.

export const FollowingProvider = (props) => {
  // array of users that the profile user is following
  const [usersFollowing, setUsersFollowing] = useState([]);

  return (
    <FollowingContext.Provider
      value={{
        usersFollowing,
        setUsersFollowing,
      }}
    >
      {props.children}
    </FollowingContext.Provider>
  );
};
