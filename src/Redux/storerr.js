// store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './Slices/Authentication/SignIn.js'
import ProfileReducer from './Slices/Profile/ProfileSlice'; // Adjust the path
import BackgroundReducer from './Slices/Profile/BackgroundSlice';
import profileInformationReducer from './Slices/Profile/ProfileInformationSlice.js'
import socketReducer from './Slices/ReelChat/socketSlice.js'

import signInAuthReducer from './Slices/Authentication/SignUp.js'
import profileEditReducer from './Slices/Edit.js'
import newDropSettingReducer from './Slices/Camera/NewDrop.js'
import postReducer from './MakingNewDrop/Post.js'
import highLightReducer from './MakingNewDrop/HighLight.js'
import momentReducer from './MakingNewDrop/Moment.js'
import reelReducer from './MakingNewDrop/Reel.js'
import addDropReducer from './MakingNewDrop/AddDrop.js'
import thoughtReducer from './MakingNewDrop/Thought.js'
import reelChatPopUpReducer from './Slices/ReelChat/PopUp/UserNameEntering.js'
import signInReelChatReducer from './Slices/Authentication/SignUp.js'
import sampleeeeReducer from './Slices/ReelChat/Sampleeee.js'
import imagePopUpExploreReducer from './Slices/Explore/ImagePopUp/ImagePopUpExplore.js'

import reelNewDropReducer from './Slices/Profile/reelNewDrop.js'

import commonIconReducer from './CommonIcons.js'



import profilePrivacyReducer from './Slices/Profile/InsideProfileSettings/ProfilePrivacy.js'
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    profilePrivacy:profilePrivacyReducer,
 
   profileInformation:profileInformationReducer,


    
    commonIcon:commonIconReducer,

  
     reelNewDrop:reelNewDropReducer,
    imagePopUpExplore:imagePopUpExploreReducer,
    sampleeee:sampleeeeReducer,
    addDrop:addDropReducer,
    highLight:highLightReducer,
    moment:momentReducer,
    reel:reelReducer,
    thought:thoughtReducer,
    post: postReducer,
    profileEdit:profileEditReducer,
    signInReelChat:signInReelChatReducer,
    signInAuth:signInAuthReducer,
   
    auth:authReducer,

 
    background: BackgroundReducer,
    socket:socketReducer,
    profile: ProfileReducer, // Add the profile reducer
  newDropSetting:newDropSettingReducer,
  reelChatPopUp:reelChatPopUpReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
