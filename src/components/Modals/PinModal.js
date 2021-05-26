import React, { useEffect, useState, useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

const PinModal = () => {
  // get delete modal state from context
  const { pinModalIsOpen, setPinModalIsOpen, pinPostId, setPinPostId } = useContext(ModalContext);

  const pinPostWrapper = () => {
    // deletePost(id);
    console.log(pinPostId);
    setPinModalIsOpen(false);
  };

  return (
    <Modal
      style={modalStyle}
      isOpen={pinModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setPinModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '20px' }}>
          Pin post?
        </h2>
        <AiOutlineCloseCircle
          style={{ fontSize: '22px', cursor: 'pointer' }}
          onClick={() => setPinModalIsOpen(false)}
        />
      </div>
      <p style={{ fontSize: '16px' }}>
        Your pinned post will appear at the top of your profile. You may have only one pinned post
        at a time.
      </p>
      <button className="modal-delete-btn" onClick={pinPostWrapper} style={{ marginTop: '20px' }}>
        Pin post
      </button>
    </Modal>
  );
};

export default PinModal;
