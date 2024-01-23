import React, { useRef, useState, useEffect } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import '../css/AddCard.css';
import DashboardHeader from './DashboardHeader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Gallery from './Gallery';

const AddCard = () => {
  const audioContainerRef = useRef(null);
  const [formData, setFormData] = useState({
    title: '',
    image: null,
    selectedLanguages: [],
    texts: {},
    audios: {},
    selectedImage: null,
  });

  const recorderControls1 = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err)
  );

  const recorderControls2 = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.table(err)
  );
  const [isRecordingStatus1, setIsRecordingStatus1] = useState(false);
  const [isRecordingStatus2, setIsRecordingStatus2] = useState(false);
  const [isRecordingStatus, setIsRecordingStatus] = useState(() =>
  Array(formData.selectedLanguages.length).fill(false)
);


  const handleRecordClick = (language, index) => {
    const isCurrentlyRecording = isRecordingStatus[index];

    const selectedRecorderControls = index === 0 ? recorderControls1 : recorderControls2;

    if (isCurrentlyRecording) {
      selectedRecorderControls.stopRecording();
    } else {
      selectedRecorderControls.startRecording();
    }

    setIsRecordingStatus((prevStatus) => {
      const newStatus = [...prevStatus];
      newStatus[index] = !isCurrentlyRecording;
      return newStatus;
    });
  };



  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
  
    if (type === 'file') {
      const file = files[0];
  
      // Handle image input
      if (name === 'image') {
        setFormData((prevData) => ({
          ...prevData,
          selectedImage: file,
        }));
      } 
      
      if (name.startsWith('audio_')) {
        // Handle audio input
        const language = name.split('_')[1];
        setFormData((prevData) => ({
          ...prevData,
          audios: {
            ...prevData.audios,
            [language]: file,
          },
        }));
      }
    } else {
      // Handle non-file inputs
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
  
      if (name === 'selectedLanguages') {
        setFormData((prevData) => ({
          ...prevData,
          selectedLanguages: value.split('-'),
        }));
      } 
      
      if (name.startsWith('text_')) {
        const language = name.split('_')[1];
        setFormData((prevData) => ({
          ...prevData,
          texts: {
            ...prevData.texts,
            [language]: value,
          },
        }));
      }
    }
  };
  

  const renderLanguageFields = () => {
    if (!formData.selectedLanguages) return null;
  
    return (
      <div className="card-form-container">
        {formData.selectedLanguages.map((language, index) => (
          <div key={language}>
            <br />
            <label htmlFor={`text_${language}`}>Text in {language}</label>
            <br />
            <input
              id={`text_${language}`}
              name={`text_${language}`}
              rows="4"
              value={formData.texts?.[language] || ''}
              onChange={handleInputChange}
              required
            />
            <br />
  
            <label htmlFor={`audio_${language}`}>Audio in {language}</label>
            <br />
            <div>
              <input
                type="file"
                id={`audio_${language}_${index}`}
                name={`audio_${language}_${index}`}
                accept="audio/*"
                onChange={handleInputChange}
              />
  
              <p>OR</p>
  
              <button
                type="button"
                onClick={() => handleRecordClick(language, index)}
              >
                {isRecordingStatus[index] ? 'Stop Recording' : 'Start Recording'}
              </button>
              <br />
              <div className={`audio-recorder ${isRecordingStatus[index] ? 'recording' : ''}`}>
              <AudioRecorder
                onRecordingComplete={(blob) =>
                  setFormData((prevData) => ({
                    ...prevData,
                    audios: {
                      ...prevData.audios,
                      [language]: blob,
                    },
                  }))
                }
                recorderControls={index === 0 ? recorderControls1 : recorderControls2}
                showVisualizer={true}
              />

              </div>
            </div>
          </div>
        ))}
        <div ref={audioContainerRef}></div>
      </div>
    );
  };
  
  
  
  
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      let imageUrl;
      console.log('formData:', formData);

      const formDataToSend = new FormData();

      if (formData.selectedImage) {
        formDataToSend.append('image', formData.selectedImage);
      } else if (formData.image) {
        formDataToSend.append('image', formData.image);
      }
      formDataToSend.append('selectedLanguages', formData.selectedLanguages.join('-'));

      formData.selectedLanguages.forEach((language) => {
        formDataToSend.append(`text_${language}`, formData.texts[language]);
        formDataToSend.append(`audio_${language}`, formData.audios[language]);
      });
      console.log(formDataToSend);

      // const apiUrl = process.env.REACT_APP_API_URL_LIVE;
      const authToken = sessionStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/addCards', {
        // const response = await fetch(`${apiUrl}/addCards`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setFormData({
        image: null,
        selectedLanguages: [],
        texts: {},
        audios: {},
      });

      alert('Card added successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to add the card. Please try again.');
    }
  };

  const handleGalleryImageSelect = (imageUrl) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedImage: imageUrl,
      image: null,
    }));
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      <div className="add-card-container">
        <div className="card-form-container">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <label htmlFor="image">Image</label>
            <br />
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleInputChange}
              disabled={!!(formData.selectedImage || formData.image)}
            />
            <br />

            <label htmlFor="selectedLanguages">Select Languages</label>
            <br />
            <select
              id="selectedLanguages"
              name="selectedLanguages"
              value={formData.selectedLanguages.join('-')}
              onChange={handleInputChange}
            >
              <option value="" disabled>
                Select Language
              </option>
              <option value="english-spanish">English and Spanish</option>
              <option value="english-french">English and French</option>
              <option value="italian-spanish">Italian and Spanish</option>
            </select>

            {renderLanguageFields()}

            <button type="submit" disabled={!formData.selectedImage && !formData.image}>
              Submit
            </button>
          </form>
        </div>
        <div className="image-gallery-container">
          <Gallery onSelectImage={handleGalleryImageSelect} />
        </div>
      </div>
    </div>
  );
};

export default AddCard;
