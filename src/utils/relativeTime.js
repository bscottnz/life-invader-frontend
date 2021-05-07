// returns a time difference between 2 dates.
function timeDifference(current, previous) {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerMonth = msPerDay * 30;
  const msPerYear = msPerDay * 365;

  const elapsed = current - previous;

  // if time unit is 1, omit the 's' in seconds, hours etc
  if (elapsed < msPerMinute) {
    if (elapsed / 1000 < 30) {
      return 'Just now';
    }
    return Math.round(elapsed / 1000) + ` seconds ago`;
  } else if (elapsed < msPerHour) {
    return (
      Math.round(elapsed / msPerMinute) +
      ` minute${Math.round(elapsed / msPerMinute) === 1 ? '' : 's'} ago`
    );
  } else if (elapsed < msPerDay) {
    return (
      Math.round(elapsed / msPerHour) +
      ` hour${Math.round(elapsed / msPerHour) === 1 ? '' : 's'} ago`
    );
  } else if (elapsed < msPerMonth) {
    return (
      Math.round(elapsed / msPerDay) + ` day${Math.round(elapsed / msPerDay) === 1 ? '' : 's'} ago`
    );
  } else if (elapsed < msPerYear) {
    return (
      Math.round(elapsed / msPerMonth) +
      ` month${Math.round(elapsed / msPerMonth) === 1 ? '' : 's'} ago`
    );
  } else {
    return (
      Math.round(elapsed / msPerYear) +
      ` year${Math.round(elapsed / msPerYear) === 1 ? '' : 's'} ago`
    );
  }
}

export default timeDifference;
