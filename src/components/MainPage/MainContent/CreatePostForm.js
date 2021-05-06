import React from 'react';
import { useState } from 'react';

const CreatePostForm = ({ currentUser }) => {
  const [postText, setPostText] = useState('');

  // resize post form text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#post-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
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
          placeholder="What's going on?"
          onInput={resizeTextarea}
          onChange={(e) => setPostText(e.target.value)}
          maxLength="400"
          value={postText}
        ></textarea>
        <div className="buttons-container">
          <button id="submit-post-button" disabled={true}>
            Invade
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostForm;
