import React, { useState, useEffect, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import '../../../Styles/SubComponents/Profile/PopUp/ThreeDotsOption.css'
import { Avatar, IconButton } from '@mui/material';
import IndividualShare from '../../Profile/PopUp/IndividualShare.js';

import { FaMicrophone } from "react-icons/fa";
// Keyframes for fade in and out animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.8);
  }
`;

// Styled components for popup overlay and content
const PopupOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: ${(props) => (props.isExiting ? fadeOut : fadeIn)} 0.3s forwards;
`;

const PopupContent = styled.div`
  background: #fff;
  padding: 20px;
  border-radius: 8px;
 
 width: 40%;
 height: 75%;
  animation: ${(props) => (props.isExiting ? fadeOut : fadeIn)} 0.3s forwards;
`;

const fakeDataShare = [{username: 'krisha'},
    {username: 'akshar'},{username: 'raju'},{ username: 'chutki'},
    {username: 'jaggu'},{ username: 'bheem'},{username: 'krisha'},
    {username: 'akshar'},{ username: 'raju'},{username: 'chutki'},
    {username: 'jaggu'},{username: 'bheem'},{username: 'krisha'},
    {username: 'akshar'},{username: 'raju'},{username: 'chutki'},
    { username: 'jaggu'},{ username: 'bheem'},
    {username: 'akshar'},{username: 'raju'},{ username: 'chutki'},
    {username: 'jaggu'},{ username: 'bheem'},{username: 'krisha'},
    {username: 'akshar'},{ username: 'raju'},{username: 'chutki'},
    {username: 'jaggu'},{username: 'bheem'},{username: 'krisha'},
    {username: 'akshar'},{username: 'raju'},{username: 'chutki'},
    { username: 'jaggu'},{ username: 'bheem'},

]

export default function FavouritePopUp({ onClose }) {
    const [showPopup, setShowPopup] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    const handleOpenPopup = () => {
        setShowPopup(true);
    };
    const handleClosePopup = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(); // Call the parent component's close function
            setIsExiting(false);
        }, 300); // Duration should match the fadeOut animation
    }, [onClose]);

    const handleClickOutside = useCallback((event) => {
        if (event.target.id === 'popup-overlay') {
            handleClosePopup();
        }
    }, [handleClosePopup]);



    useEffect(() => {
        // Automatically open the popup when the component mounts
        handleOpenPopup();

        if (showPopup) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showPopup, handleClickOutside]);
    // Function to handle sharing
    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check out this amazing content!',
                    text: 'Hey! I found this awesome app. You should try it!',
                    url: window.location.href, // You can use a specific URL
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.error('Error sharing:', error);
            }
        } else {
            alert('Sharing is not supported on this device.');
        }
    };

    // Function to copy link to clipboard
    const copyLinkToClipboard = () => {
        navigator.clipboard.writeText(window.location.href)
            .then(() => {
                alert('Link copied to clipboard!');
            })
            .catch(err => {
                console.error('Failed to copy: ', err);
            });
    };

   


    return (
        <div className="App">
            {showPopup && (
                <PopupOverlay id="popup-overlay" isExiting={isExiting}>
                    <PopupContent isExiting={isExiting}>
                        <div className='shareContainer'>
                            <div className='shareHeader'>

                                <p
                                    className='shareTitle'
                                >Favourite's List...</p>

                            </div>
                            <div className='shareSearch'>

                                <div className='lastSearchIconShareContainer'>
                                    <div className='thelastSearchShareIcon'></div>
                                </div>
                                <div className='shareInputAndMicroPhone'>
                                    <div className='shareInputAndMicroPhoneInnerBox'>
                                        <input className='shareSearchText' placeholder='Search' />
                                        <IconButton>
                                            <FaMicrophone

                                                style={{ color: "black", fontSize: "20px" }}
                                            />
                                        </IconButton>
                                    </div>
                                </div>
                            </div>
                            <div  className='shareBodyProfileContainerOuter'>
                            <div className='shareBodyProfileContainer'>
                                <div className='innerShareToSingleUserFavoriteList'>

                                    {fakeDataShare.map((user, index) => (
                                        <IndividualShare key={index} username={user.username} />
                                    ))}

















                                </div>
                     


                             


                            </div>
</div>
                        </div>
                    </PopupContent>
                </PopupOverlay>
            )}
        </div>
    );
}
