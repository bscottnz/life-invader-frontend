import React from 'react';
import { useState, useEffect } from 'react';
import CreatePostForm from './CreatePostForm';
import Post from './Post';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);

  const getPosts = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
    }).then((res) => {
      // set retrieved posts to post state array
      if (res.data.length > 0 && res.data[0].author.firstName === undefined) {
        return alert('author data not populated ');
      }

      setPosts(res.data);
    });
  };

  // fetch posts on page load
  useEffect(() => {
    getPosts();
  }, []);

  const postItems = posts.map((post) => (
    <Post postData={post} currentUser={currentUser} key={uuidv4()} forceUpdate={getPosts} />
  ));
  return (
    <div>
      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
