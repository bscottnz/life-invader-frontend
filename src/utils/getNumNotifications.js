import axios from 'axios';

const getNumNotifications = (setState) => {
  axios({
    method: 'get',
    withCredentials: true,
    url: `${process.env.REACT_APP_BASE_URL}/api/notifications`,
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
export default getNumNotifications;
