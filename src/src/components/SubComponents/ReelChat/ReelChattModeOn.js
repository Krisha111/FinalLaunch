// import React, { useEffect, useRef, useState } from 'react';

// import '../../../../src/components/Styles/ReelSide.css';
// import '../../../../src/components/Styles/ReelTalk.css';
// import socket from '../../socket.js';
// import { setSignUpUserName} from '../../../../src/Redux/Slices/Authentication/SignUp.js'

// import { useSelector,useDispatch } from 'react-redux';

// import { setInputName,
//   setOnlineUsers,
//   setChatWith,
//   setRoom,
//   setMessage,
//   setChat,
//   setIsAdmin,
//   setWhoIsAdmin,
//   setActiveIndex} from '../../../Redux/Slices/ReelChat/Sampleeee.js'

// export default function ReelChattModeOn() {
//   // const reels = [reelchat, reelchatt, reelchattt];
//   const {inputName, 
//     onlineUsers,
//   chatWith,
//   room,
//   message,
//   chat,
//   isAdmin,
//  } =useSelector((state)=>state.sampleeee)
// const signUpUserName = useSelector((state) => state.signInAuth.signUpUserName);


// const isAdminRef = useRef(isAdmin);
// useEffect(() => {
//   isAdminRef.current = isAdmin;
// }, [isAdmin]);
//   const videoRefs = useRef([]);
// const dispatch=useDispatch()
//   useEffect(() => {
//      socket.on('active_users', (users) => {
//     dispatch(setOnlineUsers(users));  // ✅ CORRECT
//   });

//     socket.on('receive_invite', ({ from }) => {
//       if (window.confirm(`Accept chat request from ${from}?`)) {
//         socket.emit('accept_invite', { from });
       
//         dispatch(setChatWith(from));
//         dispatch(setWhoIsAdmin(from))
        
//       }
//     });
//    socket.on('invite_accepted', ({ by, room }) => {
//   dispatch(setRoom(room));
//   dispatch(setIsAdmin(true)); // ✅ you are admin
//   dispatch(setChatWith(by));
 
// });

// socket.on('joined_room', ({ room }) => {
//      dispatch(setIsAdmin(false)); 
//   dispatch(setRoom(room));
  
// });
//     socket.on('receive_message', ({ sender, message }) => {
   
// dispatch(setChat({ sender, message }));


//     });
// socket.on('sync_reel_index', (index) => {
//   dispatch(setActiveIndex(index));

//    if (!isAdminRef.current && videoRefs.current[index]) {
//     videoRefs.current[index].scrollIntoView({ behavior: 'smooth' });

//     setTimeout(() => {
//       const video = videoRefs.current[index];
//       if (video) {
//         video.play().catch(err => console.log("Viewer autoplay failed:", err.message));
//       }
//     }, 300); // allow scroll to finish
//   }
// });

// socket.on('reel_play_state', ({ index, isPlaying }) => {
//   const video = videoRefs.current[index];
  
//   if (!video) {
//     console.log("❌ No video found at index", index);
//     return;
//   }
  
//   if (isAdmin) {
//     console.log("👑 Admin received reel_play_state but ignored it");
//     return;
//   }

//   console.log("📥 Viewer received play state:", index, isPlaying);

//   if (isPlaying) {
//     video.play().catch(err => console.log("Viewer play error:", err.message));
//   } else {
//     video.pause();
//   }
// });


//     return () => socket.off();
//   }, []);


  

//   useEffect(() => {
//   const observer = new IntersectionObserver(
//     (entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           const index = Number(entry.target.dataset.index);
//           if (isAdmin) {
//             socket.emit('change_reel_index', { room, index });
//             dispatch(setActiveIndex(index)); // Local state also updated
//           }
//         }
//       });
//     },
//     { threshold: 0.6 }
//   );

//   videoRefs.current.forEach((el) => el && observer.observe(el));
//   return () => videoRefs.current.forEach((el) => el && observer.unobserve(el));
// }, [isAdmin, room]);



 

//   const handleRegister = () => {
//     socket.emit('register', inputName);
//     dispatch(setSignUpUserName(inputName));
//   };

//   const sendInvite = (to) => {
//     socket.emit('send_invite', { to });
//   };

//   const sendMessage = () => {
//     if (message.trim() && room) {
//       socket.emit('send_message', { room, message, sender: signUpUserName });
//       dispatch(setMessage(''));
//     }
//   };

//   if (!signUpUserName) {
//     return (
//       <div>
//         <h2>Enter Username</h2>
//         <input value={inputName} onChange={(e) => dispatch(setInputName(e.target.value))} />
//         <button onClick={handleRegister}>Join</button>
//       </div>
//     );
//   }

//   if (!room) {
//     return (
//       <div>
//         <h2>Welcome {signUpUserName}</h2>
//         <h3>Online Users</h3>
//         {onlineUsers.filter((u) => u !== signUpUserName).map((u) => (
//           <div key={u}>
//             {u} <button onClick={() => sendInvite(u)}>Invite</button>
//           </div>
//         ))}
//       </div>
//     );
//   }


//   return (
//     <div>
//         <div className="chatSection">
//                 <div>Chat with {chatWith}</div>
//                <div>Admin: {isAdmin ? 'true' : 'false'}</div>
//                 <div className="chatMessages">
//                   {chat.map((c, i) => (
//                     <p key={i}><strong>{c.sender}:</strong> {c.message}</p>
//                   ))}
//                 </div>
//                 <input value={message} onChange={(e) => dispatch(setMessage(e.target.value))} />
//                 <button onClick={sendMessage}>Send</button>
//               </div>

//     </div>
//   )
// }
