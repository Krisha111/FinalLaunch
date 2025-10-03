// store.js
// Updated store with redux-persist to persist important slices across full app restarts.
// WARNING: This file includes all reducers you listed and persists selected slices.
// Don't forget to run: npm install redux-persist @react-native-async-storage/async-storage

import { configureStore, combineReducers } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import { apiSlice } from './apiSlice';

// --- your reducers (kept exactly as in your original store file) ---
import authReducer from './Slice/Authentication/SignIn.js';
import ProfileReducer from './Slice/Profile/ProfileSlice.js'; // Adjust the path
import BackgroundReducer from './Slice/Profile/BackgroundSlice.js';
import profileInformationReducer from './Slice/Profile/ProfileInformationSlice.js';
import socketReducer from './Slice/ReelChat/socketSlice.js';

import signUpAuthReducer from './Slice/Authentication/SignUp.js';
import profileEditReducer from './Edit.js';
import newDropSettingReducer from './Slice/Camera/NewDrop.js';
import postReducer from './Slice/MakingNewDrop/Post.js';
import highLightReducer from './Slice/MakingNewDrop/HighLight.js';
import momentReducer from './Slice/MakingNewDrop/Moment.js';
import reelReducer from './Slice/MakingNewDrop/Reel.js';
import addDropReducer from './Slice/MakingNewDrop/AddDrop.js';
import thoughtReducer from './Slice/MakingNewDrop/Thought.js';
import reelChatPopUpReducer from './Slice/ReelChat/PopUp/UserNameEntering.js';
import signInReelChatReducer from './Slice/Authentication/SignUp.js'; // (kept as in your original file)
import sampleeeeReducer from './Slice/ReelChat/Sampleeee.js';
import imagePopUpExploreReducer from './Slice/Explore/ImagePopUp/ImagePopUpExplore.js';

import reelNewDropReducer from './Slice/Profile/reelNewDrop.js';

import commonIconReducer from './CommonIcons.js';

import profilePrivacyReducer from './Slice/Profile/InsideProfileSettings/ProfilePrivacy.js';
// --------------------------------------------------------------------

// Combine reducers the same way you had originally, but inside combineReducers
const rootReducer = combineReducers({
  // RTK Query slice (kept under its reducerPath key)
  [apiSlice.reducerPath]: apiSlice.reducer,

  // your app reducers
  profilePrivacy: profilePrivacyReducer,
  profileInformation: profileInformationReducer,

  commonIcon: commonIconReducer,

  reelNewDrop: reelNewDropReducer,
  imagePopUpExplore: imagePopUpExploreReducer,
  sampleeee: sampleeeeReducer,
  addDrop: addDropReducer,
  highLight: highLightReducer,
  moment: momentReducer,
  reel: reelReducer,
  thought: thoughtReducer,
  post: postReducer,
  profileEdit: profileEditReducer,
  signInReelChat: signInReelChatReducer,
  signUpAuth: signUpAuthReducer,

  auth: authReducer,

  background: BackgroundReducer,
  socket: socketReducer,
  profile: ProfileReducer,
  newDropSetting: newDropSettingReducer,
  reelChatPopUp: reelChatPopUpReducer,
});

// Persist config - pick slices you want persisted across full app restarts.
// I recommend persisting auth/signUpAuth (user/token), profileInformation (profile image/name), and reelNewDrop (reels state).
// Add or remove slice names from `whitelist` as you see fit.
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['signUpAuth', 'profileInformation', 'reelNewDrop', 'auth'], // persisted slices
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with persisted reducer and add apiSlice middleware
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Required to ignore redux-persist actions during serializable checks
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  // devTools: true // default enabled in development
});

// Create persistor to use with PersistGate in App entry
export const persistor = persistStore(store);
export default store;
