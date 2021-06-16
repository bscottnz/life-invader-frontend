import React from 'react';
import { VscLoading } from 'react-icons/vsc';

const LoadingSpinner = () => {
  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderTop: '1px solid #3a3a3a',
        paddingTop: '40px',
      }}
    >
      <VscLoading className="spinner" style={{ fontSize: '40px', color: '#1da1f2' }} />
    </div>
  );
};

export default LoadingSpinner;
