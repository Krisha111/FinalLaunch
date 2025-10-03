// // src/screens/Main.js
// import React, { useEffect, useState } from "react";
// import { View, StyleSheet } from "react-native";
// import ReelPlayer from "../components/ReelPlayer";
// import ChatBox from "../components/ChatBox";

// const Main = () => {
//   const [ws, setWs] = useState(null);

//   useEffect(() => {
//     const websocket = new WebSocket("ws://localhost:8000");
//     setWs(websocket);

//     return () => {
//       websocket.close();
//     };
//   }, []);

//   return (
//     <View style={styles.container}>
//       {ws && <ReelPlayer reel={reels[0]} ws={ws} />}
//       {ws && <ChatBox ws={ws} />}
//     </View>
//   );
// };

// // Dummy data for reels
// const reels = [
//   { id: 1, url: "https://www.w3schools.com/html/mov_bbb.mp4", title: "Reel 1" },
//   { id: 2, url: "https://www.w3schools.com/html/movie.mp4", title: "Reel 2" },
// ];

// export default Main;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f3f4f6", // gray-100
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
