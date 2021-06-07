import React from 'react';
import { useHistory } from 'react-router-dom';

import { BiMessageAdd } from 'react-icons/bi';

const Inbox = () => {
  const history = useHistory();

  const goToNewMessagePage = () => {
    history.push('/messages/new');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="main-content-heading">Inbox</h1>
        <BiMessageAdd
          className="blue-on-hover"
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={goToNewMessagePage}
        />
      </div>
    </div>
  );
};

export default Inbox;
