// src/Redux/Slices/Authentication/signUpAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearReelState, fetchAllReels } from '../Profile/reelNewDrop.js'; // ✅ make sure path matches your setup

// ==========================================
// ✅ Cross-Platform Storage Wrapper
// ==========================================
const isWeb = Platform.OS === 'web';

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
const API_BASE = "https://finallaunchbackend.onrender.com"; // Change to your LAN IP / emulator / production

// ==========================================
// ✅ SIGNUP
// ==========================================
export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/signUp`, userData);
      const { token, user } = response.data;

      if (token) {
        await Storage.setItem('token', token);
        await Storage.setItem('user', JSON.stringify(user));
      }

      // ✅ Clear any previous reels and load fresh feed
      dispatch(clearReelState());
      dispatch(fetchAllReels());

      return { user, token };
    } catch (err) {
      console.error('signUpUser error:', err.response?.data || err.message || err);
      return rejectWithValue(err.response?.data || { message: "Signup failed" });
    }
  }
);

// ==========================================
// ✅ SIGNIN
// ==========================================
export const signInUser = createAsyncThunk(
  'auth/signInUser',
  async ({ username, email, password }, { rejectWithValue, dispatch }) => {
    try {
      const { data } = await axios.post(`${API_BASE}/auth/signIn`, { username, email, password });
      const { user, token } = data;

      if (token) {
        await Storage.setItem('token', token);
        await Storage.setItem('user', JSON.stringify(user));
      }

      // ✅ Clear and reload reels feed
      dispatch(clearReelState());
      dispatch(fetchAllReels());

      return { user, token };
    } catch (err) {
      console.error('signInUser error:', err.response?.data || err.message || err);
      return rejectWithValue(err.response?.data || { message: "Sign in failed" });
    }
  }
);

// ==========================================
// ✅ FETCH ME
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
      console.error('fetchMe error:', err.response?.data || err.message || err);
      return rejectWithValue(err.response?.data || { message: "Fetch me failed" });
    }
  }
);

// ==========================================
// ✅ FETCH USER BY ID
// ==========================================
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/api/profileInformation/byId/${userId}`);
      return res.data;
    } catch (err) {
      console.error('fetchUserById error:', err.response?.data || err.message || err);
      return rejectWithValue(err.response?.data || { message: "Fetch user by id failed" });
    }
  }
);

// ==========================================
// ✅ UPDATE PROFILE IMAGE
// ==========================================
export const updateProfileImage = createAsyncThunk(
  'auth/updateProfileImage',
  async (profileImage, { rejectWithValue }) => {
    try {
      const token = await Storage.getItem("token");
      if (!token) return rejectWithValue({ message: "No token found" });

      const response = await axios.put(
        `${API_BASE}/auth/profile-image`,
        { profileImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data.user || response.data;
      await Storage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      console.error('updateProfileImage error:', err.response?.data || err.message || err);
      return rejectWithValue(err.response?.data || { message: "Failed to update image" });
    }
  }
);

// ==========================================
// ✅ LOGOUT
// ==========================================
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    try {
      console.log("🧹 Logging out and clearing user data...");
      await Storage.removeItem('token');
      await Storage.removeItem('user');

      // ✅ Clear reels when logging out
      dispatch(clearReelState());
      dispatch(fetchAllReels());
    } catch (err) {
      console.error("Error during logout:", err);
    }

    dispatch(logout());
  }
);

// ==========================================
// ✅ SLICE
// ==========================================
const signUpAuthSlice = createSlice({
  name: 'auth',
  initialState: {
    signUpUserName: '',
    signUpPassWord: '',
    signUpEmail: '',
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSignUpUserName(state, action) { state.signUpUserName = action.payload; },
    setSignUpPassWord(state, action) { state.signUpPassWord = action.payload; },
    setSignUpEmail(state, action) { state.signUpEmail = action.payload; },
    saveSignUpUserName(state) { console.log('Username Saved:', state.signUpUserName); },

    setCredentials(state, action) {
      state.user = { ...action.payload.user, profileImage: action.payload.user?.profileImage || "" };
      state.token = action.payload.token;
      Storage.setItem('token', action.payload.token);
      Storage.setItem('user', JSON.stringify(state.user));
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.signUpUserName = '';
      state.signUpPassWord = '';
      state.signUpEmail = '';
      state.error = null;
      Storage.removeItem('token');
      Storage.removeItem('user');
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGNUP
      .addCase(signUpUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...action.payload.user, profileImage: action.payload.user?.profileImage || "" };
        state.token = action.payload.token;
        state.signUpUserName = action.payload.user?.username || '';
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Signup failed";
      })

      // SIGNIN
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

      // FETCH ME
      .addCase(fetchMe.pending, (state) => { state.loading = true; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
      })

      // FETCH USER BY ID
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      })

      // UPDATE PROFILE IMAGE
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.user = { ...state.user, profileImage: action.payload.profileImage || action.payload?.profileImage || "" };
        Storage.setItem("user", JSON.stringify(state.user));
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.error = action.payload?.message || state.error;
      });
  }
});

export const {
  setCredentials,
  logout,
  setSignUpUserName,
  setSignUpPassWord,
  setSignUpEmail,
  saveSignUpUserName
} = signUpAuthSlice.actions;

export default signUpAuthSlice.reducer;
