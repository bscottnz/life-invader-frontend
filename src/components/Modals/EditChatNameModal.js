import React, { useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

const EditChatNameModal = () => {
  // get delete modal state from context
  const { editChatNameModalIsOpen, setEditChatNameModalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      style={modalStyle}
      isOpen={editChatNameModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setEditChatNameModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '0px' }}>
          Edit chat name
        </h2>
        <span className="close-modal-icon-wrapper">
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setEditChatNameModalIsOpen(false)}
          />
        </span>
      </div>
      <input
        type="text"
        id="change-chat-name-textbox"
        placeholder="Enter new chat name"
        spellCheck={false}
        autoComplete={false}
      />
      <button
        className="modal-delete-btn"
        onClick={() => setEditChatNameModalIsOpen(false)}
        style={{ marginTop: '20px' }}
      >
        OK
      </button>
    </Modal>
  );
};

export default EditChatNameModal;
