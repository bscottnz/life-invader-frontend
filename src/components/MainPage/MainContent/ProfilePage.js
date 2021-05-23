import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import Post from './Post';
import DeletePostModal from '../../Modals/DeletePostModal';
import ReplyModal from '../../Modals/ReplyModal';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { HiOutlineEmojiSad } from 'react-icons/hi';
import { FiMail } from 'react-icons/fi';

import deletePostRequest from '../../../utils/deletePostRequest';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
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

  // the number of followers the profile has
  const [numFollowers, setNumFollowers] = useState(0);

  // the number of people the profile is following
  const [numFollowing, setNumFollowing] = useState(0);

  const getProfileUser = () => {
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/profile/${profileName}`,
    })
      .then((res) => {
        setShowError(false);
        setProfileUser(res.data);

        // set the amount of profile followers
        if (res.data.followers) {
          setNumFollowers(res.data.followers.length);
        }

        // set the amount of people the profile is following
        if (res.data.following) {
          setNumFollowing(res.data.following.length);
        }

        // check to see if the logged in user is following the user profile
        // we are viewing
        if (currentUser.following && currentUser.following.includes(res.data._id)) {
          setIsFollowing(true);
        }
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
    // same deal with the error
    setShowError(false);
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

  const followUser = () => {
    axios({
      method: 'put',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/users/${profileUser._id}/follow`,
    })
      .then((res) => {
        //res.data contains the updated currentUser with the updated following array

        // need to update current user or the following button information doesnt persist
        // when changing pages unless you refresh
        setCurrentUser(res.data);

        if (res.data.following && res.data.following.includes(profileUser._id)) {
          // we are now following
          setIsFollowing(true);
          setNumFollowers((numFollowers) => numFollowers + 1);
        } else {
          // we are now unfollowing
          setIsFollowing(false);
          setNumFollowers((numFollowers) => numFollowers - 1);
        }
      })
      .catch((err) => {
        // setShowError(true);
        console.log(err);
      });
  };

  // delete post
  const deletePost = (id) => {
    deletePostRequest(id, getProfilePosts);
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

  // special gold name styling just for my profile
  const displayNameStyle = {};
  if (profileUser && profileUser.goldenName) {
    displayNameStyle.color = 'goldenrod';
  }

  let replyHeading = '';
  let replyTextPlaceholder = '';

  // generates custom reply popup message depending on who you reply to
  // the check for undefined stops the app from crashing when you reply to a reply from within
  // the view post page. i dont really understand why it crashes without it.
  if (replyComment !== null && replyComment !== undefined) {
    if (replyComment.author.username === currentUser.username) {
      replyHeading = 'Reply to... yourself?';
      replyTextPlaceholder = 'Replying to yourself huh? You must have a lot of friends...';
    } else {
      replyHeading = `Reply to ${replyComment.author.username}`;
      replyTextPlaceholder = `Give ${replyComment.author.username} a piece of your mind..`;
    }
  }

  return (
    <div>
      {profileUser !== null && (
        <>
          <ReplyModal
            currentUser={currentUser}
            replyComment={replyComment}
            replyHeading={replyHeading}
            replyTextPlaceholder={replyTextPlaceholder}
            getPost={getProfilePosts}
          />
          <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />
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
                  <button
                    className={isFollowing ? 'follow-btn following' : 'follow-btn'}
                    onClick={followUser}
                  >
                    {isFollowing ? 'Stalking' : 'Stalk'}
                  </button>
                </>
              )}
            </div>
            <div className="user-details-container">
              <span className="display-name" style={displayNameStyle}>
                {`${profileUser.firstName} ${profileUser.lastName}`}
              </span>
              <span className="username">{`@${profileUser.username}`}</span>
              {/* <span className="description">{`${profileUser.description}`}</span> */}
              <div className="followers-container">
                <Link to={`${profileUser.username}/following`}>
                  <span className="value">{numFollowing}</span>
                  <span>Stalking</span>
                </Link>
                <Link to={`${profileUser.username}/followers`}>
                  <span className="value">{numFollowers}</span>
                  <span>{`Stalker${numFollowers === 1 ? '' : 's'}`}</span>
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
          <h2>User {profileName} not found</h2>
          <HiOutlineEmojiSad style={{ fontSize: '50px', marginTop: '15px' }} />
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
