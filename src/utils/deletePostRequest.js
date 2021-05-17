import axios from 'axios';

const deletePostRequest = (id, rerenderFunction) => {
  axios({
    method: 'delete',

    withCredentials: true,
    url: `${process.env.REACT_APP_BASE_URL}/api/posts/${id}`,
  }).then((res) => {
    //rerender posts
    rerenderFunction();
  });
};

export default deletePostRequest;
