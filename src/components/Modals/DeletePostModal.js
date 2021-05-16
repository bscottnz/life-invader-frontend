import React, { useEffect, useState, useContext } from 'react';

import Modal from 'react-modal';

import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

const DeletePostModal = ({ deleteComment }) => {
  // get delete modal state from context
  const { deleteModalIsOpen, setDeleteModalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      style={modalStyle}
      isOpen={deleteModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setDeleteModalIsOpen(false)}
    >
      <div>
        <h2>Delete post?</h2>
        <p>{deleteComment}</p>
      </div>
    </Modal>
  );
};

export default DeletePostModal;
