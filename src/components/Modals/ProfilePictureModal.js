import React, { useEffect, useState, useContext } from 'react';

import { ModalContext } from './ModalContext';
import Modal from 'react-modal';
import ImageUpload from '../../components/MainPage/MainContent/ImageUpload';

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
      <div>
        <h2 className="main-content-heading">Upload profile picture</h2>

        <ImageUpload />
      </div>
    </Modal>
  );
};

export default ProfilePictureModal;
