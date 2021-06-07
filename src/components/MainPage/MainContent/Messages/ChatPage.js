import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { FaPaperPlane } from 'react-icons/fa';

import axios from 'axios';

const ChatPage = () => {
  const id = useParams().id;

  // error message for no chat found. initialse as null so it doesnt flash false status before
  // rendering true status.
  const [noChatFound, setNoChatFound] = useState(null);

  useEffect(() => {
    getChat();
  }, []);

  const getChat = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats/${id}`,
    })
      .then((res) => {
        console.log(res.data);
        setNoChatFound(false);
      })
      .catch((err) => {
        console.log(err);
        setNoChatFound(true);
      });
  };

  // resize post form text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#message-input');
    textarea.style.height = '38px';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1 className="main-content-heading">chat page</h1>
      {noChatFound === true && <p style={{ fontSize: '16px' }}>No chat found</p>}
      {noChatFound === false && (
        <div className="chat-page-container">
          <div className="chat-title-container">
            <span id="chat-name">This is the chat</span>
          </div>
          <div className="main-content-container">
            <div className="chat-container">
              <div className="chat-messages"></div>
              <div className="footer">
                <textarea
                  className="custom-scroll"
                  id="message-input"
                  name="message-input"
                  placeholder="Enter message..."
                  spellCheck={false}
                  onInput={resizeTextarea}
                  maxLength={500}
                ></textarea>
                <button className="send-msg-btn">
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
