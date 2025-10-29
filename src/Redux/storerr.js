// store.js
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import authReducer from './Slice/Authentication/authSlice.js'
import ProfileReducer from './Slice/Profile/ProfileSlice.js'; // Adjust the path
import BackgroundReducer from './Slice/Profile/BackgroundSlice.js';
import profileInformationReducer from './Slice/Profile/ProfileInformationSlice.js'
import socketReducer from './Slice/ReelChat/socketSlice.js'


import profileEditReducer from './Edit.js'
import newDropSettingReducer from './Slice/Camera/NewDrop.js'
import postReducer from './Slice/MakingNewDrop/Post.js'


import reelReducer from './Slice/MakingNewDrop/Reel.js'
import addDropReducer from './Slice/MakingNewDrop/AddDrop.js'

import reelChatPopUpReducer from './Slice/ReelChat/PopUp/UserNameEntering.js'
import signInReelChatReducer from './Slice/Authentication/SignIn.js'

import imagePopUpExploreReducer from './Slice/Explore/ImagePopUp/ImagePopUpExplore.js'

import reelNewDropReducer from './Slice/Profile/reelNewDrop.js'

import commonIconReducer from './CommonIcons.js'



import profilePrivacyReducer from './Slice/Profile/InsideProfileSettings/ProfilePrivacy.js'
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    profilePrivacy:profilePrivacyReducer,
 
   profileInformation:profileInformationReducer,


    
    commonIcon:commonIconReducer,

  
     reelNewDrop:reelNewDropReducer,
    imagePopUpExplore:imagePopUpExploreReducer,
    
    addDrop:addDropReducer,
   
    reel:reelReducer,
   
    post: postReducer,
    profileEdit:profileEditReducer,
    signInReelChat:signInReelChatReducer,
    
   
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
