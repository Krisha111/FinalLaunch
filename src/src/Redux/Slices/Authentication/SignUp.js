// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// // 🔹 Async thunk for signup
// export const signUpUser = createAsyncThunk(
//   'auth/signUpUser',
//   async (userData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post('http://localhost:8000/auth/signUp', userData);
//       const { token, user } = response.data;

//       if (token) {
//         localStorage.setItem('token', token);
//         localStorage.setItem('user', JSON.stringify(user));
//       }

//       return { user, token };
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: "Signup failed" });
//     }
//   }
// );

// // 🔹 Async thunk for updating profile image
// export const updateProfileImage = createAsyncThunk(
//   'auth/updateProfileImage',
//   async (profileImage, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.put(
//         "http://localhost:8000/auth/profile-image",
//         { profileImage },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       localStorage.setItem("user", JSON.stringify(response.data.user));
//       return response.data.user;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: "Failed to update image" });
//     }
//   }
// );

// const signUpAuthSlice = createSlice({
//   name: 'signUpAuth',
//   initialState: {
//     signUpUserName: '',
//     signUpPassWord: '',
//     signUpEmail: '',
//     user: JSON.parse(localStorage.getItem('user')) || null,
//     token: localStorage.getItem('token') || null,
//     error: null,
//   },
//   reducers: {
//     setSignUpUserName(state, action) { state.signUpUserName = action.payload; },
//     setSignUpPassWord(state, action) { state.signUpPassWord = action.payload; },
//     setSignUpEmail(state, action) { state.signUpEmail = action.payload; },
//     saveSignUpUserName(state) { console.log('Username Saved:', state.signUpUserName); },

//     setCredentials(state, action) {
//       state.user = { ...action.payload.user, profileImage: action.payload.user?.profileImage || "" };
//       state.token = action.payload.token;
//       localStorage.setItem('token', action.payload.token);
//       localStorage.setItem('user', JSON.stringify(state.user));
//     },

//     logout(state) {
//       state.user = null;
//       state.token = null;
//       state.signUpUserName = '';
//       state.signUpPassWord = '';
//       state.signUpEmail = '';
//       state.error = null;
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(signUpUser.fulfilled, (state, action) => {
//       state.user = { ...action.payload.user, profileImage: action.payload.user?.profileImage || "" };
//       state.token = action.payload.token;
//       state.signUpUserName = action.payload.user?.username || '';
//       state.error = null;
//     });
//     builder.addCase(signUpUser.rejected, (state, action) => {
//       state.error = action.payload?.message || "Signup failed";
//     });
//     builder.addCase(updateProfileImage.fulfilled, (state, action) => {
//       state.user = { ...state.user, profileImage: action.payload.profileImage || "" };
//       localStorage.setItem("user", JSON.stringify(state.user));
//     });
//   }
// });

// export const { setCredentials, logout, setSignUpUserName, setSignUpPassWord, setSignUpEmail, saveSignUpUserName } = signUpAuthSlice.actions;
// export default signUpAuthSlice.reducer;
