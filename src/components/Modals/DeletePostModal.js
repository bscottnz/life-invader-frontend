import React, { useEffect, useState, useContext } from 'react';

import Modal from 'react-modal';

import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

const DeletePostModal = ({ deleteComment, deletePost }) => {
  // get delete modal state from context
  const { deleteModalIsOpen, setDeleteModalIsOpen } = useContext(ModalContext);

  const deletePostWrapper = (id) => {
    deletePost(id);
    setDeleteModalIsOpen(false);
  };

  return (
    <Modal
      style={modalStyle}
      isOpen={deleteModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setDeleteModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '0px' }}>
          Delete post?
        </h2>
        <button
          className="modal-delete-btn"
          style={{ marginRight: '20px' }}
          onClick={(e) => deletePostWrapper(deleteComment)}
        >
          Yes
        </button>
        <button className="modal-delete-btn" onClick={(e) => setDeleteModalIsOpen(false)}>
          No
        </button>
      </div>
    </Modal>
  );
};

export default DeletePostModal;
