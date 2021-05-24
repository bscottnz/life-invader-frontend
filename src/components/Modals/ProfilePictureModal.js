import React, { useEffect, useState, useContext } from 'react';
import { ModalContext } from './ModalContext';
import Modal from 'react-modal';

import modalStyle from './modalStyle';

const ProfilePictureModal = () => {
  // get delete modal state from context
  const { profilePicModalIsOpen, setProfilePicModalIsOpen } = useContext(ModalContext);

  const changeProfilePic = (e) => {
    const input = e.target;

    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        document.querySelector('#img-preview').setAttribute('src', e.target.result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  };

  return (
    <Modal
      style={modalStyle}
      isOpen={profilePicModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setProfilePicModalIsOpen(false)}
    >
      <div>
        <h2 className="main-content-heading">Upload profile picture</h2>
        <input id="file-photo" type="file" onChange={changeProfilePic} />
        <div className="img-preview-container" style={{ width: '100%' }}>
          <img id="img-preview" style={{ maxWidth: '100%' }} />
        </div>
      </div>
    </Modal>
  );
};

export default ProfilePictureModal;
