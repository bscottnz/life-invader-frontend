import axios from 'axios';

const notificationsController = {
  markAsRead: function (id = null, cb = null) {
    const url =
      id !== null
        ? `${process.env.REACT_APP_BASE_URL}/api/notifications/${id}/read`
        : `${process.env.REACT_APP_BASE_URL}/api/notifications/read`;

    axios({
      method: 'put',
      withCredentials: true,
      url: url,
    })
      .then((res) => {
        if (cb !== null) {
          cb();
        }
      })
      .catch((err) => console.log(err));
  },
};

export default notificationsController;
