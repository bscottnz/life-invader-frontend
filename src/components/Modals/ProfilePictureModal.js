import React, { useEffect, useState, useContext } from 'react';

import { ModalContext } from './ModalContext';
import Modal from 'react-modal';
import ImageUpload from '../../components/MainPage/MainContent/ImageUpload';

import { AiOutlineCloseCircle } from 'react-icons/ai';

import modalStyle from './modalStyle';

const ProfilePictureModal = ({ setCurrentUser }) => {
  // get delete modal state from context
  const { profilePicModalIsOpen, setProfilePicModalIsOpen } = useContext(ModalContext);

  // photo cropping / uploading options
  const options = {
    x: 150,
    y: 150,
    type: 'user-img',
    aspect: 1,
  };
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
          <span className="close-modal-icon-wrapper">
            <AiOutlineCloseCircle
              style={{ fontSize: '22px', cursor: 'pointer' }}
              onClick={() => setProfilePicModalIsOpen(false)}
            />
          </span>
        </div>

        <ImageUpload setCurrentUser={setCurrentUser} options={options} />
      </div>
    </Modal>
  );
};

export default ProfilePictureModal;
