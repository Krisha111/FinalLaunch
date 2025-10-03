import React, { useState } from 'react'
import '../../../../Styles/ReelChat/SwitchOption/ReelTalk.css'
import socket from '../../../../socket'
import ConnectingTo from './ConnectingTo'


export default function ReelTalk({username,room}) {
  
const [users,setUsers]=useState([])
   
  const [searchText, setSearchText] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showConnectingTo,setShowConnectingTo]=useState('')
  const connectTo=()=>{
      setShowConnectingTo('connecting'); // Switch to the "Connecting to" content
}
const handleSearchChange = (e) => {
  setSearchText(e.target.value);
  setShowSuggestions(true); // Show suggestions when typing
};

const sendInvite = to => {
  socket.current.emit('send_invite', { to, mode: 'chat' });
};


const handleCancelSearch = () => {
  setSearchText('');
  setShowSuggestions(false); // Hide suggestions when cancel is clicked
};
  return (
    <div className='reelTalkContent'>
    {showConnectingTo === '' && (
      <>
        <div className='titleTalk'>
          <p className='titleText'>Talk To...</p>
        </div>
        <div className='searchTalk'>
          <input
            placeholder='Search'
            className='inputTalk'
            value={searchText}
            onChange={handleSearchChange}
            onFocus={() => setShowSuggestions(true)} // Show suggestions on focus
          />
          {searchText && (
            <button onClick={handleCancelSearch} className='cancelButton'>
              Cancel
            </button>
          )}
        </div>
        {showSuggestions && (
          <div className='suggestionList'>
            {/* Sample suggestion list items; replace with actual users' names and profiles */}
            {[...Array(5)].map((_, index) => (
              <div className='suggestionItem' key={index}>
                <img src='profile-pic-url' alt='Profile' className='profilePic' />
                <p className='userName'>User</p>
              </div>
            ))}
          </div>
        )}
       
         {!room && (
            <>
              <h3>Users Online:</h3>
              {users.filter(u => u !== username).map(user => (
                <div key={user}>
                  {user} <button onClick={() => sendInvite(user)}>Invite</button>
                </div>
              ))}
            </>
          )}
      </>
    )}
    {showConnectingTo === 'connecting' && <ConnectingTo />}
  </div>
  )
}
