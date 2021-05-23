import React, { useEffect, useState, useContext } from 'react';
import { ModalContext } from './ModalContext';
import Modal from 'react-modal';

import modalStyle from './modalStyle';

const ProfilePictureModal = () => {
  // get delete modal state from context
  const { profilePicModalIsOpen, setProfilePicModalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      style={modalStyle}
      isOpen={profilePicModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setProfilePicModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '0px' }}>
          Upload profile picture
        </h2>
      </div>
    </Modal>
  );
};

export default ProfilePictureModal;
