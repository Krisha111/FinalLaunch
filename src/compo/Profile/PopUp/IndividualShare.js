
import React, { useState } from 'react'
import '../../../Styles/SubComponents/Profile/PopUp/IndividualShare.css'

export default function IndividualShare({ username, connectTo }) {


  return (
    <div
      className='individualShareFollowerList'
    >

      <div className='shareToSingleUserFollowerList'>
        <div onClick={connectTo} className='singleUserFollowerList'>
          <div className='shareFollowerListInnerContainer'>
            <div className='shareAvatarFollowerListOuter'>
              <div className='shareAvatarFollowerList'>
              </div>
            </div>
           
            <div className='shareUserNameFollowerList'
            >{username}
            </div>
          </div>
          <div className='followOrNotFollowerList'>
            <div className='followOrNotInnerFollowerList'>
              UnFollow
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
