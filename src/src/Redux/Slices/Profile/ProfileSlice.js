// // profileSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   selectedContent: null,
//   sideBarToggle: true,
// };

// export const profileSlice = createSlice({
//   name: 'profile',
//   initialState,
//   reducers: {
//     setSelectedContent:(state, action)=> {
//       state.selectedContent = action.payload;
//     },
//     clearSelectedContent:(state)=> {
//       state.selectedContent = null;
//     },
//     toggleSideBarTrue:(state) =>{
//       state.sideBarToggle = true;
//     },
//     toggleSideBarFalse:(state) =>{
//         state.sideBarToggle = false;
//       },
//   },
// });

// export const { setSelectedContent, clearSelectedContent, toggleSideBarTrue,toggleSideBarFalse } = profileSlice.actions;
// export default profileSlice.reducer;
