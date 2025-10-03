// src/redux/slices/reelNewDrop.js
//
// WARNING / NOTES:
// - This slice now normalizes and upserts updated reels into BOTH `reels` and `mainPageReels`
//   so UI components that read from either array will see updated like/comment data.
// - The commentOnReel thunk expects the backend to return the updated reel object. If your
//   backend returns `{ reel: {...} }`, this code will handle that. If the backend returns
//   a different shape, adapt the thunk's `return` accordingly.
// - If running on a physical device, replace `localhost` with your machine IP in BASE_URL.
// - Keep your backend endpoints consistent with the URLs below. Adjust BASE_URL if needed.
//
// Full updated slice file below (no code omitted):

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
      const { data } = await axios.get(`${BASE_URL}/user/${userId}`);
      return data; // array of reels
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || error.message || "Fetch failed"
      );
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
      // Expect backend to return the updated reel object
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------------------------
   ADD COMMENT TO A REEL
---------------------------------- */
// NOTE: using consistent action type "reelNewDrop/commentOnReel"
export const commentOnReel = createAsyncThunk(
  "reelNewDrop/commentOnReel",
  async ({ reelId, text }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const { data } = await axios.post(
        `${BASE_URL}/${reelId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // backend ideally returns the updated reel object. Accept either:
      // - data.reel
      // - data (if it's the reel directly)
      return data.reel ?? data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to comment"
      );
    }
  }
);

/* ---------------------------------
   Helper: upsert/replace updated reel in arrays
---------------------------------- */
function upsertReelToStateArrays(state, payloadReel) {
  const r = payloadReel?.reel ?? payloadReel; // handle both shapes
  if (!r || !r._id) return;

  // Update or insert into provided array (mutates state arrays)
  const replaceInArray = (arr) => {
    if (!Array.isArray(arr)) return;
    const idx = arr.findIndex((item) => item._id === r._id);
    if (idx !== -1) {
      // merge to keep other fields intact when possible
      arr[idx] = { ...arr[idx], ...r };
    } else {
      // Insert at start so new/updated reels appear first
      arr.unshift(r);
    }
  };

  replaceInArray(state.reels);
  replaceInArray(state.mainPageReels);
}

/* ---------------------------------
   SLICE
---------------------------------- */
const reelNewDrop = createSlice({
  name: "reelNewDrop",
  initialState: {
    mainPageReels: [],
    reels: [],
    loading: false,
    error: null,
  },
  reducers: {
    // (optional) local synchronous reducers can be added here if needed later
  },
  extraReducers: (builder) => {
    /* fetchReelsByUserId */
    builder
      .addCase(fetchReelsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReelsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.reels = action.payload;
      })
      .addCase(fetchReelsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    /* fetchAllReels */
    builder
      .addCase(fetchAllReels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReels.fulfilled, (state, action) => {
        state.loading = false;
        state.mainPageReels = action.payload;
      })
      .addCase(fetchAllReels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message;
      });

    /* fetchReels (user's reels) */
    builder
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
        state.error = action.payload || action.error?.message;
      });

    /* toggleLikeReel */
    builder
      .addCase(toggleLikeReel.pending, (state) => {
        // keep optimistic UI to components; server response will update state
        state.error = null;
      })
      .addCase(toggleLikeReel.fulfilled, (state, action) => {
        // action.payload should be updated reel (or { reel: updatedReel })
        upsertReelToStateArrays(state, action.payload);
      })
      .addCase(toggleLikeReel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
      });

    /* commentOnReel */
    builder
      .addCase(commentOnReel.pending, (state) => {
        state.error = null;
      })
      .addCase(commentOnReel.fulfilled, (state, action) => {
        // action.payload should be the updated reel
        upsertReelToStateArrays(state, action.payload);
      })
      .addCase(commentOnReel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
      });
  },
});

export default reelNewDrop.reducer;
