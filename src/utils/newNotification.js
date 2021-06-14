const createNewNotificationPopup = (data) => {
  const imgURL = `${process.env.REACT_APP_BASE_URL}/${data.userFrom.profilePic}`;

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
  contentText.classList.add('ellipsis');
  content.append(contentText);

  body.append(imageContainer);
  body.append(content);

  document.body.append(body);

  // fade popup in
  setTimeout(() => {
    body.classList.add('fade-in');
  }, 500);

  // // fade popup out
  // setTimeout(() => {
  //   body.classList.remove('fade-in');
  // }, 5500);

  // // remove popup from dom
  // setTimeout(() => {
  //   body.parentNode.removeChild(body);
  // }, 6500);
};

export default createNewNotificationPopup;
