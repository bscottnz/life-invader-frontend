// function to handle api calls

const apiCall = async (url, options = null) => {
  const api = `${process.env.REACT_APP_BASE_URL}${url}`;

  if (options === null) {
    const res = await fetch(api);
    return await res.json();
  }

  const res = await fetch(api, options);
  return await res.json();
};

export default apiCall;
