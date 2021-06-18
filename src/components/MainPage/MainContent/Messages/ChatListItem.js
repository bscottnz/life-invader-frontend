import React from 'react';
import { useHistory } from 'react-router-dom';

const ChatListItem = ({ chat, currentUser }) => {
  const history = useHistory();

  // if the chat has a latest ,essage to display or not
  const isMessage = chat.lastMessage != undefined;

  let displayLatestMessage = 'New conversation';

  if (isMessage) {
    displayLatestMessage = `${chat.lastMessage.sender.firstName} ${chat.lastMessage.sender.lastName}: ${chat.lastMessage.content}`;
    if (chat.lastMessage.sender._id === currentUser._id) {
      displayLatestMessage = `You: ${chat.lastMessage.content}`;
    }
  }

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
    if (!user || !user.profilePic.url) {
      return console.log('no chat user image');
    }

    return <img src={user.profilePic.url} alt="pic"></img>;
  };

  const activeClass =
    !chat.lastMessage || chat.lastMessage.seenBy.includes(currentUser._id) ? '' : 'active';

  return (
    <div className={`chat-list-item ${activeClass}`} onClick={(e) => goToChat(chat._id)}>
      {getChatImages()}
      <div className="chat-list-item-details ellipsis">
        <span className="heading ellipsis">{getChatName()}</span>
        <span className="subtext ellipsis">{displayLatestMessage}</span>
      </div>
    </div>
  );
};

export default ChatListItem;
