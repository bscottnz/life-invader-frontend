// global object singleton

const sockets = {
  messageReceived: function (newMessage) {
    const page = window.location.href;

    // get the 2 users that are part of the not group chat
    const usersNotGroupChat = [];
    if (!newMessage.chat.isGroupChat) {
      usersNotGroupChat.push(newMessage.chat.users[0]._id);
      usersNotGroupChat.push(newMessage.chat.users[1]._id);
    }

    // this checks whether the url we are on is the id of the group chat, or the user id of the user we are
    // messaging. this makes sure that we are on the correct chat page.
    const isCorrectChatPage =
      page.includes(newMessage.chat._id) ||
      (!newMessage.groupChat &&
        (page.includes(usersNotGroupChat[0]) || page.includes(usersNotGroupChat[1])));

    // just to make sure this code doesnt run if someone has the word 'messages' in their username
    // and we are on that profile page
    const definitelyOnChatPage = !page.includes('profile');

    const urlSplit = page.split('/');

    if (isCorrectChatPage && definitelyOnChatPage) {
      return {
        onChatPage: true,
        newMessage: newMessage,
      };
      // not on the chat page. return chat data so can display a notification

      // check if on the inbox page so we can update inbox messages.
      // checks if the url ends with /messages, as this is the inbox page
    } else if (urlSplit[urlSplit.length - 1] === 'messages') {
      return {
        onChatPage: true,
        newMessage: newMessage,
        onInboxPage: true,
      };
    } else
      return {
        onChatPage: false,
        newMessage: newMessage,
      };
  },
};
export default sockets;
