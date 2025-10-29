// ==========================================
// 📁 src/Redux/store.js (Final Fixed Version)
// ==========================================

// ✅ Redux Core + Persist Setup
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// ✅ RTK Query Slice
import { apiSlice } from "./apiSlice";

// ==========================================
// ✅ Reducers (All Imports Verified)
// ==========================================
import signInReelChatReducer from './Slice/Authentication/SignIn.js'
import authReducer from "./Slice/Authentication/authSlice.js"; // ✅ main auth (logoutUser, restoreSession, etc.)
import signUpAuthReducer from "./Slice/Authentication/SignUp.js";
import ProfileReducer from "./Slice/Profile/ProfileSlice.js";
import BackgroundReducer from "./Slice/Profile/BackgroundSlice.js";
import profileInformationReducer from "./Slice/Profile/ProfileInformationSlice.js";
import socketReducer from "./Slice/ReelChat/socketSlice.js";
import profileEditReducer from "./Edit.js";
import newDropSettingReducer from "./Slice/Camera/NewDrop.js";
import postReducer from "./Slice/MakingNewDrop/Post.js";
import reelReducer from "./Slice/MakingNewDrop/Reel.js";
import addDropReducer from "./Slice/MakingNewDrop/AddDrop.js";
import reelChatPopUpReducer from "./Slice/ReelChat/PopUp/UserNameEntering.js";
import imagePopUpExploreReducer from "./Slice/Explore/ImagePopUp/ImagePopUpExplore.js";
import reelNewDropReducer from "./Slice/Profile/reelNewDrop.js";
import commonIconReducer from "./CommonIcons.js";
import profilePrivacyReducer from "./Slice/Profile/InsideProfileSettings/ProfilePrivacy.js";
// import sampleeeeReducer from "./Slice/ReelChat/Sampleeee.js"; // Uncomment if needed

// ==========================================
// ✅ Combine Reducers
// ==========================================
const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer,

  // --- Auth ---
  auth: authReducer,
  signUpAuth: signUpAuthReducer,

  // --- Profile ---
  profile: ProfileReducer,
  profileEdit: profileEditReducer,
  background: BackgroundReducer,
  profileInformation: profileInformationReducer,
  profilePrivacy: profilePrivacyReducer,

  // --- Media & Reels ---
  reelNewDrop: reelNewDropReducer,
  reel: reelReducer,
  addDrop: addDropReducer,
  post: postReducer,
  newDropSetting: newDropSettingReducer,
   signInReelChat:signInReelChatReducer,

  // --- Reel Chat ---
  socket: socketReducer,
  reelChatPopUp: reelChatPopUpReducer,
  // sampleeee: sampleeeeReducer, // Optional temporary slice

  // --- UI / Misc ---
  imagePopUpExplore: imagePopUpExploreReducer,
  commonIcon: commonIconReducer,
});

// ==========================================
// ✅ Persist Configuration
// ==========================================
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: [
    "auth", // persist login session (token + user)
    "signUpAuth", // persist signup info
    "profileInformation", // profile data
    "reelNewDrop", // reels cache
  ],
};

// ==========================================
// ✅ Persisted Reducer
// ==========================================
const persistedReducer = persistReducer(persistConfig, rootReducer);

// ==========================================
// ✅ Store Configuration
// ==========================================
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// ==========================================
// ✅ Persistor (for redux-persist)
// ==========================================
export const persistor = persistStore(store);

// ==========================================
// ✅ Export Store
// ==========================================
export default store;
