import React from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

import axios from 'axios';

import sockets from '../../../sockets';

const CreatePostForm = ({
  currentUser,
  setCurrentUser,
  textPlaceholder,
  buttonText,
  setModalIsOpen,
  isReply,
  replyComment,
  forceUpdate,
}) => {
  const [postText, setPostText] = useState('');

  const history = useHistory();

  // resize post form text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#post-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const submitPost = () => {
    // only allow posting if user has required coins
    if (currentUser.coins && currentUser.coins > 0) {
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
          // resize the text area back to normal
          document.querySelector('#post-textarea').style.height = 'auto';
          // refresh posts
          forceUpdate();

          // this will close the reply modal when submitting a comment reply
          if (isReply) {
            setModalIsOpen(false);
            // send follow notification
            sockets.emitNotification(replyComment.author._id, currentUser._id);
          }
        })
        .catch((err) => {
          console.log(err);
          // user has been signed out. redirect to home page
          if (err.response.status == 401) {
            window.location.reload();
          }
        });

      const numCoins = currentUser.coins;

      // update users coin balance
      axios({
        method: 'put',
        withCredentials: true,
        url: `${process.env.REACT_APP_BASE_URL}/api/users/shop/${numCoins - 1}`,
        // send the amount of coins to update user data with
      })
        .then((res) => {
          setCurrentUser(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      // user has insufficeint coins to make a post. redirect to store
    } else {
      history.push(`/store/nocoins`);
    }
  };

  return (
    <div className="post-form-container">
      <div className="user-image-container">
        <img src={`${currentUser.profilePic.url}`} alt="User profile picture" />
      </div>
      <div className="textarea-container">
        <textarea
          id="post-textarea"
          placeholder={textPlaceholder}
          onInput={resizeTextarea}
          onChange={(e) => setPostText(e.target.value)}
          maxLength="400"
          value={postText}
          spellCheck="false"
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
