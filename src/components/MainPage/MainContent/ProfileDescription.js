import React, { useState, useEffect, useContext } from 'react';
import { ModalContext } from '../../Modals/ModalContext';

import { FiEdit3 } from 'react-icons/fi';

const ProfileDescription = ({ currentUser, profileUser }) => {
  const { setEditDescriptionModalIsOpen } = useContext(ModalContext);

  return (
    <div>
      {profileUser.description !== undefined && (
        <p id="profile-desc" spellCheck="false">
          {profileUser.description}
        </p>
      )}
      {currentUser._id === profileUser._id && (
        <div className="edit-label" onClick={(e) => setEditDescriptionModalIsOpen(true)}>
          Edit profile description{' '}
          <FiEdit3 style={{ marginLeft: '5px', transform: 'translateY(3px)' }} />
        </div>
      )}
    </div>
  );
};

export default ProfileDescription;
