import React from 'react';
import CreatePostForm from './CreatePostForm';

const Home = ({ currentUser }) => {
  return (
    <div>
      <h1>Home</h1>
      <CreatePostForm currentUser={currentUser} />
    </div>
  );
};

export default Home;
