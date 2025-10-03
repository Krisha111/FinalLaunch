// redux/reelSideSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedOption: '',
  switchScreen: false,
  reelChattModeOn: false,
  showThreeDotsOption: false,
  isSidebarOpen: false,
};

const reelChatPopUpSlice = createSlice({
  name: 'reelChatPopUp',
  initialState,
  reducers: {
    setSelectedOption: (state, action) => {
      state.selectedOption = action.payload;
    },
   setSwitchScreen: (state, action) => {
      state.switchScreen = action.payload;
    },
    setReelChattModeOn: (state, action) => {
      state.reelChattModeOn = action.payload;
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
  setSelectedOption,
  setSwitchScreen,
  setReelChattModeOn,
  toggleSidebar,
  handleThreeDotsOptionOpen,
  handleThreeDotsOptionClose,
} = reelChatPopUpSlice.actions;

export default reelChatPopUpSlice.reducer;
