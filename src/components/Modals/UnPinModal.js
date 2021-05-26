import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

import axios from 'axios';

const UnPinModal = ({ getProfilePosts }) => {
  // get delete modal state from context
  const { unPinModalIsOpen, setUnPinModalIsOpen, pinPostId, setPinPostId } =
    useContext(ModalContext);
  const history = useHistory();

  const pinPostWrapper = () => {
    if (pinPostId) {
      axios({
        method: 'put',
        withCredentials: true,
        url: `${process.env.REACT_APP_BASE_URL}/api/posts/${pinPostId}`,
        data: { pinned: false },
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

    setUnPinModalIsOpen(false);
  };

  return (
    <Modal
      style={modalStyle}
      isOpen={unPinModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setUnPinModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '20px' }}>
          Unpin post?
        </h2>
        <span className="close-modal-icon-wrapper">
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setUnPinModalIsOpen(false)}
          />
        </span>
      </div>
      <p style={{ fontSize: '16px' }}>
        Your pinned post will no longer appear at the top of your profile.
      </p>
      <button className="modal-delete-btn" onClick={pinPostWrapper} style={{ marginTop: '20px' }}>
        Unpin post
      </button>
    </Modal>
  );
};

export default UnPinModal;
