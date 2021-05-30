import { set } from 'nprogress';
import React, { useState, useEffect } from 'react';

import { FiEdit3 } from 'react-icons/fi';

const ProfileDescription = ({ currentUser, profileUser, refreshProfileUser }) => {
  // description text
  const [text, setText] = useState('hi im ben \n hi im ben \n hi im ben \n ');

  const isCurrentUsersProfile = currentUser._id === profileUser._id;

  // resize post form text area to avoid text scroll
  const resizeTextarea = function (e) {
    const textarea = document.querySelector('#profile-desc-textarea');
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // initial textarea sizing
  useEffect(() => {
    resizeTextarea();
  }, []);

  const editStyle = {
    transform: 'translateY(3px)',
    marginLeft: '5px',
    color: '#999696',
    cursor: 'pointer',
  };

  if (isCurrentUsersProfile) {
    return (
      <div style={{ marginTop: '20px', marginBottom: '5px' }}>
        <textarea
          id="profile-desc-textarea"
          value={text}
          spellCheck="false"
          onChange={(e) => setText(e.target.value)}
          onInput={resizeTextarea}
        ></textarea>
      </div>
    );
  }

  if (!isCurrentUsersProfile) {
    return (
      <p id="profile-desc" spellCheck="false" style={{ marginTop: '20px', marginBottom: '5px' }}>
        {text}
      </p>
    );
  }
};

export default ProfileDescription;
