// validates that a username only contains alphanumeric characters
// and starts with a letter.
const checkUsername = (username) => {
  const regex = new RegExp(/^[A-Za-z][A-Za-z0-9]+$/);
  return regex.test(username);
};

export default checkUsername;
