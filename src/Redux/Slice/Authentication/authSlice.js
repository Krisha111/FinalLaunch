// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Import reel actions to clear/fetch reel state on auth changes
import { clearReelState, fetchAllReels } from "../../Slice/Profile/reelNewDrop.js";

// ==========================================
// ✅ Cross-Platform Storage Wrapper
// ==========================================
const isWeb = Platform.OS === "web";

const Storage = {
  setItem: async (key, value) => {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (err) {
      console.error("Error saving to storage:", err);
    }
  },

  getItem: async (key) => {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      } else {
        return await AsyncStorage.getItem(key);
      }
    } catch (err) {
      console.error("Error reading from storage:", err);
      return null;
    }
  },

  removeItem: async (key) => {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch (err) {
      console.error("Error removing from storage:", err);
    }
  },
};

// ==========================================
// ✅ API BASE URL CONFIGURATION
// ==========================================
const API_BASE = "https://finallaunchbackend.onrender.com"; // 👈 Change to your LAN IP / emulator / production

// ==========================================
// ✅ SIGN UP THUNK
// ==========================================
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      console.log("Signing up user:", username, email);

      const { data } = await axios.post(`${API_BASE}/auth/signUp`, {
        username,
        email,
        password,
      });

      const { user, token } = data;

      if (token) {
        await Storage.setItem("token", token);
        await Storage.setItem("user", JSON.stringify(user));
      }

      // Clear any stale reels and fetch fresh feed
      try {
        thunkAPI.dispatch(clearReelState());
        thunkAPI.dispatch(fetchAllReels());
      } catch (e) {
        console.warn("Warning: failed to refresh reels after signUp:", e);
      }

      return { user, token };
    } catch (err) {
      console.error("Sign-up error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Sign up failed" });
    }
  }
);

// ==========================================
// ✅ SIGN IN THUNK
// ==========================================
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ username, email, password }, thunkAPI) => {
    try {
      console.log("Signing in user:", username, email);

      const { data } = await axios.post(`${API_BASE}/auth/signIn`, {
        username,
        email,
        password,
      });

      const { user, token } = data;

      if (token) {
        await Storage.setItem("token", token);
        await Storage.setItem("user", JSON.stringify(user));
      }

      // Clear stale reels and fetch fresh feed
      try {
        thunkAPI.dispatch(clearReelState());
        thunkAPI.dispatch(fetchAllReels());
      } catch (e) {
        console.warn("Warning: failed to refresh reels after signIn:", e);
      }

      return { user, token };
    } catch (err) {
      console.error("Sign-in error:", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Sign in failed" });
    }
  }
);

// ==========================================
// ✅ FETCH CURRENT USER THUNK
// ==========================================
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const token = await Storage.getItem("token");
      if (!token) return rejectWithValue({ message: "No token found" });

      const { data } = await axios.get(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return data.user;
    } catch (err) {
      console.error("Fetch me error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || { message: "Fetch me failed" });
    }
  }
);

// ==========================================
// ✅ RESTORE SESSION THUNK (NEW)
// ==========================================
export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (_, { dispatch }) => {
    try {
      const token = await Storage.getItem("token");
      const userJson = await Storage.getItem("user");
      const user = userJson ? JSON.parse(userJson) : null;

      if (token && user) {
        dispatch(clearReelState());
        dispatch(fetchAllReels());
        return { token, user };
      }

      return { token: null, user: null };
    } catch (err) {
      console.error("Restore session failed:", err);
      return { token: null, user: null };
    }
  }
);

// ==========================================
// ✅ LOGOUT THUNK
// ==========================================
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { dispatch }) => {
    try {
      console.log("🧹 Logging out and clearing storage...");
      if (isWeb) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } else {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Error clearing auth data:", err);
    }

    dispatch(clearAuth());
    try {
      dispatch(clearReelState());
    } catch (e) {
      console.warn("Warning: failed to clear reel state on logout:", e);
    }
  }
);

// ==========================================
// ✅ AUTH SLICE
// ==========================================
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGN UP
      .addCase(signUpUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signUpUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(signUpUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // SIGN IN
      .addCase(signInUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signInUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload.user; state.token = action.payload.token; })
      .addCase(signInUser.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      // FETCH ME
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(fetchMe.rejected, (state) => { state.loading = false; state.user = null; state.token = null; })
      // RESTORE SESSION
      .addCase(restoreSession.pending, (state) => { state.loading = true; })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(restoreSession.rejected, (state) => { state.loading = false; state.user = null; state.token = null; });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;
