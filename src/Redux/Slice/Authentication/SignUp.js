// src/Redux/Slices/Authentication/signUpAuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = "http://192.168.2.16:8000"; 

// 🔹 SIGNUP
export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/signUp`, userData);
      const { token, user } = response.data;

      if (token) {
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
      }
      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Signup failed" });
    }
  }
);

// 🔹 SIGNIN
export const signInUser = createAsyncThunk(
  'auth/signInUser',
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

// 🔹 FETCH ME
export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
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
  }
);

// 🔹 FETCH USER BY ID (your snippet added here)
export const fetchUserById = createAsyncThunk(
  "auth/fetchUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_BASE}/api/profileInformation/byId/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Fetch user by id failed" });
    }
  }
);

// 🔹 UPDATE PROFILE IMAGE
export const updateProfileImage = createAsyncThunk(
  'auth/updateProfileImage',
  async (profileImage, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        `${API_BASE}/auth/profile-image`,
        { profileImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await AsyncStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: "Failed to update image" });
    }
  }
);

// 🔹 SLICE
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
      AsyncStorage.setItem('token', action.payload.token);
      AsyncStorage.setItem('user', JSON.stringify(state.user));
    },

    logout(state) {
      state.user = null;
      state.token = null;
      state.signUpUserName = '';
      state.signUpPassWord = '';
      state.signUpEmail = '';
      state.error = null;
      AsyncStorage.removeItem('token');
      AsyncStorage.removeItem('user');
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

      // UPDATE PROFILE IMAGE
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.user = { ...state.user, profileImage: action.payload.profileImage || "" };
        AsyncStorage.setItem("user", JSON.stringify(state.user));
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
