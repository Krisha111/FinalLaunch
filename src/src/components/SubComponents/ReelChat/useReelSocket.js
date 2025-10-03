// import { useEffect } from 'react';
// import socket from '../socket';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   setOnlineUsers,
//   setChatWith,
//   setRoom,
//   setMessage,
//   setChat,
//   setIsAdmin,
//   setWhoIsAdmin,
//   setActiveIndex
// } from '../Redux/Slices/ReelChat/Sampleeee';

// export const useReelSocket = (videoRefs) => {
//   const dispatch = useDispatch();
//   const { chat, isAdmin, room } = useSelector((state) => state.sampleeee);

//   useEffect(() => {
//     socket.on('active_users', (users) => {
//       dispatch(setOnlineUsers(users));
//     });

//     socket.on('receive_invite', ({ from }) => {
//       if (window.confirm(`Accept chat request from ${from}?`)) {
//         socket.emit('accept_invite', { from });
//         dispatch(setChatWith(from));
//         dispatch(setWhoIsAdmin(from));
//       }
//     });

//     socket.on('invite_accepted', ({ by, room }) => {
//       dispatch(setRoom(room));
//       dispatch(setIsAdmin(true));
//       dispatch(setChatWith(by));
//     });

//     socket.on('joined_room', ({ room }) => {
//       dispatch(setIsAdmin(false));
//       dispatch(setRoom(room));
//     });

//     socket.on('receive_message', ({ sender, message }) => {
//       dispatch(setChat({ sender, message }));
//     });

//     socket.on('sync_reel_index', (index) => {
//       dispatch(setActiveIndex(index));

//       if (!isAdmin && videoRefs.current[index]) {
//         videoRefs.current[index].scrollIntoView({ behavior: 'smooth' });
//         setTimeout(() => {
//           const video = videoRefs.current[index];
//           if (video) {
//             video.play().catch(err => console.log("Viewer autoplay failed:", err.message));
//           }
//         }, 300);
//       }
//     });

//     socket.on('reel_play_state', ({ index, isPlaying }) => {
//       const video = videoRefs.current[index];
//       if (!video) return;

//       if (isAdmin) return;

//       if (isPlaying) {
//         video.play().catch(err => console.log("Viewer play error:", err.message));
//       } else {
//         video.pause();
//       }
//     });

//     return () => socket.off();
//   }, [dispatch, chat, isAdmin, room]);
// };
