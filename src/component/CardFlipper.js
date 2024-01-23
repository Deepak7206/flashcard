import React, { useCallback, useEffect, useRef, useState } from 'react';
import '../css/CardFlipper.css'; // Import your CSS file
import 'font-awesome/css/font-awesome.min.css';

const CardFlipper = () => {
  const [cards, setCards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [displayedCardIndex, setDisplayedCardIndex] = useState(-1);
  const [selectedLanguages, setSelectedLanguages] = useState({
    language1: '',
    language2: '',
  });
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null);
  // const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);
  const audioRef = useRef(new Audio());
  const audioElement = audioRef.current;
  const [playAudio, setPlayAudio] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [loadCard, setLoadCard] = useState(false);
  const [pageRefreshed, setPageRefreshed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  // const audioRef = useRef(new Audio());
  // const apiUrl = process.env.REACT_APP_API_URL_LIVE;

  const fetchCardsDataCallback = useCallback(async () => {
    try {
      const authToken = sessionStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5000/getCards${buildQueryString(selectedLanguages)}`, {
        // const response = await fetch(`${apiUrl}/getCards${buildQueryString(selectedLanguages)}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await response.json();
      setCards(data);
      if (data.length > 0) {
        setCurrentAudioUrl(data[0].audioUrl1);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    }
  }, [selectedLanguages]);

  useEffect(() => {
    setHasMounted(true); // Set hasMounted to true after the initial render
  }, []);

 
  const handleUserInteraction = () => {
    setUserInteracted(true);
    document.removeEventListener('click', handleUserInteraction); // Remove the event listener after the first user interaction
    playAudio(); // Now that there's user interaction, play the audio
  };
  

  //  playAudio = () => {
  //   const audioElement = audioRef.current;
  //   if (audioElement && cards.length > 0 && currentCardIndex >= 0 && currentCardIndex < cards.length) {
  //     const { audioUrl1 } = cards[currentCardIndex];
  //     if (audioUrl1) {
  //       setAudioUrl(audioUrl1);
  //     } else {
  //       console.error('Audio URL is undefined for the current card.');
  //     }
  //   }
  // };
  
  useEffect(() => {
    const audioElement = audioRef.current;
  
    const handleEnded = () => {
      // console.log('Audio ended');
      setPlayAudio(false); // Reset playAudio state after audio ends
    };

    // console.log('Audio URL changed, attempting to load:', currentAudioUrl);
    setAudioLoaded(false); // Reset audioLoaded status when URL changes
  
    const handleLoadedMetadata = () => {
      // console.log('Audio metadata loaded:', currentAudioUrl);
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      setAudioLoaded(true);
      if (playAudio) {
        audioElement.play().catch(handleAudioError);
      }
    };
  
   
  
    const handleCanPlayThrough = () => {
      audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
      audioElement.removeEventListener('error', handleAudioError); // Remove previous error event listener
      if (playAudio) {
        setAudioLoaded(true);
        audioElement.play().catch(handleAudioError);
      }
    };
  
 
    if (audioElement) {
      audioElement.src = currentAudioUrl; // Set the src property here
  
      // Use 'loadedmetadata' event to know when the audio metadata is loaded
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
  
      // Use 'canplaythrough' event to know when the audio is ready to play
      audioElement.addEventListener('canplaythrough', handleCanPlayThrough);
    }
  
    return () => {
      // Cleanup: Pause and reset the audio when the component unmounts
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
        audioElement.removeEventListener('ended', handleEnded);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElement.removeEventListener('canplaythrough', handleCanPlayThrough);
      }
    };
  
  }, [currentAudioUrl, cards, playAudio]);
  

  useEffect(() => {
    if (hasMounted && loadCard) {
      fetchCardsDataCallback();
      setLoadCard(false);
    }

    // Call playAudio once the cards are fetched
    // playAudio();
    const audioElement = audioRef.current;
      if (audioElement && cards.length > 0 && currentCardIndex >= 0 && currentCardIndex < cards.length) {
        const { audioUrl1 } = cards[currentCardIndex];
        if (audioUrl1) {
          setAudioUrl(audioUrl1);
        } else {
          console.error('Audio URL is undefined for the current card.');
        }
      }
    
    if (selectedLanguages.language1 || selectedLanguages.language2) {
      fetchCardsDataCallback();
    }
  }, [hasMounted, loadCard, fetchCardsDataCallback, selectedLanguages]);


  useEffect(() => {
    if (selectedLanguages.language1 || selectedLanguages.language2) {
      fetchCardsDataCallback();
    }
  }, [fetchCardsDataCallback, selectedLanguages]);

  useEffect(() => {
    if (hasMounted && loadCard) {
      fetchCardsDataCallback();
      setLoadCard(false);
    }
  }, [hasMounted, loadCard, fetchCardsDataCallback]);

  useEffect(() => {
    // If playAudio state is true, call playAudioFunc
    if (playAudio) {
      playAudioFunc();
    }
  }, [playAudio]);
  
  
  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && cards.length > 0) {
        const { audioUrl1 } = cards[currentCardIndex] || {};
        if (audioUrl1) {
          setAudioUrl(audioUrl1);
        } else {
          console.error('Audio URL is undefined for the current card.');
        }
      }
    }
  });

  useEffect(() => {
    // If playAudio state is true, call playAudioFunc
    if (playAudio) {
      playAudioFunc();
    }
  }, [playAudio]);

  useEffect(() => {
    const playAudioFunc = () => {
      if (audioRef.current && cards.length > 0 && currentCardIndex >= 0 && currentCardIndex < cards.length) {
        const { audioUrl1 } = cards[currentCardIndex] || {};
        // console.log('abcd: ',cards[currentCardIndex]);
        if (audioUrl1) {
          // setAudioUrl(audioUrl1);
          setAudioUrl(currentAudioUrl);
        } else {
          console.error('Audio URL is undefined for the current card.');
        }
      }
    };
  
    playAudioFunc();
  }, [currentAudioUrl]);
  
  

  const setAudioUrl = useCallback((audioUrl) => {
    const audioElement = audioRef.current;
    if (audioElement) {
      setCurrentAudioUrl(audioUrl); // Update the state with the new audio URL
      audioElement.src = audioUrl;
      audioElement.currentTime = 0;
  
      // Use 'canplaythrough' event to know when the audio is ready to play
      audioElement.addEventListener('canplaythrough', () => {
        setIsAudioPlaying(true);
        audioElement.play().catch(error => {
          console.error('Error playing audio:', error);
        });
      }, { once: true });
    }
  }, []);

  const playAudioFunc = useCallback(() => {
    if (audioRef.current && cards.length > 0) {
      const { audioUrl1 } = cards[currentCardIndex] || {};
  
      if (audioUrl1 && audioLoaded) {
        setAudioUrl(audioUrl1);
      } else {
        console.error('Audio URL is undefined or not loaded for the current card.');
      }
    }
  }, [cards, currentCardIndex, audioLoaded, setAudioUrl]);

  const handleAudioError = error => {
    console.error('Error loading audio:', error);
    setAudioLoaded(false);
  };
  
  
    useEffect(() => {
      const playAudioFunc = () => {
        if (audioRef.current && cards.length > 0 && currentCardIndex >= 0 && currentCardIndex < cards.length) {
          const { audioUrl1 } = cards[currentCardIndex] || {};
          if (audioUrl1) {
            setAudioUrl(audioUrl1);
          } else {
            console.error('Audio URL is undefined for the current card.');
          }
        }
      };
    
      playAudioFunc();
    }, [cards, currentCardIndex]);
    

  useEffect(() => {
    // playAudio();
    const audioElement = audioRef.current;
      if (audioElement && cards.length > 0 && currentCardIndex >= 0 && currentCardIndex < cards.length) {
        const { audioUrl1 } = cards[currentCardIndex];
        if (audioUrl1) {
          setAudioUrl(audioUrl1);
        } else {
          console.error('Audio URL is undefined for the current card.');
        }
      }
  }, [selectedLanguages, fetchCardsDataCallback]);
  

  // useEffect(() => {
  //   fetchCardsData();

  //   const handleUserInteraction = () => {
  //     setUserInteracted(true);
  //   };

  //   document.addEventListener('click', handleUserInteraction);

  //   return () => {
  //     document.removeEventListener('click', handleUserInteraction);
  //   };
  // }, [fetchCardsData]);

  const handleClickMe = () => {
    setCurrentAudioUrl(null);
    const nextIndex = (currentCardIndex + 1) % cards.length;
  
    setDisplayedCardIndex(displayedCardIndex + 1);
    setCurrentCardIndex(isNaN(nextIndex) ? 0 : nextIndex);
  
    // Check if cards array is not empty and if the next index is 0, reset displayedCardIndex
    if (cards.length > 0 && nextIndex === 0) {
      setDisplayedCardIndex(0);
    }
  
    setLoadCard(true);
  };

 

  useEffect(() => {
    setIsAudioPlaying(false); // Reset isAudioPlaying when a new card is loaded
  }, [currentCardIndex]);

  useEffect(() => {
    setIsAudioPlaying(false); // Reset isAudioPlaying when a new card is loaded
    const audioElement = audioRef.current;
    // console.log('ref:', audioElement)
  
    const playAudio = () => {
      if (!pageRefreshed && audioElement && cards.length > 0 && audioRef.current && currentCardIndex >= 0 && currentCardIndex < cards.length) {
        
        if (!currentAudioUrl) {
          setAudioUrl(cards[currentCardIndex].audioUrl1);
        }
      }
    };
  
    playAudio();
  }, [currentCardIndex, cards, pageRefreshed, setAudioUrl, currentAudioUrl]);
  

  useEffect(() => {
    setCurrentAudioUrl(cards[currentCardIndex]?.audioUrl1 || null);
  }, [currentCardIndex, cards]);


