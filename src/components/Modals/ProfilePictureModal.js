import React, { useEffect, useState, useContext } from 'react';

import { ModalContext } from './ModalContext';
import Modal from 'react-modal';
import ImageUpload from '../../components/MainPage/MainContent/ImageUpload';

import { AiOutlineCloseCircle } from 'react-icons/ai';

import modalStyle from './modalStyle';

const ProfilePictureModal = ({ setCurrentUser }) => {
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
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="main-content-heading">Upload profile picture</h2>
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setProfilePicModalIsOpen(false)}
          />
        </div>

        <ImageUpload setCurrentUser={setCurrentUser} />
      </div>
    </Modal>
  );
};

export default ProfilePictureModal;
