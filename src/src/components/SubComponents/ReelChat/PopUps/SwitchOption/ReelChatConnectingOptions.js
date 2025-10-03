import React from 'react'
import '../../../../Styles/ReelChat/SwitchOption/ReelChatConnectingOptions.css'
import IndividualShare from '../../../MainPage/PopUpBody/ThreeDotsOption/IndividualShare'

export default function ReelChatConnectingOptions({onClose}) {
  return (
   
         <div className='reelChatContent'>
      <div className='titleChat'>
        <p className='titleText'>Chat With...</p>
        </div>
      <div className='searchChat'>
        <input placeholder='Search' className='inputChat'/>
      </div>
      <div className='optionListChat'>
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
        <IndividualShare />
      </div>
</div>

  )
}
