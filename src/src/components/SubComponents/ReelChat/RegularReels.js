// import React, { useEffect, useRef } from 'react';
// import '../../Styles/ReelTalk.css';
// import '../../Styles/ReelSide.css';
// import '../../Styles/ReelChat/RegularReels.css';

// export default function RegularReels({ reel, index, activeIndex, setVideoRef, isAdmin, socket, room }) {
//   const videoRef = useRef(null);

//   // 🔁 Update play/pause based on active index and admin status
//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video) return;

//     if (index === activeIndex && isAdmin) {
//       video.play().catch(err => console.log("Admin autoplay failed:", err.message));
//     } else {
//       video.pause();
//     }
//   }, [activeIndex, index, isAdmin]);

//   // ✅ Admin toggles playback and emits state to others
//   const togglePlay = () => {
//     if (!isAdmin) return;
//     const video = videoRef.current;
//     if (!video) return;

//     const currentlyPlaying = !video.paused;

//     if (currentlyPlaying) {
//       video.pause();
//     } else {
//       video.play().catch(err => console.log("Play error:", err.message));
//     }

//     socket.emit('reel_play', {
//       room,
//       index,
//       isPlaying: !currentlyPlaying, // This reflects the new state
//     });

//     // console.log("⬆️ Emitted play_state", { room, index, isPlaying: !currentlyPlaying });
//   };

//   // Extract media URL
//   const mediaUrl = reel.videoUrl || reel.photoReelImages?.[0] || null;

//   // If no media, render empty div instead of returning early
//   if (!mediaUrl) return <div className="reelItem emptyReel" />;

//   return (
   
//       <video
//         ref={(el) => {
//           videoRef.current = el;
//           setVideoRef(el, index);
//         }}
//         className="video"
//         data-index={index}
//         onClick={togglePlay}
//         loop
//         muted
//         playsInline
    
//       >
//         <source src={mediaUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

   
 
//   );
// }
