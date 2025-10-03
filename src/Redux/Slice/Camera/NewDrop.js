import { createSlice } from '@reduxjs/toolkit';

const newDropSettingSlice = createSlice({
  name: 'newDropSetting',
  initialState: {
    newDropSetting: false,
    
  },
  reducers: {
    setnewDropSetting(state, action) {
      state.newDropSetting = action.payload;
    },
  
 
  },
});

export const {
  setnewDropSetting,
 
} = newDropSettingSlice.actions;
export default newDropSettingSlice.reducer;
