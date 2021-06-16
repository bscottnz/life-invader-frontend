import React, { useEffect, useContext } from 'react';

import Modal from 'react-modal';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import ErrorBoundary from '../ErrorBoundary';

import { ModalContext } from './ModalContext';
import Post from '../MainPage/MainContent/Post';
import CreatePostForm from '../MainPage/MainContent/CreatePostForm';

import { v4 as uuidv4 } from 'uuid';
import modalStyle from './modalStyle';

const ReplyModal = ({
  currentUser,
  replyComment,
  replyHeading,
  replyTextPlaceholder,
  getPost,
  setCurrentUser,
}) => {
  // get delete modal state from context
  const { modalIsOpen, setModalIsOpen } = useContext(ModalContext);

  // focus text box on popup
  useEffect(() => {
    if (modalIsOpen) {
      // some pages will crash when clicking browser back arrow with open modal

      setTimeout(() => {
        try {
          document.querySelector('.ReactModal__Content #post-textarea').focus();
        } catch {
          setModalIsOpen(false);
        }
      }, 0);
    }
  }, [modalIsOpen]);

  // handle error when pressing back arrow with open modal
  try {
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

          <span className="close-modal-icon-wrapper">
            <AiOutlineCloseCircle
              style={{ fontSize: '22px', cursor: 'pointer' }}
              onClick={() => setModalIsOpen(false)}
            />
          </span>
        </div>

        {/* when pressing the back arrow with open modal, the post component fails as
        it no longer has the data required to render */}
        <ErrorBoundary>
          <Post
            postData={replyComment}
            currentUser={currentUser}
            key={uuidv4()}
            forceUpdate={getPost}
            setModalIsOpen={setModalIsOpen}
            allowComments={false}
            isDeletable={false}
          />
        </ErrorBoundary>

        <CreatePostForm
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          textPlaceholder={replyTextPlaceholder}
          buttonText={'Reply'}
          setModalIsOpen={setModalIsOpen}
          isReply={true}
          replyComment={replyComment}
          forceUpdate={getPost}
        />
      </Modal>
    );
  } catch {
    return <div></div>;
  }
};

export default ReplyModal;
