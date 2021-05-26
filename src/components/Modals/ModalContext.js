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

  // modal controls for cover pic modal
  const [coverPhotoModalIsOpen, setCoverPhotoModalIsOpen] = useState(false);

  // modal controls for pin post modal
  const [pinModalIsOpen, setPinModalIsOpen] = useState(false);

  // pinned post id
  const [pinPostId, setPinPostId] = useState(null);

  return (
    <ModalContext.Provider
      value={{
        deleteModalIsOpen,
        setDeleteModalIsOpen,
        modalIsOpen,
        setModalIsOpen,
        profilePicModalIsOpen,
        setProfilePicModalIsOpen,
        coverPhotoModalIsOpen,
        setCoverPhotoModalIsOpen,
        pinModalIsOpen,
        setPinModalIsOpen,
        pinPostId,
        setPinPostId,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};
