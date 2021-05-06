import React from 'react';
import { useState } from 'react';
import CreatePostForm from './CreatePostForm';
import Post from './Post';

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);

  const postItems = posts.map((post) => <Post postData={post} key={post._id} />);
  return (
    <div>
      <h1>Home</h1>
      <CreatePostForm currentUser={currentUser} setPosts={setPosts} posts={posts} />
      <div className="posts-container">{postItems}</div>
    </div>
  );
};

export default Home;
