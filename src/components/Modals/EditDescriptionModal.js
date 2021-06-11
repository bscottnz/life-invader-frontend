import React, { useEffect, useState, useContext } from 'react';

import { ModalContext } from './ModalContext';
import Modal from 'react-modal';

import { AiOutlineCloseCircle } from 'react-icons/ai';
import axios from 'axios';

import modalStyle from './modalStyle';

const EditDescriptionModal = ({ currentUser, setCurrentUser }) => {
  const [textContent, setTextContent] = useState(
    currentUser.description ? currentUser.description : ''
  );

  // get description modal state from context
  const { editDescriptionModalIsOpen, setEditDescriptionModalIsOpen } = useContext(ModalContext);

  // resize text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#edit-description-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // this is the only way i could resize the text area as the modal opens.
  // otherwise textarea is null and the app crashes.
  // before the text area would be the minimum size on modal open (causing scroll),
  // and would only resize when editing the text
  useEffect(() => {
    if (editDescriptionModalIsOpen) {
      setTimeout(() => {
        resizeTextarea();
      }, 0);
    }
  }, [editDescriptionModalIsOpen]);

  // focus text box on popup
  useEffect(() => {
    if (editDescriptionModalIsOpen) {
      setTimeout(() => {
        const textbox = document.querySelector('#edit-description-textarea');
        textbox.focus();
        // set cursor at end of textarea
        textbox.setSelectionRange(textbox.value.length, textbox.value.length);
      }, 0);
    }
  }, [editDescriptionModalIsOpen]);

  const updateDescription = () => {
    const newDescription = textContent.trim();

    axios({
      method: 'put',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/description`,
      data: { description: newDescription },
    })
      .then((res) => {
        setCurrentUser(res.data);
        setEditDescriptionModalIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Modal
      style={modalStyle}
      isOpen={editDescriptionModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setEditDescriptionModalIsOpen(false)}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <h2 className="main-content-heading">Edit profile description</h2>
          <span className="close-modal-icon-wrapper">
            <AiOutlineCloseCircle
              style={{ fontSize: '22px', cursor: 'pointer' }}
              onClick={() => setEditDescriptionModalIsOpen(false)}
            />
          </span>
        </div>
        <div className="modal-body">
          <textarea
            placeholder="Add a profile description.."
            id="edit-description-textarea"
            spellCheck={false}
            onInput={resizeTextarea}
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            maxLength={'100'}
            style={{ height: 'auto' }}
            onLoad={(e) => console.log('load')}
          ></textarea>
          <div className="modal-buttons">
            <button
              className="follow-btn"
              style={{ marginLeft: '0px' }}
              onClick={updateDescription}
            >
              Save
            </button>
            <button className="follow-btn" onClick={() => setEditDescriptionModalIsOpen(false)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default EditDescriptionModal;
