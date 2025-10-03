import React from 'react'
import '../../../../Styles/ReelChat/SwitchOption/ReelChat.css'
import ReelChatConnectingOptions from './ReelChatConnectingOptions'

export default function ReelChat() {
  return (
    <div
    className='reelChatHolder'
    >
      <div className='reelChatHeader'>
        <div className='reelChatTitle'>
        Connect to...
        </div>
  
        </div>  
        <div className='reelChatConnectingOptions'>
<ReelChatConnectingOptions />
        </div>
       </div>
  )
}
