import React, { useState, useContext } from 'react';
import { ModalContext } from '../../Modals/ModalContext';

import ImageCropper from './ImageCropper';

import axios from 'axios';

const ImageUpload = ({ setCurrentUser, options }) => {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState('');

  const { setProfilePicModalIsOpen, setCoverPhotoModalIsOpen } = useContext(ModalContext);

  const getBlob = (blob) => {
    // pass blob up from the ImageCropper component
    setBlob(blob);
  };

  const onInputChange = (e) => {
    // convert image file to base64 string
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        setInputImg(reader.result);
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitImage = (e) => {
    e.preventDefault();

    // different routing for different images
    if (options.type === 'user-img') {
      const formData = new FormData();
      formData.append('image', blob);

      axios({
        method: 'post',
        data: formData,
        withCredentials: true,
        url: `${process.env.REACT_APP_BASE_URL}/api/users/profilePicture`,
        headers: {
          contentType: false,
          processData: false,
        },
      })
        .then((res) => {
          // set current user to be the updated user with new picture
          setCurrentUser(res.data);
          setProfilePicModalIsOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (options.type === 'cover-img') {
      const formData = new FormData();
      formData.append('image', blob);

      axios({
        method: 'post',
        data: formData,
        withCredentials: true,
        url: `${process.env.REACT_APP_BASE_URL}/api/users/coverPhoto`,
        headers: {
          contentType: false,
          processData: false,
        },
      })
        .then((res) => {
          // set current user to be the updated user with new picture
          setCurrentUser(res.data);
          setCoverPhotoModalIsOpen(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <form onSubmit={handleSubmitImage}>
      <input type="file" accept="image/*" onChange={onInputChange} />
      <p className="crop-instructions">Select image file then drag and zoom to crop</p>
      {inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} options={options} />}
      <button
        type="submit"
        className="image-submit-btn"
        disabled={blob === null ? true : false}
        style={{ cursor: blob === null ? 'not-allowed' : 'pointer' }}
      >
        Submit
      </button>
    </form>
  );
};

export default ImageUpload;
