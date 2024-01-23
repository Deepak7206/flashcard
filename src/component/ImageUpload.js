// ImageUploadComponent.js
import React, { useState } from 'react';
import axios from 'axios';
import DashboardHeader from './DashboardHeader';

const ImageUpload = () => {
  const [selectedImages, setSelectedImages] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImages(e.target.files);
  };

  const handleImageUpload = async () => {
    try {
      const formData = new FormData();
      for (let i = 0; i < selectedImages.length; i++) {
        formData.append('images', selectedImages[i]);
      }

      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Optionally, trigger a refresh of the gallery after successful upload
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="card-form-container ">
        <input type="file" multiple onChange={handleImageChange} />
        <button onClick={handleImageUpload}>Upload Images</button>
      </div>
    </div>

  );
};

export default ImageUpload;
