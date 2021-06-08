import React from 'react';
import { useHistory } from 'react-router-dom';

const ChatListItem = ({ chat, currentUser }) => {
  const history = useHistory();

  const goToChat = (id) => {
    history.push(`/messages/${id}`);
  };

  const getChatName = () => {
    if (chat.chatName) {
      return chat.chatName;
    } else {
      // return 'Chat Name ';
      const chatUsers = getChatUsers(chat.users);
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

  const getChatImages = () => {
    const chatUsers = getChatUsers(chat.users);

    const chatImage = getUserChatImage(chatUsers[0]);

    if (chatUsers.length > 1) {
      const chatImage2 = getUserChatImage(chatUsers[1]);

      return (
        <div className="group-chat-image results-image-container">
          {chatImage}
          {chatImage2}
        </div>
      );
    } else {
      return <div className="results-image-container">{chatImage}</div>;
    }
  };

  const getUserChatImage = (user) => {
    if (!user || !user.profilePic) {
      return console.log('no chat user image');
    }

    return <img src={process.env.REACT_APP_BASE_URL + user.profilePic} alt="pic"></img>;
  };

  return (
    <div className="chat-list-item" onClick={(e) => goToChat(chat._id)}>
      {getChatImages()}
      <div className="chat-list-item-details ellipsis">
        <span className="heading ellipsis">{getChatName()}</span>
        <span className="subtext ellipsis">latest message</span>
      </div>
    </div>
  );
};

export default ChatListItem;