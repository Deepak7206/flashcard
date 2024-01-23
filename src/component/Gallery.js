// GalleryComponent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardHeader from './DashboardHeader';

const Gallery = ({ onSelectImage }) => {
    const [galleryImages, setGalleryImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        onSelectImage(imageUrl); 
    };
      

  useEffect(() => {
    const fetchGalleryImages = async () => {
        try {
          const response = await axios.get('http://localhost:5000/gallery');
          setGalleryImages(response.data);
        } catch (error) {
          console.error('Error fetching gallery images:', error);
        }
      };
  
      fetchGalleryImages();
    }, []);

  return (
    // <div className="dashboard-container">
    //   <DashboardHeader />
     <div>   
        <h2>Select Image or Upload image from the form</h2>
    <div className="gallery-thumbnails">
        {galleryImages.map((image) => (
          <img
            key={image.imageUrl}
            src={image.imageUrl}
            alt={`Gallery Image ${image._id}`}
            onClick={() => handleImageClick(image.imageUrl)}
            className={selectedImage === image.imageUrl ? "selected" : ""}
          />
        ))}
      </div>
     </div>
  );
};

export default Gallery;
