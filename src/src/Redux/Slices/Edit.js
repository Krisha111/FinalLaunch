// // Edit.js
// import { createSlice } from '@reduxjs/toolkit';

// const profileEditSlice = createSlice({
//   name: 'profileEdit',
//   initialState: {
//     profileName: '',
//     profileBio: '',
//   },
//   reducers: {
//     setProfileName(state, action) {
//       state.profileName = action.payload;
//     },
//     setProfileBio(state, action) {
//       state.profileBio = action.payload;
//     },
//     saveProfileData(state) {
//       // This reducer would typically call a backend API
//       // or trigger some async logic. For now, it's just a placeholder.
//       console.log('Profile Data Saved:', {
//         name: state.profileName,
//         bio: state.profileBio,
//       });
//     },
//   },
// });

// export const { setProfileName, setProfileBio, saveProfileData } = profileEditSlice.actions;
// export default profileEditSlice.reducer;
