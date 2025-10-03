import { createSlice } from '@reduxjs/toolkit';

const reelSlice = createSlice({
  name: 'reel',
  initialState: {
    reelScript: '',
    reelLocation: '',
    reelCommenting: false,
    reelLikeCountVisible: true,
    reelShareCountVisible: true,
    reelPinned: false,
     photoReelImages:null
  },
  reducers: {
    setPhotoReelImages(state, action) {
      state.photoReelImages = action.payload;
    },
     setReelScript(state, action) {
      state.reelScript = action.payload;
    },
    setReelLocation(state, action) {
      state.reelLocation = action.payload;
    },
    toggleReelCommenting(state) {
      state.reelCommenting = !state.reelCommenting;
    },
    toggleReelLikeCount(state) {
      state.reelLikeCountVisible = !state.reelLikeCountVisible;
    },
    toggleReelShareCount(state) {
      state.reelShareCountVisible = !state.reelShareCountVisible;
    },
    toggleReelPinned(state) {
      state.reelPinned = !state.reelPinned;
    },
  },
});

export const {
  setPhotoReelImages,
  setReelScript,
  setReelLocation,
  toggleReelCommenting,
  toggleReelLikeCount,
  toggleReelShareCount,
  toggleReelPinned,
} = reelSlice.actions;

export default reelSlice.reducer;
