// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// export default function Test() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const response = await axios.get('/mainPage');
//         setUser(response.data);
//       } catch (error) {
//         console.error('Failed to fetch user:', error);
//         navigate('/SignIn');
//       }
//     };

//     fetchUser();
//   }, [navigate]);

//   const handleLogout = async () => {
//     try {
//       await axios.post('/logout');
//       navigate('/login');
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   return (
//     <div>
//       {user ? (
//         <div>
//           <h1>Welcome, {user.name}</h1>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// };


