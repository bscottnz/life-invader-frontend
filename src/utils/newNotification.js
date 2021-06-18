import notificationsController from '../notifications';

const createNewNotificationPopup = (data) => {
  const imgURL = `${data.userFrom.profilePic.url}`;

  const body = document.createElement('div');
  body.classList.add('notification-popup');
  body.classList.add('notification');
  body.classList.add('chat-list-item');

  const imageContainer = document.createElement('div');
  imageContainer.classList.add('results-image-container');
  const image = document.createElement('img');
  image.setAttribute('src', imgURL);
  imageContainer.append(image);

  const content = document.createElement('div');
  content.classList.add('chat-list-item-details');
  content.classList.add('ellipsis');
  const contentText = document.createElement('span');
  contentText.textContent = getNotificationText(data);
  contentText.classList.add('ellipsis');
  content.append(contentText);

  body.append(imageContainer);
  body.append(content);
  body.addEventListener('click', () => {
    markAsRead(data);
    window.location = getNotificationLink(data);
  });

  document.body.append(body);

  // fade popup in
  setTimeout(() => {
    body.classList.add('fade-in');
  }, 500);

  // fade popup out
  setTimeout(() => {
    body.classList.remove('fade-in');
  }, 5500);

  // remove popup from dom
  setTimeout(() => {
    body.parentNode.removeChild(body);
  }, 6500);
};

const getNotificationText = (notification) => {
  if (!notification.userFrom.firstName) {
    return alert('userFrom no populated ');
  }

  const userFromName = notification.userFrom.fullName;

  let text;

  if (notification.notificationType === 'share') {
    text = `${userFromName} shared your post`;
  } else if (notification.notificationType === 'like') {
    text = `${userFromName} disliked your post`;
  } else if (notification.notificationType === 'reply') {
    text = `${userFromName} replied to your post`;
  } else if (notification.notificationType === 'follow') {
    text = `${userFromName} is stalking you`;
  }

  if (text) {
    return text;
  } else return 'Notification';
};

const getNotificationLink = (notification) => {
  let url;

  if (
    notification.notificationType === 'share' ||
    notification.notificationType === 'like' ||
    notification.notificationType === 'reply'
  ) {
    url = `/post/${notification.entityId}`;
  } else if (notification.notificationType === 'follow') {
    url = `/profile/${notification.userFrom.username}`;
  }

  if (url) {
    return url;
  } else return '/notifications';
};

const markAsRead = (notification) => {
  if (!notification.read) {
    notificationsController.markAsRead(notification._id);
  }
};

export default createNewNotificationPopup;