const buildQueryString = params => {
  if (!params) return '';
  return '?' + Object.entries(params).map(([key, value]) => `${key}=${value}`).join('&');
};

const handleRefresh = () => {
  // console.log('refresh');
  setCurrentAudioUrl(null); // Set currentAudioUrl to null to prevent playing the audio of the current card
  setRefreshCounter(prevCounter => prevCounter + 1);
};

  

  const handlePinyinClick = () => {
    if (cards.length > 0 && cards[displayedCardIndex].audioUrl2) {
      setCurrentAudioUrl(cards[displayedCardIndex].audioUrl2);
      // setPlayAudio(true);
      // console.log('url 2 : ',cards[displayedCardIndex].audioUrl2);
    } 
    // else {
    //   // Perform text-to-speech here
    //   const textToSpeak = cards[displayedCardIndex].languageText2; // Replace with the actual text
  
    //   // Using the Web Speech API to perform text-to-speech
    //   const speechSynthesis = window.speechSynthesis;
    //   const utterance = new SpeechSynthesisUtterance(textToSpeak);
  
    //   // You can customize additional settings if needed
    //   // utterance.lang = 'en-US';
    //   // utterance.volume = 1;
    //   // utterance.rate = 1;
    //   // utterance.pitch = 1;
  
    //   // Trigger the text-to-speech
    //   speechSynthesis.speak(utterance);
    // }
  };  

  const handlePlayButtonClick = () => {
    if (cards.length > 0 && cards[displayedCardIndex].audioUrl1) {
      setCurrentAudioUrl(cards[displayedCardIndex].audioUrl1);
      // setPlayAudio(true);
      // console.log('url 1 : ',cards[displayedCardIndex].audioUrl1);
    } 
    if (audioElement) {
      audioElement.play().catch(error => {
        // console.error('Error playing audio:', error);
      });
    }
  };

  const handlePlayButtonClick2 = () => {
    if (cards.length > 0 && cards[displayedCardIndex].audioUrl2) {
      setCurrentAudioUrl(cards[displayedCardIndex].audioUrl2);
      // setPlayAudio(true);
      // console.log('url 2 : ',cards[displayedCardIndex].audioUrl2);
    } 
    if (audioElement) {
      audioElement.play().catch(error => {
        // console.error('Error playing audio:', error);
      });
    }
  };

  const handleLanguageChange = event => {
    const selectedLanguagesValue = event.target.value;
    const [language1, language2] = selectedLanguagesValue.split('-');
  
    setSelectedLanguages({
      language1,
      language2,
    });
    // Set loadCard to true when language changes

    setCurrentAudioUrl(null);
    const nextIndex = (currentCardIndex + 1) % cards.length;
  
    setDisplayedCardIndex(displayedCardIndex + 1);
    setCurrentCardIndex(isNaN(nextIndex) ? 0 : nextIndex);
  
    // Check if cards array is not empty and if the next index is 0, reset displayedCardIndex
    if (cards.length > 0 && nextIndex === 0) {
      setDisplayedCardIndex(0);
    }
    setLoadCard(true);

    
    
  };




  return (
    <div>
      <section>
        <div className="block" id="languageCardHintBlock">
          <h2>Language</h2>
          <button className="button">Traditional</button>
          <button className="button">Simplified</button>

          <h2>Categories</h2>
          <select id="selectedLanguages" name="selectedLanguages" onChange={handleLanguageChange}>
            <option value="">Select Language</option>
            <option value="english-spanish">English and Spanish</option>
            <option value="english-french">English and French</option>
            <option value="italian-spanish">Italian and Spanish</option>
          </select>
        </div>

        <div className="block" id="cardDisplayLayout" style={{ flex: 2 }}>
          {displayedCardIndex >= 0 && cards.length > 0 && cards[displayedCardIndex] ? (
            <div className="card fade-in">
              <h2>{cards[displayedCardIndex].languageCode1}</h2>
              <h3>{cards[displayedCardIndex].languageText1}</h3>
              <div className="audio-controls">
                <button className="button" onClick={handlePlayButtonClick}>
                  Play {cards[displayedCardIndex].languageCode1} Audio
                </button>
              </div>
              <img src={`${cards[displayedCardIndex].imageUrl}`} alt="Card" style={{ maxWidth: '100%' }} />
              <h2>{cards[displayedCardIndex].languageCode2}</h2>
              <h3
                style={{ cursor: 'pointer', position: 'relative' }}
                onClick={handlePinyinClick}
                title="Click to speak"
              >
                {cards[displayedCardIndex].languageText2}
                {/* <span
                  style={{
                    cursor: 'pointer',
                  position: 'absolute',
                  transform: 'translateX(-50%)',
                  padding: '5px',
                  borderRadius: '5px',
                  fontSize: '10px',
                  display: 'inline-block',
                  top: '-29px',
                  left: '50%',
                  backgroundColor: 'rgb(51, 51, 51)',
                  color: 'rgb(255, 255, 255)',
                  }}
                >
                  Click to speak
                  <span
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      border: '8px solid transparent',
                      borderTopColor: '#333',
                    }}
                  ></span>
                </span> */}
              </h3>
              {cards[displayedCardIndex].audioUrl2 && (
                <div className="audio-controls">
                  <button className="button" onClick={handlePlayButtonClick2}>
                    Play {cards[displayedCardIndex].languageCode2} Audio 
                  </button>
                </div>
              )}         

             

             <button className="button play-button" onClick={handleRefresh}>
                <i className="fa fa-refresh"></i>
              </button>
            </div>
          ) : (
            <div className="no-card-message">No card to show</div>
          )}
          <div className="click-me-block">
        <button className="button" onClick={handleClickMe}>
          Click to load the card
        </button>
      </div>
         
      {cards.length > 0 && currentAudioUrl && (
        <audio key={currentAudioUrl} controls={false} preload="auto" autoPlay>
          <source src={currentAudioUrl} type="audio/mp3" />
          Your browser does not support the audio element.
        </audio>
      )}

         
        </div>

        <div className="block" id="cardSelectionBlock">
          <h2>100 Cards Selected</h2>
          <div className="checkbox-group">
            {/* Add more checkboxes as needed */}
          </div>
          <button className="button">Clear</button>
          <button className="button">All</button>
        </div>
      </section>
    </div>
  );
};

export default CardFlipper;
