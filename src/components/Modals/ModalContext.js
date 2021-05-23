import react, { useState, createContext } from 'react';

export const ModalContext = createContext();

// keep modal state in one place.
// before i was passing these states and setStates thorugh multiple
// components and it was getting out of hand

export const ModalProvider = (props) => {
  // modal controls for comment modal
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // modal controls for delete modal
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);

  // modal controls for profile pic modal
  const [profilePicModalIsOpen, setProfilePicModalIsOpen] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        deleteModalIsOpen,
        setDeleteModalIsOpen,
        modalIsOpen,
        setModalIsOpen,
        profilePicModalIsOpen,
        setProfilePicModalIsOpen,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};
