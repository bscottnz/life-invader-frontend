import React, { useState } from 'react';

const NewMessage = () => {
  const [text, setText] = useState('');

  return (
    <div>
      <h1 className="main-content-heading">New Message</h1>
      <div className="chat-page-container">
        <div className="chat-title-bar">
          <label htmlFor="user-search-textbox">To:</label>
          <div id="selected-users">
            <input
              type="text"
              placeholder="Enter message recipients"
              id="user-search-textbox"
              value={text}
              onChange={(e) => setText(e.target.value)}
              spellCheck={false}
            />
          </div>
        </div>
        <div className="results-container"></div>
        <button id="create-chat-btn" className="follow-btn" disabled={text.length === 0}>
          Create new chat
        </button>
      </div>
    </div>
  );
};

export default NewMessage;
