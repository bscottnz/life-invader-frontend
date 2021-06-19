import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';

import EditChatNameModal from '../../../Modals/EditChatNameModal';
import { ModalContext } from '../../../Modals/ModalContext';
import TypingIndicator from './TypingIndicator';
import { NotificationsContext } from '../../NotificationsContext';

import { FaPaperPlane } from 'react-icons/fa';
import { VscLoading } from 'react-icons/vsc';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import socketIOClient, { Socket } from 'socket.io-client';
import sockets from '../../../../sockets';
import { set } from 'nprogress';

import getNumMessages from '../../../../utils/getNumMessages';

const ChatPage = ({ currentUser }) => {
  let id = useParams().id;

  const { setNumMessages } = useContext(NotificationsContext);

  const { setEditChatNameModalIsOpen } = useContext(ModalContext);

  // display loading spinner while fetching chats
  const [isChatLoading, setIsChatLoading] = useState(false);

  // error message for no chat found. initialse as null so it doesnt flash false status before
  // rendering true status.
  const [noChatFound, setNoChatFound] = useState(null);

  // chat meta data
  const [chatData, setChatData] = useState(null);

  // chat messages data
  const [chatMessagesData, setChatMessagesData] = useState([]);

  // currently typed message
  const [currentMessage, setCurrentMessage] = useState('');

  const [newMessageFromSockets, setNewMessageFromSockets] = useState(null);

  const initialLoad = useRef(true);

  useEffect(() => {
    //get chat meta data
    // need to set initial load to true on id change, as this
    // indicates switching between message pages
    initialLoad.current = true;
    getChat();
    markAllMessagesAsRead();
  }, [id]);

  // socket join. make this only join on initial fetch?
  useEffect(() => {
    if (chatData) {
      sockets.socket.emit('join room', chatData._id);

      sockets.socket.on('typing', (room) => {
        // turn on typing indicator
        // console.log('room:', room);
        // console.log('id', id);

        // here i am trying to figure out why the typing indicator will persist when messaging
        // the same user from a different chat.
        // eg in a chat with someone, then go to a new gourp chat that has the same person in it,
        // messaging that group chat will still show the typing indictor to the user in the previous chat
        // console.log(room === chatData._id);
        if (room === chatData._id) {
          try {
            document.querySelector('.typing-indicator').style.display = 'flex';
          } catch {
            // need this for if we change page while the typing indicator is active
          }
        }
      });

      sockets.socket.on('stop typing', () => {
        // turn off typing indicator
        try {
          document.querySelector('.typing-indicator').style.display = 'none';
        } catch {
          // need this for if we change page while the typing indicator is active
        }
      });

      sockets.socket.on('message recieved', (newMessage) => {
        const messageSocketResponse = sockets.messageReceived(newMessage);
        if (messageSocketResponse && messageSocketResponse.onChatPage) {
          setNewMessageFromSockets(messageSocketResponse.newMessage);
          markAllMessagesAsRead();
        }
      });
    }
  }, [chatData]);

  // update chat data when a new socket message has been recieved
  useEffect(() => {
    if (!initialLoad.current) {
      setChatMessagesData((prevState) => [...prevState, newMessageFromSockets]);
    }
  }, [newMessageFromSockets]);

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

  useEffect(() => {
    if (chatData) {
      // get chat messages data
      getChatMessages();
    }
  }, [chatData]);

  const getChatMessages = () => {
    setIsChatLoading(true);
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats/${chatData._id}/messages`,
    })
      .then((res) => {
        // console.log(res.data);
        setIsChatLoading(false);
        setChatMessagesData(res.data);
      })
      .catch((err) => {
        console.log(err);
        setIsChatLoading(false);
      });
  };

  // useEffect(() => {
  //   if (!initialLoad.current) {
  //   }
  // }, [chatMessagesData]);

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
          <img src={user.profilePic.url} key={uuidv4()}></img>
        ))}
      </div>
    );
  };

  const getChatName = () => {
    if (chatData.chatName) {
      return chatData.chatName;
    } else {
      // return 'Chat Name ';
      const chatUsers = getChatUsers(chatData.users);
      const chatNames = chatUsers.map((user) => {
        return `${user.firstName} ${user.lastName}`;
      });

      const chatName = chatNames.join(', ');
      return chatName;
    }
  };

  const getChatUsers = (users) => {
    // chat with self
    if (users.length === 1) return users;

    return users.filter((user) => {
      return user._id !== currentUser._id;
    });
  };

  const editChatName = () => {
    //only allow renaming of group chats
    if (chatData.isGroupChat) {
      setEditChatNameModalIsOpen(true);
    }
  };

  const sendMessage = () => {
    if (currentMessage.trim().length > 0) {
      axios({
        method: 'post',
        withCredentials: true,
        url: `${process.env.REACT_APP_BASE_URL}/api/messages/`,
        data: { content: currentMessage.trim(), chatId: chatData._id },
      })
        .then((res) => {
          setChatMessagesData((prevData) => [...prevData, res.data]);

          if (sockets.connected) {
            sockets.socket.emit('new message', res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          alert('Could not send message. Please try again.');
        });

      setCurrentMessage('');
      resizeTextarea();

      sockets.socket.emit('stop typing', chatData._id);
      isTyping = false;
    }
  };

  // to apply the correct border radius styling on messages, need to keep track
  // of the last message rendered
  let lastMessageSenderId = '';

  const addNewMessage = (message, index, lastMsgId) => {
    if (!message || !message._id) {
      return console.log('cannot display invalid message');
    }
    const newMessage = createMessage(message, chatMessagesData[index + 1], lastMsgId);
    lastMessageSenderId = message.sender._id;

    return newMessage;
  };

  const createMessage = (message, nextMessage, lastMsgId) => {
    const isOwnMessage = message.sender._id === currentUser._id;

    // variables to conditionally render message border radius
    const sender = message.sender;
    const senderName = sender.firstName;

    const currentSenderId = sender._id;
    const nextSenderId = nextMessage != null ? nextMessage.sender._id : '';

    const isFirst = lastMsgId !== currentSenderId;
    const isLast = nextSenderId !== currentSenderId;

    let messageName = null;

    // dont want the bottom margin for the very last message
    const veryLastMessage = nextMessage ? '' : 'very-last-msg';

    let messageClassName = isOwnMessage ? 'message own-msg' : 'message not-own-msg';

    if (isFirst) {
      messageClassName += ' first-msg';

      if (!isOwnMessage) {
        messageName = <span className="sender-name">{senderName}</span>;
      }
    }

    let profileImg = null;
    if (isLast) {
      messageClassName += ' last-msg';
      profileImg = <img src={sender.profilePic.url} alt="x" />;
    }

    let imgContainer = null;
    if (!isOwnMessage) {
      imgContainer = <div className="img-container">{profileImg}</div>;
    }

    return (
      <li className={`${messageClassName} ${veryLastMessage}`} key={uuidv4()}>
        {imgContainer}
        <div className="message-container">
          {messageName !== null && chatData.isGroupChat && messageName}
          <span className="message-body">{message.content}</span>
        </div>
      </li>
    );
  };

  // watch for enter press so can send message. shift + enter will
  // create a new line instead
  const watchTextBox = (e) => {
    if (e.keyCode == 13 && !e.shiftKey) {
      sendMessage();
      // prevent enter from making a new line
      e.preventDefault();
    }
  };

  // send typing indicator via sockets
  let isTyping = false;
  let lastTypingTime;
  let timer;

  useEffect(() => {
    // the currentMessage != '' is to stop it running again after sending a message. as
    // sending resets currentMessage to ''
    if (!initialLoad.current && currentMessage != '') {
      updateTyping();
      return () => {
        clearTimeout(timer);
      };
    }
  }, [currentMessage]);

  const updateTyping = () => {
    if (!sockets.connected) {
      return;
    }

    if (!isTyping) {
      isTyping = true;
      sockets.socket.emit('typing', chatData._id);
    }

    lastTypingTime = new Date().getTime();
    // how long after stop typing to remove indicator - in ms
    const typingIndicatorTimeout = 3000;

    timer = setTimeout(() => {
      const currentTime = new Date().getTime();
      const timeDif = currentTime - lastTypingTime;

      if (timeDif >= typingIndicatorTimeout && isTyping) {
        sockets.socket.emit('stop typing', chatData._id);
        isTyping = false;
      }
    }, typingIndicatorTimeout);
  };

  const messagesList = chatMessagesData.map((msg, index) =>
    addNewMessage(msg, index, lastMessageSenderId)
  );

  // scroll chat to bottom
  const scrollToBottom = (animate = false) => {
    const container = document.querySelector('.chat-messages');
    const scrollHeight = container.scrollHeight;

    if (animate) {
      // when adding a new message, smooth scroll to bottom of container
      container.scrollTo({ top: scrollHeight, behavior: 'smooth' });
    } else {
      // on initial load, imediatly scroll to bottom of container
      container.scrollTo({ top: scrollHeight, behavior: 'auto' });
    }
  };

  useEffect(() => {
    if (chatMessagesData.length > 0) {
      if (initialLoad.current) {
        scrollToBottom();
        initialLoad.current = false;
        // there can be a quick flash of the top of the chats div before it is scrolled to botom.
        // default the div to hidden, then change to visible after the scroll.
        // no more flashing the top of chats div on load
        document.querySelector('.chat-messages').style.opacity = '1';
      } else {
        scrollToBottom(true);
      }
    }
  }, [chatMessagesData]);

  const markAllMessagesAsRead = () => {
    axios({
      method: 'put',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/chats/${id}/messages/read`,
    })
      .then((res) => {
        getNumMessages(setNumMessages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cantEditChatStyle = {
    border: '1px solid transparent',
    cursor: 'auto',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', flexShrink: '0' }}>
      <EditChatNameModal chatId={id} refresh={getChat} />
      {/* <h1 className="main-content-heading">chat page</h1> */}
      {noChatFound === true && <p style={{ fontSize: '16px' }}>No chat found</p>}
      {noChatFound === false && (
        <div className="chat-page-container">
          <div className="chat-title-container">
            {chatData != null && chatImage(chatData, currentUser)}
            <span
              id="chat-name"
              onClick={() => editChatName()}
              style={chatData.isGroupChat ? {} : cantEditChatStyle}
            >
              {getChatName()}
            </span>
          </div>
          <div className="main-content-container main-content-container-chat">
            <div className="chat-container">
              {isChatLoading && (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderTop: '1px solid #3a3a3a',
                  }}
                >
                  <VscLoading className="spinner" style={{ fontSize: '40px', color: '#1da1f2' }} />
                </div>
              )}
              {!isChatLoading && (
                <ul className="chat-messages">{chatMessagesData.length > 0 && messagesList}</ul>
              )}
              <TypingIndicator />
              <div className="footer">
                <textarea
                  className="custom-scroll"
                  id="message-input"
                  name="message-input"
                  placeholder="Enter message..."
                  spellCheck={false}
                  onInput={resizeTextarea}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  maxLength={500}
                  onKeyDown={watchTextBox}
                  value={currentMessage}
                ></textarea>
                <button className="send-msg-btn" onClick={sendMessage}>
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
