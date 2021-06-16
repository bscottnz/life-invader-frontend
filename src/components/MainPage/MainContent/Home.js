import React from 'react';
import { useState, useEffect, useContext, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import InfiniteScroll from 'react-infinite-scroll-component';

import CreatePostForm from './CreatePostForm';
import Post from './Post';
import DeletePostModal from '../../Modals/DeletePostModal';
import ReplyModal from '../../Modals/ReplyModal';

import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import deletePostRequest from '../../../utils/deletePostRequest';
import logoIcon from '../../../images/logo-large.png';
import { set } from 'nprogress';
import LoadingSpinner from '../../LoadingSpinner';

Modal.setAppElement('#root');

const Home = ({ currentUser, setCurrentUser }) => {
  // all posts
  const [posts, setPosts] = useState([]);

  // keep track of which comment is being replied to
  const [replyComment, setReplyComment] = useState(null);

  // keep track of the id of which comment is being deleted
  const [deleteComment, setDeleteComment] = useState(null);

  // display loading spinner while fetching posts
  const [isPostsLoading, setIsPostsLoading] = useState(false);

  const [noPosts, setNoPosts] = useState(false);

  const history = useHistory();

  const isInitialMount = useRef(true);
  // dont show loading spinner when updating posts, just on initail page load
  const isInitialPostFetch = useRef(true);

  // keep track of the number of 'pages' of posts to display in infininite scroll.
  const [numPages, setNumPages] = useState(1);

  const getPosts = () => {
    setIsPostsLoading(true);
    axios({
      method: 'get',
      withCredentials: true,
      url: `${process.env.REACT_APP_BASE_URL}/api/posts`,
      params: { followingPostsOnly: true },
    })
      .then((res) => {
        // set retrieved posts to post state array
        if (res.data.length > 0 && res.data[0].author.firstName === undefined) {
          return alert('author data not populated ');
        }

        setPosts(res.data);
        setIsPostsLoading(false);

        if (isInitialPostFetch.current) {
          isInitialPostFetch.current = false;
        }
      })
      .catch((err) => {
        setIsPostsLoading(false);
        console.log(err);
        // user has been signed out. redirect to home page
        if (err.response && err.response.status == 401) {
          window.location.reload();
        }
      });
  };

  // update the reply comment to its new data after being disliked or shared.
  // this allows the dislike and share button to update within the reply modal.
  useEffect(() => {
    if (replyComment) {
      const updatedReplyComment = posts.filter((post) => post._id === replyComment._id);

      setReplyComment(updatedReplyComment[0]);
    }
  }, [posts]);

  // fetch posts on page load or if users are followed from the side bar
  useEffect(() => {
    getPosts();
  }, [currentUser]);

  // need to get posts twice on initial load otherwise the local storage data isnt read for some reason.
  // one day ill find out why. will i really? maybe...
  useEffect(() => {
    getPosts();
  }, []);

  // delete post
  const deletePost = (id) => {
    deletePostRequest(id, getPosts);
  };

  const goToSearchPage = () => {
    history.push('/search');
  };

  const goToBensPage = () => {
    history.push('/profile/coolben');
  };

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
        forceUpdate={getPosts}
        setReplyComment={setReplyComment}
        setDeleteComment={setDeleteComment}
      />
    ));

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

  // show the welcome message if there are no posts after loading
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (posts.length === 0) {
        setNoPosts(true);
      } else {
        setNoPosts(false);
      }
    }
  }, [posts]);

  const noPostsToShow = (
    <div style={{ marginTop: '20px' }}>
      <h2 className="main-content-heading">Welcome to lifeinvader!</h2>
      <p className="paragraph-text">
        Stalk other lifeinvader users to see their posts here on the home page.
      </p>
      <p className="paragraph-text">
        Check out{' '}
        <span className="text-link" onClick={goToBensPage}>
          Ben's profile here
        </span>
        , or search for users from the{' '}
        <span className="text-link" onClick={goToSearchPage}>
          search page.
        </span>
      </p>
      <div className="image-wrapper" style={{ width: '60%', margin: '50px auto 0' }}>
        <img src={logoIcon} alt="logo" style={{ width: '100%' }} />
      </div>
    </div>
  );

  return (
    <div>
      <ReplyModal
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        replyComment={replyComment}
        replyHeading={replyHeading}
        replyTextPlaceholder={replyTextPlaceholder}
        getPost={getPosts}
      />

      <DeletePostModal deleteComment={deleteComment} deletePost={deletePost} />

      <h1 className="main-content-heading">Home</h1>
      <CreatePostForm
        currentUser={currentUser}
        forceUpdate={getPosts}
        setCurrentUser={setCurrentUser}
        textPlaceholder={`Hey ${currentUser.firstName}, what's going on?`}
      />
      {isPostsLoading && isInitialPostFetch.current && <LoadingSpinner />}

      <div className="posts-container">
        {/* {postItems} */}
        <InfiniteScroll
          dataLength={20 * numPages}
          next={showAnotherPage}
          hasMore={posts.length > numPages * 20}
          scrollThreshold={0.9}
        >
          {postItems}
        </InfiniteScroll>
      </div>

      {noPosts && noPostsToShow}
    </div>
  );
};

export default Home;
