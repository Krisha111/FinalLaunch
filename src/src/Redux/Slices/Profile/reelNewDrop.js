// src/redux/slices/reelNewDrop.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8000/api/reels";

/* ---------------------------------
   FETCH REELS BY USER ID
---------------------------------- */
export const fetchReelsByUserId = createAsyncThunk(
  "reelNewDrop/fetchReelsByUserId",
  async (userId, thunkAPI) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/reels/user/${userId}`);
      return data; // array of reels
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message || "Fetch failed");
    }
  }
);


/* ---------------------------------
   FETCH ALL USERS' REELS (Feed)
---------------------------------- */
export const fetchAllReels = createAsyncThunk(
  "reelNewDrop/fetchAllReels",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/all`);
      return data; // all reels (public feed)
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

/* ---------------------------------
   FETCH LOGGED-IN USER'S REELS
---------------------------------- */
export const fetchReels = createAsyncThunk(
  "reelNewDrop/fetchReels",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) return thunkAPI.rejectWithValue("No token found");

    try {
      const { data } = await axios.get(`${BASE_URL}/getNewReelDrop`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return data; // reels belonging to logged-in user
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Fetch failed");
    }
  }
);

/* ---------------------------------
   LIKE / UNLIKE A REEL
---------------------------------- */
export const toggleLikeReel = createAsyncThunk(
  "reelNewDrop/toggleLikeReel",
  async ({ reelId }, thunkAPI) => {
    const token = localStorage.getItem("token");
    if (!token) return thunkAPI.rejectWithValue("No token found");

    try {
      const { data } = await axios.post(
        `${BASE_URL}/${reelId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data; // updated reel
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------------------------
   ADD COMMENT TO A REEL
---------------------------------- */
// export const commentOnReel = createAsyncThunk(
//   "reelNewDrop/commentOnReel",
//   async ({ reelId, text }, thunkAPI) => {
//     const token = localStorage.getItem("token");
//     if (!token) return thunkAPI.rejectWithValue("No token found");

//     try {
//       const { data } = await axios.post(
//         `${BASE_URL}/${reelId}/comment`,
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data; // backend returns updated reel
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
export const commentOnReel = createAsyncThunk(
  "reels/commentOnReel",
  async ({ reelId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `http://localhost:8000/api/reels/${reelId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
     
      return data.reel; // now backend returns { reel: ... }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to comment"
      );
    }
  }
);

// export const commentOnReel = createAsyncThunk(
//   "reels/commentOnReel",
//   async ({ reelId, text }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.post(
//         `http://localhost:8000/api/reels/${reelId}/comment`, // 🔥 singular
//         { text },
//         { headers: { Authorization: `Bearer ${token}` } } // 🔥 add auth
//       );
//       return data.reel; // backend should return updated reel
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.message || error.message || "Failed to comment"
//       );
//     }
//   }
// );




/* ---------------------------------
   SLICE
---------------------------------- */
const reelNewDrop = createSlice({
  name: "reelNewDrop",
  initialState: {
    reels: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
     .addCase(fetchReelsByUserId.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchReelsByUserId.fulfilled, (state, action) => {
      state.loading = false;
      state.reels = action.payload; // replace reels with profile user's reels
    })
    .addCase(fetchReelsByUserId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || action.error.message;
    })
      /* ✅ Fetch all reels */
      .addCase(fetchAllReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReels.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(fetchAllReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* ✅ Fetch user reels */
      .addCase(fetchReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReels.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(fetchReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* ✅ Toggle like */
      .addCase(toggleLikeReel.fulfilled, (state, action) => {
        const updatedReel = action.payload;
        const index = state.reels.findIndex((r) => r._id === updatedReel._id);
        if (index !== -1) {
          state.reels[index] = { ...state.reels[index], ...updatedReel };
        }
      })
.addCase(commentOnReel.fulfilled, (state, action) => {
  const updatedReel = action.payload;
  if (!updatedReel || !updatedReel._id) return;

  const index = state.reels.findIndex(r => r._id === updatedReel._id);
  if (index !== -1) {
    // Replace the object completely to trigger re-render
    state.reels[index] = { ...updatedReel }; 
  } else {
    state.reels.unshift({ ...updatedReel }); // add new reel if missing
  }
});


      
//       .addCase(commentOnReel.fulfilled, (state, action) => {
//   const updatedReel = action.payload;
//   if (!updatedReel || !updatedReel._id) return; // safety check

//   const index = state.reels.findIndex((r) => r._id === updatedReel._id);
//   if (index !== -1) {
//     state.reels[index] = updatedReel;
//   }
// });

  },
});

export default reelNewDrop.reducer;
