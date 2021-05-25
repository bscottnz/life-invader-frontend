import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../../utils/cropImage';

const ImageCropper = ({ getBlob, inputImg, options }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onCropComplete = async (_, croppedAreaPixels) => {
    const croppedImage = await getCroppedImg(inputImg, croppedAreaPixels, options.x, options.y);
    getBlob(croppedImage);
  };

  return (
    <div className="cropper">
      <Cropper
        image={inputImg}
        crop={crop}
        zoom={zoom}
        aspect={options.aspect}
        onCropChange={setCrop}
        onCropComplete={onCropComplete}
        onZoomChange={setZoom}
        zoomSpeed={0.5}
      />
    </div>
  );
};

export default ImageCropper;
