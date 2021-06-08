import React, { useContext, useState, useEffect } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { ModalContext } from './ModalContext';

import axios from 'axios';

import modalStyle from './modalStyle';

const EditChatNameModal = ({ chatId, refresh }) => {
  // get delete modal state from context
  const { editChatNameModalIsOpen, setEditChatNameModalIsOpen } = useContext(ModalContext);

  const [text, setText] = useState('');

  const updateChatName = () => {
    // alert(text);
    axios({
      method: 'put',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats/${chatId}`,
      data: { chatName: text },
    })
      .then((res) => {
        refresh();
        setEditChatNameModalIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setEditChatNameModalIsOpen(false);
      });
  };

  // focus text box on popup
  useEffect(() => {
    if (editChatNameModalIsOpen) {
      setTimeout(() => {
        document.querySelector('#change-chat-name-textbox').focus();
      }, 0);
    }
  }, [editChatNameModalIsOpen]);

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
        value={text}
        type="text"
        id="change-chat-name-textbox"
        placeholder="Enter new chat name"
        spellCheck={false}
        autoComplete="false"
        onChange={(e) => setText(e.target.value)}
      />

      <button className="modal-delete-btn" onClick={updateChatName} style={{ marginTop: '20px' }}>
        OK
      </button>
    </Modal>
  );
};

export default EditChatNameModal;
