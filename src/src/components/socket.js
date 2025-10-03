// // src/utils/socket.js
// import { io } from "socket.io-client";
// import store from "../Redux/store";

// // ⚠️ IMPORTANT: Replace localhost with your machine's IP when testing on emulator/real device
// // Example: http://192.168.0.105:8000
// const SOCKET_URL = "http://192.168.0.105:8000";

// const socket = io(SOCKET_URL, {
//   transports: ["websocket"],
//   withCredentials: true,
// });

// // Register logged-in user
// export function registerUserOnSocket(userId) {
//   if (userId) {
//     socket.emit("register_user", userId);
//   }
// }

// export default socket;
