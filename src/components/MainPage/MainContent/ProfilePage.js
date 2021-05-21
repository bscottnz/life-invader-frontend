import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import Post from './Post';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { HiOutlineEmojiSad } from 'react-icons/hi';
import { FiMail } from 'react-icons/fi';

const ProfilePage = ({ currentUser }) => {
  // const [profileUsername, setProfileUsername] = useState('');

  const profileName = useParams().username;

  // profile user data for the profile page
  const [profileUser, setProfileUser] = useState(null);

  // profile user post data
  const [posts, setPosts] = useState([]);

  // profile user reply data
  const [replies, setReplies] = useState([]);

  // if the logged in user is following the profile we are viewing
  const [isFollowing, setIsFollowing] = useState(false);

  // the active tab the user is viewing. eg posts or replies
  const [activeTab, setActiveTab] = useState('Posts');

  // show error message if no user is returned
  const [showError, setShowError] = useState(false);

  // keep track of which comment is being replied to in the modal
  const [replyComment, setReplyComment] = useState(null);

  // keep track of which comment is being deleted
  const [deleteComment, setDeleteComment] = useState(null);

  const getProfileUser = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/profile/${profileName}`,
    })
      .then((res) => {
        setShowError(false);
        setProfileUser(res.data);
        // console.log(res.data);
      })
      .catch((err) => {
        setShowError(true);
      });
  };

  const getProfilePosts = () => {
    // console.log(profileUser);
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
      params: { author: profileUser._id },
    })
      .then((res) => {
        // set retrieved posts to post state array
        if (res.data.length > 0 && res.data[0].author.firstName === undefined) {
          return alert('author data not populated ');
        }

        const profilePagePosts = res.data.filter((post) => post.replyTo === undefined);
        const profilePageReplies = res.data.filter((post) => post.replyTo !== undefined);

        setPosts(profilePagePosts);
        setReplies(profilePageReplies);
      })
      .catch((err) => {
        console.log(err);
        // user has been signed out. redirect to home page
        if (err.response && err.response.status == 401) {
          window.location.reload();
        }
      });
  };

  useEffect(() => {
    // need to clear posts, otherwise the previous profiles posts will still show until the new
    // profile posts load when switching between profile pages
    setPosts([]);
    getProfileUser();
  }, [profileName]);

  // need profile user id before we can get the posts by that user
  useEffect(() => {
    if (profileUser !== null) {
      getProfilePosts();
    }
  }, [profileUser]);

  const setActiveTabPosts = () => {
    setActiveTab('Posts');
  };

  const setActiveTabReplies = () => {
    setActiveTab('Replies');
  };

  const postItems = posts.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getProfilePosts}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
    />
  ));

  const replyItems = replies.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getProfilePosts}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
    />
  ));

  return (
    <div>
      <h1 className="main-content-heading">{profileName}</h1>
      {profileUser !== null && (
        <>
          <div className="profile-header-container">
            <div className="cover-photo-container">
              <div className="user-image-container">
                <img
                  src={process.env.REACT_APP_BASE_URL + profileUser.profilePic}
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="profile-btns-container">
              {profileUser._id !== currentUser._id && (
                <>
                  <Link to={`/messages/${profileUser._id}`}>
                    <FiMail />
                  </Link>
                  <button className={isFollowing ? 'follow-btn following' : 'follow-btn'}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </>
              )}
            </div>
            <div className="user-details-container">
              <span className="display-name">
                {`${profileUser.firstName} ${profileUser.lastName}`}
              </span>
              <span className="username">{`@${profileUser.username}`}</span>
              {/* <span className="description">{`${profileUser.description}`}</span> */}
              <div className="followers-container">
                <Link to={`${profileUser.username}/following`}>
                  <span className="value">{0}</span>
                  <span>Following</span>
                </Link>
                <Link to={`${profileUser.username}/followers`}>
                  <span className="value">{0}</span>
                  <span>Followers</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="tabs-container">
            <div
              className={`tab ${activeTab === 'Posts' ? 'active' : ''}`}
              onClick={setActiveTabPosts}
            >
              Posts
            </div>
            <div
              className={`tab ${activeTab === 'Replies' ? 'active' : ''}`}
              onClick={setActiveTabReplies}
            >
              Replies
            </div>
          </div>
          <div className="posts-container">{activeTab == 'Posts' ? postItems : replyItems}</div>
        </>
      )}
      {showError && (
        <div>
          <h2>User not found</h2>
          <HiOutlineEmojiSad style={{ fontSize: '50px', marginTop: '15px' }} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
