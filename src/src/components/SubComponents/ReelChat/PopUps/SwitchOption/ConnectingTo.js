// ConnectingTo.js
import React, { useState, useEffect } from 'react';
import '../../../../Styles/ReelChat/SwitchOption/ConnectingTo.css';

export default function ConnectingTo() {
  const [isPulsing, setIsPulsing] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting To..');

  useEffect(() => {
    // Simulate a delay for the connection status change
    const timer = setTimeout(() => {
      setConnectionStatus('Connected To');
      setIsPulsing(false); // Stop the animation when the status changes
    }, 3000); // Change the status after 3 seconds

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className='connectingToContent'>
      <div className='connectingName'>
        <p className='connectingNameText'>{connectionStatus}</p>
      </div>
      <div className='connectingPic'>
        <div className='connectingProfile'>
          <img
            src='https://static.independent.co.uk/s3fs-public/thumbnails/image/2020/01/04/13/virat-kohli.jpg'
            className='krisha'
          />
          <span style={{ "--i": 0 }}></span>
          <span style={{ "--i": 1 }}></span>
          <span style={{ "--i": 2 }}></span>
          <span style={{ "--i": 3 }}></span>
        </div>
        <div className='connectingUserName'>__aksharpanchani1234__</div>
      </div>
    </div>
  );
}
