const createNewNotificationPopup = (data, currentUserId) => {
  const imgURL = `${data.sender.profilePic.url}`;

  let displayLatestMessage = `${data.sender.firstName} ${data.sender.lastName}: ${data.content}`;

  const body = document.createElement('div');
  body.classList.add('notification-popup');
  body.classList.add('chat-list-item');

  const chat = document.createElement('div');
  chat.classList.add('chat-list-item-details');
  chat.classList.add('ellipsis');

  const heading = document.createElement('span');
  heading.classList.add('heading');
  heading.classList.add('ellipsis');
  // add heading text here

  const subtext = document.createElement('span');
  subtext.classList.add('subtext');
  subtext.classList.add('subtext-notification');
  subtext.classList.add('ellipsis');
  subtext.textContent = displayLatestMessage;

  chat.append(heading);
  chat.append(subtext);

  // body append images here
  const imageContainer = document.createElement('div');
  imageContainer.classList.add('results-image-container');
  const image = document.createElement('img');
  image.setAttribute('src', imgURL);
  imageContainer.append(image);

  body.append(imageContainer);
  body.append(chat);

  body.addEventListener('click', () => {
    window.location = `/messages/${data.chat._id}`;
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

export default createNewNotificationPopup;
