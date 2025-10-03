// redux/reelSideSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  tooltipText: '',
  liked: false,
  saved: false,
  showThreeDotsOption: false,
  isSidebarOpen: false,
};

const reelSideSlice = createSlice({
  name: 'reelSide',
  initialState,
  reducers: {
    setTooltipText: (state, action) => {
      state.tooltipText = action.payload;
    },
    toggleLiked: (state) => {
      state.liked = !state.liked;
    },
    toggleSaved: (state) => {
      state.saved = !state.saved;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    handleThreeDotsOptionOpen: (state) => {
      state.showThreeDotsOption = true;
    },
    handleThreeDotsOptionClose: (state) => {
      state.showThreeDotsOption = false;
    },
  },
});

export const {
  setTooltipText,
  toggleLiked,
  toggleSaved,
  toggleSidebar,
  handleThreeDotsOptionOpen,
  handleThreeDotsOptionClose,
} = reelSideSlice.actions;

export default reelSideSlice.reducer;
