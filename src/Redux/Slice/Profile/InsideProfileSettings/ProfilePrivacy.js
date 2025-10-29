// src/redux/slices/profileSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_CONFIG from "../../../../config/api";

// Safe base URL fallback if API_CONFIG is missing or undefined
const BASE_URL = (API_CONFIG && API_CONFIG.BASE_URL) ? API_CONFIG.BASE_URL : "https://finallaunchbackend.onrender.com/api/profilePrivacy";
const API_URL = `https://finallaunchbackend.onrender.com/api/profilePrivacy`;

// Create an axios instance so headers/base URL are consistent
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15_000, // 15s
});

// Helper to extract friendly error message
const extractError = (err) => {
  if (!err) return "Unknown error";
  if (err.response?.data) return err.response.data;
  if (err.message) return { message: err.message };
  return String(err);
};

// ✅ Thunk to fetch profile
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.get(`/api/profilePrivacy/${id}/privacy`, { headers });
      // return full response data (adjust if your API wraps in { profile: ... })
      return res.data;
    } catch (err) {
      console.error("fetchProfile error:", extractError(err));
      return thunkAPI.rejectWithValue(extractError(err));
    }
  }
);

// ✅ Thunk to update profile
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, updates }, thunkAPI) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await api.put(`/api/profilePrivacy/${id}/privacy`, updates, { headers });
      return res.data;
    } catch (err) {
      console.error("updateProfile error:", extractError(err));
      return thunkAPI.rejectWithValue(extractError(err));
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    // optional manual setter if you want to set profile locally
    setProfile(state, action) {
      state.profile = action.payload;
    },
    clearProfile(state) {
      state.profile = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        // If your API returns { profile: {...} } adapt here:
        // state.profile = action.payload.profile || action.payload;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Error fetching profile";
      })
      // ✅ handle updateProfile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Merge returned data into existing profile
        state.profile = { ...(state.profile || {}), ...(action.payload || {}) };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Error updating profile";
      });
  },
});

export const { setProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
