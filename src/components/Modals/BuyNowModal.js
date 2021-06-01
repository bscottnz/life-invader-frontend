import React, { useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { ModalContext } from './ModalContext';

import modalStyle from './modalStyle';

const BuyNowModal = () => {
  // get delete modal state from context
  const { buyNowModalIsOpen, setBuyNowModalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      style={modalStyle}
      isOpen={buyNowModalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setBuyNowModalIsOpen(false)}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <h2 className="main-content-heading" style={{ marginRight: 'auto', marginBottom: '0px' }}>
          Purchase successful
        </h2>
        <span className="close-modal-icon-wrapper">
          <AiOutlineCloseCircle
            style={{ fontSize: '22px', cursor: 'pointer' }}
            onClick={() => setBuyNowModalIsOpen(false)}
          />
        </span>
      </div>
      <button
        className="modal-delete-btn"
        onClick={() => setBuyNowModalIsOpen(false)}
        style={{ marginTop: '20px' }}
      >
        OK
      </button>
    </Modal>
  );
};

export default BuyNowModal;
