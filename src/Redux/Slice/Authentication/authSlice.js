// src/store/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// const API_BASE = "http://192.168.2.16:8000"; 
// replace localhost with LAN IP if testing on device
const API_BASE = "http://localhost:8000"; 
// Sign up thunk
export const signUpUser = createAsyncThunk(
  "auth/signUpUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      console.log( username, email, password )
      const { data } = await axios.post(`${API_BASE}/auth/signUp`, { username, email, password });
      const { user, token } = data;

      if (token) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Sign up failed" });
    }
  }
);

// Sign in thunk
export const signInUser = createAsyncThunk(
  "auth/signInUser",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/auth/signIn`, { username, email, password });
      const { user, token } = data;

      if (token) {
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
      }

      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Sign in failed" });
    }
  }
);

// Fetch current user
export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return rejectWithValue({ message: "No token found" });
    const { data } = await axios.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data || { message: "Fetch me failed" });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      AsyncStorage.removeItem("token");
      AsyncStorage.removeItem("user");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(signInUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
