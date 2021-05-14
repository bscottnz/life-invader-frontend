import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

const DeletePostModal = ({ deleteModalIsOpen, setDeleteModalIsOpen }) => {
  const modalStyle = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, .9)',
      height: 'calc(100vh + 100px)',
      zIndex: 3,
    },
    content: {
      backgroundColor: 'rgb(21, 24, 28)',
      maxWidth: '600px',
      height: 'fit-content',
      zIndex: 3,
      marginLeft: 'auto',
      marginRight: 'auto',
      top: 'calc(50% - 50px)',
      left: '10px',
      right: '10px',
      // transform: 'translateY(-50%)',
      borderRadius: '15px',
      border: '1px solid #3a3a3a',
      border: 'none',
    },
  };
  return (
    <Modal
      style={modalStyle}
      isOpen={deleteModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setDeleteModalIsOpen(false)}
    >
      <div>
        <h2>Delete post?</h2>
      </div>
    </Modal>
  );
};

export default DeletePostModal;
