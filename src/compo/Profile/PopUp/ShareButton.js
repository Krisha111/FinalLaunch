import React, { useState, useEffect, useCallback } from 'react';

import '../../../Styles/SubComponents/Profile/PopUp/ShareButton.css'
import { Avatar, IconButton } from '@mui/material';

import { IoIosLink } from "react-icons/io";
import { IoLogoWhatsapp } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaSnapchatGhost } from "react-icons/fa";
import { MdSms } from "react-icons/md";
import { LiaSmsSolid } from "react-icons/lia";
import { FaTwitter } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { IoIosMore } from "react-icons/io";
import { FaMicrophone } from "react-icons/fa";
import IndividualShare from '../../MainPage/PopUpBody/ThreeDotsOption/IndividualShare';







const fakeDataShare = [{ username: 'krisha' }, { username: 'akshar' }, { username: 'raju' }, { username: 'chutki' }, { username: 'jaggu' }, { username: 'bheem' }, { username: 'krisha' }, { username: 'akshar' }, { username: 'raju' }, { username: 'chutki' }, { username: 'jaggu' }, { username: 'bheem' }, { username: 'krisha' }, { username: 'akshar' }, { username: 'raju' }, { username: 'chutki' }, { username: 'jaggu' }, { username: 'bheem' }];


export default function ShareButton() {
   
  
  
   





   
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

   // Function to share on specific apps
   const shareToWhatsApp = () => {
    const message = 'Hey! I found this awesome app. You should try it! ' + window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareToSnapchat = () => {
    const message = 'Check out this amazing content! ' + window.location.href;
    window.open(`https://snapchat.com/share?text=${encodeURIComponent(message)}`, '_blank');
  };

  const shareToInstagram = () => {
    alert('Instagram sharing is typically done via the app. Please copy the link to share.');
    copyLinkToClipboard();
  };

  const shareToTwitter = () => {
    const message = 'Check out this amazing app! ';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const shareToSMS = () => {
    const message = 'Hey! I found this awesome app. You should try it! ' + window.location.href;
    window.open(`sms:?body=${encodeURIComponent(message)}`, '_blank');
  };

  const shareToMessenger = () => {
    const message = 'Check this out: ' + window.location.href;
    window.open(`https://www.messenger.com/t/?link=${encodeURIComponent(message)}`, '_blank');
  };

  const shareToFacebook = () => {
    const message = 'Hey! Check out this app! ' + window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };


    return (
        <div className="AppShareButtonOfProfileContainer">
         
               
                        <div className='shareContainer'>
                            <div className='shareHeader'>

                                <p
                                    className='shareTitle'
                                >Share To...</p>

                            </div>
                            <div className='shareSearch'>

<div className='lastSearchIconShareContainer'>
                <div className='thelastSearchShareIcon'></div>
              </div>
              <div className='shareInputAndMicroPhone'>
<div className='shareInputAndMicroPhoneInnerBox'>
<input   className='shareSearchText' placeholder='Search'/>
 <IconButton>
                  <FaMicrophone
                   
                    style={{color:"black",fontSize: "20px"}}
                  />
                </IconButton>
                </div>
</div>
</div>
                            <div className='shareBody'>
                            <div className='innerShareToSingleUserOfSingleButtonProfile'>
                               
                            {fakeDataShare.map((user, index) => (
            <IndividualShare key={index} username={user.username} />
        ))}


                               
                               
                               
                               
                               
                               
                               
                               
                               

                               
                               
                               
                               

                                </div>
                                <div className='shareToApps'>
                             
                  {/* Share button to trigger the Web Share API */}
                
               <div className="shareButton">
                  <IconButton onClick={copyLinkToClipboard} ><IoIosLink className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToWhatsApp}>
                  <IoLogoWhatsapp className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToSnapchat} ><FaSnapchatGhost className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToInstagram} ><RiInstagramFill className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToTwitter} ><FaTwitter className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToSMS} ><LiaSmsSolid className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToMessenger} ><MdSms className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={shareToFacebook} ><FaFacebook className='theShareDifferentLogo'/></IconButton>
                  </div>
                  <div className="shareButton">
                  <IconButton onClick={handleShare} ><IoIosMore className='theShareDifferentLogo'/></IconButton>
                  </div>


                                </div>
                              

                            </div>
                           
                        </div>
                  
    
        </div>
    );
}
