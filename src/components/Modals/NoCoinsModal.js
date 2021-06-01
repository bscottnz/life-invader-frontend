import React, { useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

const NoCoinsModal = () => {
  // get delete modal state from context
  const { noCoinsModalIsOpen, setNoCoinsModalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      style={modalStyle}
      isOpen={noCoinsModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setNoCoinsModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '0px' }}>
          You're all out of coins!
        </h2>
        <span className="close-modal-icon-wrapper">
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setNoCoinsModalIsOpen(false)}
          />
        </span>
      </div>
      <p style={{ fontSize: '16px', marginTop: '10px' }}>
        We hope you have enjoyed your generous allowance of free lifeinvader coins. You have no
        coins remaining and must purchase more to continue participating on lifeinvader.{' '}
      </p>
      <button
        className="modal-delete-btn"
        onClick={() => setNoCoinsModalIsOpen(false)}
        style={{ marginTop: '20px' }}
      >
        Oh no!
      </button>
    </Modal>
  );
};

export default NoCoinsModal;
