// ✅ src/redux/slices/reelNewDrop.js — FINAL FIXED VERSION
import API_CONFIG from "../../../config/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "https://finallaunchbackend.onrender.com/api/reels";

/* ---------------------------------
   FETCH REELS BY USER ID
---------------------------------- */
export const fetchReelsByUserId = createAsyncThunk(
  "reelNewDrop/fetchReelsByUserId",
  async (userId, thunkAPI) => {
    // console.log("userId", userId);
    try {
      const { data } = await axios.get(`${BASE_URL}/user/${userId}`);
      // console.log(data, "fetched reels");
      return data; // array of reels
    } catch (error) {
      // ✅ Treat 404 as "no reels" (empty array)
      if (error.response && error.response.status === 404) {
        return [];
      }
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
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("No token found");

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
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return thunkAPI.rejectWithValue("No token found");

      const { data } = await axios.post(
        `${BASE_URL}/${reelId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ---------------------------------
   ADD COMMENT TO A REEL
---------------------------------- */
export const commentOnReel = createAsyncThunk(
  "reelNewDrop/commentOnReel",
  async ({ reelId, text }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return rejectWithValue("No token found");

      const { data } = await axios.post(
        `${BASE_URL}/${reelId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
  const r = payloadReel?.reel ?? payloadReel;
  if (!r || !r._id) return;

  const replaceInArray = (arr) => {
    if (!Array.isArray(arr)) return;
    const idx = arr.findIndex((item) => item._id === r._id);
    if (idx !== -1) arr[idx] = { ...arr[idx], ...r };
    else arr.unshift(r);
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
    // ✅ NEW: Clear all reels when user logs out or signs up
    clearReelState: (state) => {
      state.mainPageReels = [];
      state.reels = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* ---------- fetchReelsByUserId ---------- */
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
        state.error =
          action.payload || action.error?.message || "Failed to fetch reels by user";
      })

      /* ---------- fetchAllReels ---------- */
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
        state.error =
          action.payload || action.error?.message || "Failed to fetch all reels";
      })

      /* ---------- fetchReels (logged-in user) ---------- */
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
        state.error =
          action.payload || action.error?.message || "Failed to fetch user reels";
      })

      /* ---------- toggleLikeReel ---------- */
      .addCase(toggleLikeReel.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleLikeReel.fulfilled, (state, action) => {
        upsertReelToStateArrays(state, action.payload);
      })
      .addCase(toggleLikeReel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
      })

      /* ---------- commentOnReel ---------- */
      .addCase(commentOnReel.pending, (state) => {
        state.error = null;
      })
      .addCase(commentOnReel.fulfilled, (state, action) => {
        upsertReelToStateArrays(state, action.payload);
      })
      .addCase(commentOnReel.rejected, (state, action) => {
        state.error = action.payload || action.error?.message;
      });
  },
});

/* ---------------------------------
   EXPORTS
---------------------------------- */
export const { clearReelState } = reelNewDrop.actions;
export default reelNewDrop.reducer;
