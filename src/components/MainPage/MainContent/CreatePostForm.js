import React from 'react';
import { useState } from 'react';

import axios from 'axios';

const CreatePostForm = ({ currentUser, setPosts, posts, textPlaceholder, buttonText }) => {
  const [postText, setPostText] = useState('');

  // resize post form text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#post-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const submitPost = () => {
    axios({
      method: 'post',
      data: {
        content: postText,
      },
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
    }).then((res) => {
      console.log(res.data);
      // prepend new post to post state array
      setPosts((posts) => [res.data, ...posts]);
      setPostText('');
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
};

export default CreatePostForm;
