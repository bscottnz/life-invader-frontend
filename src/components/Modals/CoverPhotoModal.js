import React, { useEffect, useState, useContext } from 'react';

import { ModalContext } from './ModalContext';
import Modal from 'react-modal';
import ImageUpload from '../../components/MainPage/MainContent/ImageUpload';

import { AiOutlineCloseCircle } from 'react-icons/ai';

import modalStyle from './modalStyle';

const CoverPhotoModal = ({ setCurrentUser }) => {
  // get delete modal state from context
  const { coverPhotoModalIsOpen, setCoverPhotoModalIsOpen } = useContext(ModalContext);
  return (
    <Modal
      style={modalStyle}
      isOpen={coverPhotoModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setCoverPhotoModalIsOpen(false)}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="main-content-heading">Upload cover photo</h2>
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setCoverPhotoModalIsOpen(false)}
          />
        </div>

        <ImageUpload setCurrentUser={setCurrentUser} />
      </div>
    </Modal>
  );
};

export default CoverPhotoModal;
