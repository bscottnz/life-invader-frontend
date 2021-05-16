import React, { useEffect, useState, useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';

import { ModalContext } from './ModalContext';
import Post from '../MainPage/MainContent/Post';
import CreatePostForm from '../MainPage/MainContent/CreatePostForm';

import { v4 as uuidv4 } from 'uuid';
import modalStyle from './modalStyle';

const ReplyModal = ({ currentUser, replyComment, replyHeading, replyTextPlaceholder, getPost }) => {
  // get delete modal state from context
  const { modalIsOpen, setModalIsOpen } = useContext(ModalContext);

  return (
    <Modal
      style={modalStyle}
      isOpen={modalIsOpen}
      closeTimeoutMS={300}
      onRequestClose={() => setModalIsOpen(false)}
    >
      <div
        className="heading-container"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <h2 className="main-content-heading">{replyHeading}</h2>

        <AiOutlineCloseCircle
          style={{ fontSize: '22px', cursor: 'pointer' }}
          onClick={() => setModalIsOpen(false)}
        />
      </div>

      <Post
        postData={replyComment}
        currentUser={currentUser}
        key={uuidv4()}
        forceUpdate={getPost}
        setModalIsOpen={setModalIsOpen}
        allowComments={false}
        isDeletable={false}
      />

      <CreatePostForm
        currentUser={currentUser}
        textPlaceholder={replyTextPlaceholder}
        buttonText={'Reply'}
        setModalIsOpen={setModalIsOpen}
        isReply={true}
        replyComment={replyComment}
        forceUpdate={getPost}
      />
    </Modal>
  );
};

export default ReplyModal;
