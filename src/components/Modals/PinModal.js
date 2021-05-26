import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

import axios from 'axios';

const PinModal = ({ getProfilePosts }) => {
  // get delete modal state from context
  const { pinModalIsOpen, setPinModalIsOpen, pinPostId, setPinPostId } = useContext(ModalContext);
  const history = useHistory();

  const pinPostWrapper = () => {
    if (pinPostId) {
      axios({
        method: 'put',
        withCredentials: true,
        url: `${process.env.REACT_APP_BASE_URL}/api/posts/${pinPostId}`,
        data: { pinned: true },
      })
        .then((res) => {
          setPinPostId(null);
          // history.go(0);
          getProfilePosts();
        })
        .catch((err) => {
          console.log(err);
        });
    }

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
        <span className="close-modal-icon-wrapper">
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setPinModalIsOpen(false)}
          />
        </span>
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
