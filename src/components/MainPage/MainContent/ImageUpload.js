import React, { useState } from 'react';

import ImageCropper from './ImageCropper';

const ImageUpload = () => {
  const [blob, setBlob] = useState(null);
  const [inputImg, setInputImg] = useState('');

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
    // upload blob to firebase 'images' folder with filename 'image'
    e.preventDefault();
    console.log(blob);
    // firebase
    //     .storage()
    //     .ref('images')
    //     .child('image')
    //     .put(blob, { contentType: blob.type })
    //     .then(() => {
    //         // redirect user
    //     })
  };

  return (
    <form onSubmit={handleSubmitImage}>
      <input type="file" accept="image/*" onChange={onInputChange} />
      <p className="crop-instructions">Select image file then drag and zoom to crop</p>
      {inputImg && <ImageCropper getBlob={getBlob} inputImg={inputImg} />}
      <button
        type="submit"
        className="image-submit-btn"
        disabled={blob === null ? true : false}
        style={{ cursor: blob === null ? 'not-allowed' : 'default' }}
      >
        Submit
      </button>
    </form>
  );
};

export default ImageUpload;
