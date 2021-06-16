import React from 'react';

import { VscLoading } from 'react-icons/vsc';

const Loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        overflowY: 'hidden',
      }}
    >
      <VscLoading className="spinner" style={{ fontSize: '40px', color: '#1da1f2' }} />
    </div>
  );
};

export default Loading;
