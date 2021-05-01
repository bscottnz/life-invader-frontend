const checkEmail = (email) => {
  const regex = new RegExp(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/);
  return regex.test(email);
};

export default checkEmail;
