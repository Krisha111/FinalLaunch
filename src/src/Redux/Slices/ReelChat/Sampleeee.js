// // redux/reelSideSlice.js
// import { createSlice } from '@reduxjs/toolkit';
// import reelchat from '../../../reelchat.mp4';
// import reelchatt from '../../../shreya.mp4';
// import reelchattt from '../../../shehzaankhan.mp4';
// const initialState = {
//   reels : [reelchat, reelchatt, reelchattt],
//   inputName: '',
//   onlineUsers: [],
//   chatWith: '',
//   room:'',
//   message: '',
//   chat:[],
//   isAdmin:null,
//   whoIsAdmin:'',
//   activeIndex:0,
  
// };

// const sampleeeeSlice = createSlice({
//   name: 'sampleeee',
//   initialState,
//   reducers: {
//       setReels: (state, action) => {
//       state.reels = action.payload;
//     },
//     setInputName: (state, action) => {
//       state.inputName = action.payload;
//     },
//     setOnlineUsers: (state, action) => {
//       state.onlineUsers = action.payload;
//     },
//     // setChatWith: (state, action) => {
//     //   state.chatWith = !state.saved;
//     // },
//       setChatWith: (state, action) => {
//       state.chatWith = action.payload;
//     },
//     setRoom: (state, action) => {
//       state.room = action.payload;
//     },
//     // setMessage: (state, action) => {
//     //   state.message = true;
//     // },
//      setMessage: (state, action) => {
//       state.message = action.payload;
//     },
//    setChat(state, action) {
//   state.chat = [...state.chat, action.payload];
// },
//      setIsAdmin: (state, action) => {
//       state.isAdmin = action.payload;
//     },
//      setWhoIsAdmin: (state, action) => {
//       state.whoIsAdmin = action.payload;
//     },
//      setActiveIndex: (state, action) => {
//       state.activeIndex = action.payload;
//     },
    
//   },
// });

// export const {
//   setInputName,
//   setOnlineUsers,
//   setChatWith,
//   setRoom,
//   setMessage,
//   setChat,
//   setIsAdmin,
//   setWhoIsAdmin,
//   setActiveIndex
// } = sampleeeeSlice.actions;

// export default sampleeeeSlice.reducer;
