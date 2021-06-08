import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';

import EditChatNameModal from '../../../Modals/EditChatNameModal';
import { ModalContext } from '../../../Modals/ModalContext';

import { FaPaperPlane } from 'react-icons/fa';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const ChatPage = ({ currentUser }) => {
  const id = useParams().id;

  const { setEditChatNameModalIsOpen, editChatNameModalIsOpen } = useContext(ModalContext);

  // error message for no chat found. initialse as null so it doesnt flash false status before
  // rendering true status.
  const [noChatFound, setNoChatFound] = useState(null);

  // chat data
  const [chatData, setChatData] = useState(null);

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
        setChatData(res.data.chat);

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

  const chatImage = (chatData, currentUser) => {
    if (!chatData) {
      return;
    }

    // filter out current user
    let chatDataUsers = chatData.users.filter((user) => {
      return user._id !== currentUser._id;
    });

    // only show a maximum of 3 user photos, then have a '+2' for the remaining users
    const maxUsersToShow = 3;

    const remainingUsers = chatDataUsers.length - maxUsersToShow;

    // take first 3 users to show picture of only
    chatDataUsers = chatDataUsers.slice(0, 3);

    // need this funky spread and reverse to disply the images correctly with row reverse
    return (
      <div className="chat-images-container">
        {remainingUsers > 0 && (
          <span className="chat-user-extra-count">{`+${remainingUsers}`}</span>
        )}
        {[...chatDataUsers].reverse().map((user) => (
          <img src={process.env.REACT_APP_BASE_URL + user.profilePic} key={uuidv4()}></img>
        ))}
      </div>
    );
  };

  const editChatName = () => {
    console.log(8);
    setEditChatNameModalIsOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <EditChatNameModal />
      <h1 className="main-content-heading">chat page</h1>
      {noChatFound === true && <p style={{ fontSize: '16px' }}>No chat found</p>}
      {noChatFound === false && (
        <div className="chat-page-container">
          <div className="chat-title-container">
            {chatData != null && chatImage(chatData, currentUser)}
            <span id="chat-name" onClick={() => editChatName()}>
              This is the chat
            </span>
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
