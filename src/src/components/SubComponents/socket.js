// src/utils/socket.js
import { io } from "socket.io-client";
import store from "../../Redux/store";
import { addNotification } from "../../Redux/Notification/NotificationSlice";

// ⚠️ IMPORTANT: Replace localhost with your machine's LAN IP when testing
// Example: http://192.168.0.105:8000
const SOCKET_URL = "http://192.168.0.105:8000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: false, // manually connect after user login
});

// Listen for new notifications from server
socket.on("notification:new", (notification) => {
  console.log("📩 New notification:", notification);
  store.dispatch(addNotification(notification));
});

export default socket;
