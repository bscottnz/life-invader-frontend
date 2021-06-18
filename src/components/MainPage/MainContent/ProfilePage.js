import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';

import Post from './Post';
import CreatePostForm from './CreatePostForm';
import ProfileDescription from './ProfileDescription';
import DeletePostModal from '../../Modals/DeletePostModal';
import PinModal from '../../Modals/PinModal';
import UnPinModal from '../../Modals/UnPinModal';
import ReplyModal from '../../Modals/ReplyModal';
import ProfilePictureModal from '../../Modals/ProfilePictureModal';
import CoverPhotoModal from '../../Modals/CoverPhotoModal';
import EditDescriptionModal from '../../Modals/EditDescriptionModal';
import { ModalContext } from '../../Modals/ModalContext';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import { HiOutlineEmojiSad } from 'react-icons/hi';
import { FiMail } from 'react-icons/fi';
import { FaCameraRetro } from 'react-icons/fa';

import deletePostRequest from '../../../utils/deletePostRequest';
import sockets from '../../../sockets';
import LoadingSpinner from '../../LoadingSpinner';

const ProfilePage = ({ currentUser, setCurrentUser }) => {
  const { setProfilePicModalIsOpen, setCoverPhotoModalIsOpen } = useContext(ModalContext);

  const profileName = useParams().username;

  // profile user data for the profile page
  const [profileUser, setProfileUser] = useState(null);

  // profile user post data
  const [posts, setPosts] = useState([]);

  // profile user reply data
  const [replies, setReplies] = useState([]);

  // profile pinned post
  const [pinnedPost, setPinnedPost] = useState([]);

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

  // keep track of the number of 'pages' of posts to display in infininite scroll.
  const [numPages, setNumPages] = useState(1);

  // display loading spinner while fetching posts
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  // dont show loading spinner when updating posts, just on initail page load
  const isInitialPostFetch = useRef(true);

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
    setIsPostsLoading(true);
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

        const profilePagePosts = res.data.filter(
          (post) => post.replyTo === undefined && post.pinned !== true
        );
        const profilePageReplies = res.data.filter((post) => post.replyTo !== undefined);
        const profilePagePinnedPost = res.data.filter((post) => post.pinned === true);

        setPosts(profilePagePosts);
        setReplies(profilePageReplies);
        setPinnedPost(profilePagePinnedPost);
        setIsPostsLoading(false);

        if (isInitialPostFetch.current) {
          isInitialPostFetch.current = false;
        }
      })
      .catch((err) => {
        console.log(err);
        setIsPostsLoading(false);
        // user has been signed out. redirect to home page
        if (err.response && err.response.status == 401) {
          window.location.reload();
        }
      });
  };

  // this makes it so that it only clears the posts when changing between
  // profile pages. before it would clear the posts every time you follow / unfollow
  // someone on their page or update image, since that would change the current user, which would
  // then in turn change the profile user, which would then reset the posts.
  const [profileHasChanged, setProfileHasChanged] = useState(false);

  useEffect(() => {
    // clear error before switching to new profile page
    setShowError(false);
    setProfileHasChanged(true);
    getProfileUser();
  }, [profileName]);

  // need to get data on currentUser change, so that the new profile picture updates without refresh
  // this also updates following status on the profile page
  useEffect(() => {
    getProfileUser();
  }, [currentUser]);

  // need profile user id before we can get the posts by that user
  useEffect(() => {
    if (profileUser !== null) {
      // need to clear posts, otherwise the previous profiles posts will still show until the new
      // profile posts load when switching between profile pages

      // only reset the posts when switching between profile pages
      if (profileHasChanged) {
        setPosts([]);
        setReplies([]);
        setPinnedPost([]);
        setProfileHasChanged(false);
      }

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
          // emit notification
          sockets.emitNotification(profileUser._id, currentUser._id);
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

  // infinite scroll
  const showAnotherPage = () => {
    setNumPages((x) => x + 1);
  };
  // only show 20 posts per 'page' of infinate scroll.
  // as you scroll down to bottom the number of pages to show increases
  const postItems = posts
    .slice(0, 20 * numPages)
    .map((post) => (
      <Post
        postData={post}
        currentUser={currentUser}
        key={uuidv4()}
        forceUpdate={getProfilePosts}
        setReplyComment={setReplyComment}
        setDeleteComment={setDeleteComment}
        showPin={profileName === currentUser.username ? true : false}
      />
    ));

  const replyItems = replies
    .slice(0, 20 * numPages)
    .map((post) => (
      <Post
        postData={post}
        currentUser={currentUser}
        key={uuidv4()}
        forceUpdate={getProfilePosts}
        setReplyComment={setReplyComment}
        setDeleteComment={setDeleteComment}
      />
    ));

  const pinnedPostItem = pinnedPost.map((post) => (
    <Post
      postData={post}
      currentUser={currentUser}
      key={uuidv4()}
      forceUpdate={getProfilePosts}
      setReplyComment={setReplyComment}
      setDeleteComment={setDeleteComment}
      showPin={profileName === currentUser.username ? true : false}
      showPinHeading={true}
    />
  ));

  // special gold name styling just for my profile
  const displayNameStyle = {};
  if (profileUser && profileUser.goldenName) {
    displayNameStyle.color = 'rgb(240, 173, 1)';
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
            setCurrentUser={setCurrentUser}
            replyComment={replyComment}
            replyHeading={replyHeading}
            replyTextPlaceholder={replyTextPlaceholder}
            getPost={getProfilePosts}
          />
          <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />
          <ProfilePictureModal setCurrentUser={setCurrentUser} />
          <CoverPhotoModal setCurrentUser={setCurrentUser} />
          <PinModal getProfilePosts={getProfilePosts} />
          <UnPinModal getProfilePosts={getProfilePosts} />
          <EditDescriptionModal currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <div className="profile-header-container">
            <div
              className={`cover-photo-container ${
                profileUser && profileUser.coverPhoto ? '' : 'blue'
              }`}
            >
              <div className="cover-photo-img-container">
                {profileUser && profileUser.coverPhoto && <img src={profileUser.coverPhoto.url} />}
                {profileUser && profileUser._id === currentUser._id && (
                  <button className="cover-pic-btn" onClick={(e) => setCoverPhotoModalIsOpen(true)}>
                    <FaCameraRetro />
                  </button>
                )}
              </div>
              <div className="user-image-container">
                <img
                  className={profileUser._id === currentUser._id ? 'profile-img-fade' : ''}
                  src={profileUser.profilePic.url}
                  alt="profile pic"
                />
                {profileUser && profileUser._id === currentUser._id && (
                  <button
                    className="profile-pic-btn"
                    onClick={(e) => setProfilePicModalIsOpen(true)}
                  >
                    <FaCameraRetro />
                  </button>
                )}
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
              <ProfileDescription currentUser={currentUser} profileUser={profileUser} />
            </div>
          </div>
          {currentUser._id === profileUser._id && (
            <div className="post-form-profile-container">
              <CreatePostForm
                currentUser={currentUser}
                forceUpdate={getProfilePosts}
                setCurrentUser={setCurrentUser}
                textPlaceholder={`Hey ${currentUser.firstName}, what's going on?`}
              />
            </div>
          )}
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
          {isPostsLoading && isInitialPostFetch.current && <LoadingSpinner />}
          {pinnedPost.length > 0 && activeTab === 'Posts' && (
            <div className="posts-container" style={{ borderBottom: '6px solid #3a3a3a' }}>
              {activeTab == 'Posts' ? pinnedPostItem : ''}
            </div>
          )}
          <div className="posts-container">
            {activeTab == 'Posts' ? (
              <InfiniteScroll
                dataLength={20 * numPages}
                next={showAnotherPage}
                hasMore={posts.length > numPages * 20}
                scrollThreshold={0.9}
              >
                {postItems}
              </InfiniteScroll>
            ) : (
              <InfiniteScroll
                dataLength={20 * numPages}
                next={showAnotherPage}
                hasMore={replies.length > numPages * 20}
                scrollThreshold={0.9}
              >
                {replyItems}
              </InfiniteScroll>
            )}
          </div>
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
