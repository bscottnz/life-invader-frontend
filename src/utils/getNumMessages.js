import axios from 'axios';

const getNumMessages = (setState) => {
  axios({
    method: 'get',
    withCredentials: true,
    url: `${process.env.REACT_APP_BASE_URL}/api/chats`,
    params: { unreadOnly: true },
  })
    .then((res) => {
      setState(res.data.length);
    })
    .catch((err) => {
      console.log(err);
      setState(0);
    });
};
export default getNumMessages;
