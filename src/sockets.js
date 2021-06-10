// global object singleton

const sockets = {
  messageReceived: function (newMessage, url) {
    console.log(url.includes('messages'));
  },
};
export default sockets;
