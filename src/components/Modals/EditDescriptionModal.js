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

  useEffect(() => {
    const textarea = document.querySelector('#edit-description-textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
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
