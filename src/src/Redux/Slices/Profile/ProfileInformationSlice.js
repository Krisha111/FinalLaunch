// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // -------------------- BASE API --------------------
// const API_URL = "http://localhost:8000/api/profileInformation";

// // -------------------- THUNKS --------------------

// // 1️⃣ Fetch profile by username
// // export const fetchProfile = createAsyncThunk(
// //   "profile/fetchProfile",
// //   async (username, { rejectWithValue }) => {
// //     try {
// //       const safeUsername = encodeURIComponent(username);
// //       const { data } = await axios.get(`${API_URL}/${safeUsername}`);
// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data?.message || error.message || "Failed to fetch profile"
// //       );
// //     }
// //   }
// // );
// export const fetchProfile = createAsyncThunk(
//   "profile/fetchProfile",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(`http://localhost:8000/api/profileInformation/byId/${userId}`);
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // ✅ Fetch profile by ID (new thunk)
// export const fetchProfileById = createAsyncThunk(
//   "profile/fetchProfileById",
//   async (id, { rejectWithValue }) => {
//     try {
//       const { data } = await axios.get(
//         `http://localhost:8000/api/profileInformation/byId/${id}`
//       );
//       return data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || error.message);
//     }
//   }
// );

// // 2️⃣ Update profile (name, bio, etc.)
// export const updateProfile = createAsyncThunk(
//   "profile/updateProfile",
//   async ({ username, updates }, { rejectWithValue }) => {
//     try {
//       const safeUsername = encodeURIComponent(username);
//       const { data } = await axios.put(`${API_URL}/${safeUsername}`, updates);
//       return data; // backend returns updated profile
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to update profile"
//       );
//     }
//   }
// );
// export const updateProfileImage = createAsyncThunk(
//   "profile/updateProfileImage",
//   async (imageData, { getState, rejectWithValue }) => {
//     try {
//       const state = getState();
//       const userId = state.signInAuth?.user?._id; // safer than username

//       if (!userId) throw new Error("No logged in user found");

//       const { data } = await axios.put(`${API_URL}/image`, {
//         userId,
//         profileImage: imageData,
//       });

//       return data;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to update profile image"
//       );
//     }
//   }
// );

// // 3️⃣ Update only the profile image
// // export const updateProfileImage = createAsyncThunk(
// //   "profile/updateProfileImage",
// //   async (imageData, { getState, rejectWithValue }) => {
// //     try {
// //       const state = getState();
// //       const username = state.signInAuth?.user?.username;
// //       if (!username) throw new Error("No logged in user found");

// //       const safeUsername = encodeURIComponent(username);
// //       const { data } = await axios.put(`${API_URL}/${safeUsername}/image`, {
// //         profileImage: imageData,
// //       });

// //       return data;
// //     } catch (error) {
// //       return rejectWithValue(
// //         error.response?.data?.message || error.message || "Failed to update profile image"
// //       );
// //     }
// //   }
// // );

// // -------------------- SLICE --------------------

// const profileInformationSlice = createSlice({
//   name: "profile",
//   // initialState: {
//   //   profile: null,
//   //   profileName: "",
//   //   profileBio: "",
//   //   profileImage: "",
//   //   loading: false,
//   //   error: null,
//   // },
//   initialState: {
//   profile: null,
//   profileName: "",
//   profileBio: "",
//   profileImage: "",
//   username: "",
//   reels: [],
//   reelsCount: 0,
//   loading: false,
//   error: null,
// },

//   reducers: {
//     clearProfile: (state) => {
//       state.profile = null;
//       state.profileName = "";
//       state.profileBio = "";
//       state.profileImage = "";
//       state.error = null;
//       localStorage.removeItem("profile");
//     },
//     setProfileName: (state, action) => {
//       state.profileName = action.payload;
//     },
//     setProfileBio: (state, action) => {
//       state.profileBio = action.payload;
//     },
//     setProfileImage: (state, action) => {
//       state.profileImage = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//      .addCase(fetchProfileById.pending, (state) => {
//     state.loading = true;
//     state.error = null;
//   })
//   .addCase(fetchProfileById.fulfilled, (state, action) => {
//   state.loading = false;
//   state.profile = action.payload;
//   state.profileName = action.payload?.name || "";
//   state.profileBio = action.payload?.bio || "";
//   state.profileImage = action.payload?.profileImage || "";
//   state.username = action.payload?.username || "";
//   state.reels = action.payload?.reels || [];
//   state.reelsCount = action.payload?.reelsCount || 0;
// })

//   .addCase(fetchProfileById.rejected, (state, action) => {
//     state.loading = false;
//     state.error = action.payload || "Failed to fetch profile";
//   })
//       // ----- FETCH PROFILE -----
//       .addCase(fetchProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//         state.profileName = action.payload?.name || "";
//         state.profileBio = action.payload?.bio || "";
//         state.profileImage = action.payload?.profileImage || "";
//         localStorage.setItem("profile", JSON.stringify(action.payload));
//       })
//       .addCase(fetchProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to fetch profile";
//       })

//       // ----- UPDATE PROFILE -----
//       .addCase(updateProfile.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProfile.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//         state.profileName = action.payload?.name || "";
//         state.profileBio = action.payload?.bio || "";
//         state.profileImage = action.payload?.profileImage || "";
//         localStorage.setItem("profile", JSON.stringify(action.payload));
//       })
//       .addCase(updateProfile.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to update profile";
//       })

//       // ----- UPDATE PROFILE IMAGE -----
//       .addCase(updateProfileImage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateProfileImage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.profile = action.payload;
//         state.profileImage = action.payload?.profileImage || "";
//         localStorage.setItem("profile", JSON.stringify(action.payload));
//       })
//       .addCase(updateProfileImage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to update profile image";
//       });
//   },
// });

// // -------------------- EXPORTS --------------------

// export const {
//   clearProfile,
//   setProfileName,
//   setProfileBio,
//   setProfileImage,
// } = profileInformationSlice.actions;

// export default profileInformationSlice.reducer;
