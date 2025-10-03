import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  showPopup: false,
  selectedPost: null, // Store clicked post data
};

export const imagePopUpExploreSlice = createSlice({
  name: 'imagePopUpExplore',
  initialState,
  reducers: {
    toggleShowPopup: (state) => {
      state.showPopup = !state.showPopup;
    },
    showPopupFalse: (state) => {
      state.showPopup = false;
      state.selectedPost = null; // Reset selected post on close
    },
    showPopupTrue: (state) => {
      state.showPopup = true;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const {
  toggleShowPopup,
  showPopupFalse,
  showPopupTrue,
  setSelectedPost,
} = imagePopUpExploreSlice.actions;

export default imagePopUpExploreSlice.reducer;
