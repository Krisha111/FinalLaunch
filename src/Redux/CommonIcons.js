// Edit.js
import { createSlice } from '@reduxjs/toolkit';

const commonIconSlice = createSlice({
  name: 'commonIcon',
  initialState: {
    shareButtonClicked: false,
    
  },
  reducers: {
    setShareButtonClicked(state, action) {
      state.shareButtonClicked = action.payload;
    },
  
   
  },
});

export const { setShareButtonClicked } = commonIconSlice.actions;
export default commonIconSlice.reducer;
