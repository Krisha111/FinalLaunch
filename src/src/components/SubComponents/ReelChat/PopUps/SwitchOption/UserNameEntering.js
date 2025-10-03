import React, { useState, useRef, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import styled, { keyframes } from 'styled-components';
import SwitchPopUp from '../SwitchPopUp';
import '../../../../Styles/ReelChat/PopUps/UserNameEntering.css';
import {useDispatch, useSelector } from 'react-redux';
import {setSwitchScreen,setSelectedOption} from '../../../../../Redux/Slices/ReelChat/PopUp/UserNameEntering.js'

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.8); }
  to { opacity: 1; transform: scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.8); }
`;

const PopupOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: ${(props) => (props.isExiting ? fadeOut : fadeIn)} 0.3s forwards;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 30%;
  height: 50%;
  animation: ${(props) => (props.isExiting ? fadeOut : fadeIn)} 0.3s forwards;
`;

function UserNameEntering({ onClose }) {
  const dispatch= useDispatch()
   const selectedOption=useSelector((state)=>state.reelChatPopUp.selectedOption)
     const switchScreen=useSelector((state)=>state.reelChatPopUp.switchScreen)
  const [showConnectingTo, setShowConnectingTo] = useState('');
  const [registered, setRegistered] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [room, setRoom] = useState('');
  const [partner, setPartner] = useState(null);
  const socket = useRef(null);
  const [showPopup, setShowPopup] = useState(false);

  const signUpUserName = useSelector(
    (state) => state.signInAuth?.signUpUserName ?? 'Krisha'
  );

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
          dispatch(setSelectedOption('')); // reset on close

      onClose();
      setIsExiting(false);
    }, 300);
  }, [dispatch,onClose]);

  const handleClickOutside = useCallback(
    (event) => {
      if (event.target.id === 'popup-overlay') {
        handleClosePopup();
      }
    },
    [handleClosePopup]
  );

  // Initial socket setup
  useEffect(() => {
    socket.current = io('http://localhost:8080');

    socket.current.on('connect', () => {
      console.log('✅ Socket connected:', socket.current.id);
    });

    socket.current.on('start_session', ({ room, partner }) => {
      console.log(`Joined room: ${room} with ${partner}`);
      setRoom(room);
      setPartner(partner);
      socket.current.emit('join_room', { room });
      setRegistered(true);
dispatch(setSwitchScreen(true));
setShowConnectingTo('SwitchPop'); // instead of calling connectTo earlier

    });

    return () => socket.current.disconnect();
  }, []);

  useEffect(() => {
    handleOpenPopup();
    if (showPopup) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showPopup, handleClickOutside]);

  const connectTo = () => {
    setShowConnectingTo('SwitchPop');
  };

  const register = () => {
    if (socket.current && socket.current.connected) {
      console.log('📨 Emitting register_user with:', signUpUserName);
      socket.current.emit('register_user', signUpUserName);
   
     
    } else {
      console.warn('⚠️ Socket not connected yet. Retrying...');
      setTimeout(register, 500);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {showPopup && (
        <PopupOverlay id="popup-overlay" isExiting={isExiting}>
          <PopupContent isExiting={isExiting}>
            {
              !registered ? (
                <div className="userNameContainerBox">
                  <h2>Enter your username:</h2>
                  <p>{signUpUserName}</p>
                  <button onClick={register}>Join</button>
                </div>
              ) : (
            
                <div className="userNameContainerBoxx">
                  {showConnectingTo === 'SwitchPop' && (
                    <SwitchPopUp username={signUpUserName} room={room} />
                  )}
                </div>
               
              )
            }
          </PopupContent>
        </PopupOverlay>
      )}
    </div>
  );
}

export default UserNameEntering;
