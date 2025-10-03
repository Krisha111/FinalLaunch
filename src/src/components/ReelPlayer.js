import React, { useState,useEffect } from 'react';
import ReelSide from './ReelSide';
import ReelTalk from './ReelTalk';
import '../components/Styles/ReelPlayer.css';
import { GoArrowLeft } from "react-icons/go";
import { IconButton } from '@mui/material';

import ReelInformation from './SubComponents/ReelChat/ReelInformation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllReels } from '../Redux/Slices/Profile/reelNewDrop.js';

export default function ReelPlayer() {
  // State to toggle sidebar open/close
  const dispatch=useDispatch()
  
  const [reelBarOpen, setReelBarOpen] = useState(true);
   const [currentIndex, setCurrentIndex] = useState(0);
   useEffect(() => {
        dispatch(fetchAllReels());
    }, [dispatch]);
  // Toggle function for sidebar state
  const toggleReelBar = () => {
    setReelBarOpen(!reelBarOpen);
  };
 const reels = useSelector((state) => state.reelNewDrop.reels || []);
 
   // Handle scroll wheel to navigate reels
  const handleWheel = (e) => {
    if (e.deltaY > 0) {
      // Scroll down → next reel
      setCurrentIndex(prev => Math.min(prev + 1, reels.length - 1));
    } else if (e.deltaY < 0) {
      // Scroll up → previous reel
      setCurrentIndex(prev => Math.max(prev - 1, 0));
    }
  };
 // Optional: navigate with keyboard arrows
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        setCurrentIndex(prev => Math.min(prev + 1, reels.length - 1));
      } else if (e.key === 'ArrowUp') {
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [reels.length]);

  if (reels.length === 0) {
    return <div className='reelPlayerContainer'>No reels available.</div>;
  }

  const reel = reels[currentIndex]; // current reel

 return (
  <div 
  className="reelPlayerContainer" 
  onWheel={handleWheel}>
    <div
      className="reelsWrapper"
      style={{
        transform: `translateY(-${currentIndex * 100}%)`,
        transition: "transform 0.6s ease-in-out",
      }}
    >
      {reels.map((reel, index) => (
        <div key={reel._id || index} className="singleReel">
          <ReelTalk reel={reel} />
        </div>
      ))}
    </div>

    {/* Sidebar */}
    <div className={`reelSideBar ${reelBarOpen ? '' : 'closed'}`}>
      <div className="reelBarToggleIcon">
        <div className="theProfilePhotoReelChat">
          <IconButton className="reelBarIcons">
            <GoArrowLeft
              onClick={toggleReelBar}
              className="arrowIconReelProfile"
            />
          </IconButton>
          {/* <img
            alt="profile"
          
            src="https://th.bing.com/th/id/OIP.rcUcrh-rznKZtC1VmEtFsgHaE8?rs=1&pid=ImgDetMain"
          /> */}
          <img
            style={{
              borderRadius: "10px",
              width: "40px",
              height: "40px",
              marginLeft: "5px",
              marginRight: "10px",
            }}
    src={reels[currentIndex]?.user?.profileImage || "/defaultAvatar.png"}
    alt={reels[currentIndex]?.user?.username || "User"}
    className="userAvatar"
  />
        </div>

        {reelBarOpen && (
          <div className="idContainer">
            <div>
              <h5>@{reels[currentIndex]?.user?.username || "Unknown User"}</h5>
              <div className="tickerContainer">
                <div className="tickerWrap">
                  <div className="tickerMove">
                    <span>{reels[currentIndex]?.reelLocation || "No location"} &nbsp;</span>
                    <span>{reels[currentIndex]?.reelLocation || "No location"} &nbsp;</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {reelBarOpen ? (
        <div className="openReelBarContainer">
          <div className="reelInfoContainer">
            <ReelInformation reel={reels[currentIndex]} />
          </div>
        </div>
      ) : (
        <div>
          <ReelSide setReelBarOpen={setReelBarOpen} reelBarOpen={reelBarOpen} />
        </div>
      )}
    </div>
  </div>
);
}