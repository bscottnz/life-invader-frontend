import React from 'react';
import { useState } from 'react';

import axios from 'axios';

const CreatePostForm = ({
  currentUser,
  textPlaceholder,
  buttonText,
  setModalIsOpen,
  isReply,
  replyComment,
  forceUpdate,
}) => {
  const [postText, setPostText] = useState('');

  // resize post form text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#post-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const submitPost = () => {
    const payload = {
      content: postText,
    };

    if (isReply) {
      payload.replyTo = replyComment._id;
    }

    axios({
      method: 'post',
      data: payload,
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
    })
      .then((res) => {
        // clear the text area
        setPostText('');
        // refresh posts
        forceUpdate();

        // this will close the reply modal when submitting a comment reply
        if (isReply) {
          setModalIsOpen(false);
        }
      })
      .catch((err) => {
        console.log(err);
        // user has been signed out. redirect to home page
        if (err.response.status == 401) {
          window.location.reload();
        }
      });
  };

  return (
    <div className="post-form-container">
      <div className="user-image-container">
        <img
          src={`${process.env.REACT_APP_BASE_URL}${currentUser.profilePic}`}
          alt="User profile picture"
        />
      </div>
      <div className="textarea-container">
        <textarea
          id="post-textarea"
          placeholder={textPlaceholder}
          onInput={resizeTextarea}
          onChange={(e) => setPostText(e.target.value)}
          maxLength="400"
          value={postText}
        ></textarea>
        <div className="buttons-container">
          {/* only allow pressing of button if there is actually text in the textarea */}
          <button
            id="submit-post-button"
            disabled={postText.trim().length ? false : true}
            onClick={submitPost}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

CreatePostForm.defaultProps = {
  textPlaceholder: "What's going on?",
  buttonText: 'Invade',
  setModalIsOpen: false,
  isReply: false,
  replyComment: null,
  setPosts: null,
  forceUpdate: null,
};

export default CreatePostForm;
