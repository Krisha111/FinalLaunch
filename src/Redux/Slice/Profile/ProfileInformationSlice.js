// src/Redux/Slice/Profile/ProfileInformationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// -------------------- BASE API --------------------
const API_URL = "http://192.168.2.16:8000/api/profileInformation"; // replace with your PC IP

// -------------------- THUNKS --------------------

// Fetch profile by ID
export const fetchProfileById = createAsyncThunk(
  "profile/fetchProfileById",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/byId/${id}`);
      // Ensure profileImage is full URL
      if (data.profileImage && data.profileImage.startsWith("/uploads")) {
        data.profileImage = `${API_URL}${data.profileImage}`;
      }
      await AsyncStorage.setItem("profile", JSON.stringify(data));
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update profile (name, bio, image URI)
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ username, updates }, { rejectWithValue }) => {
    try {
      const safeUsername = encodeURIComponent(username);

      let formData;
      let isFileUpload = false;

      // Check if profileImage is local file
      if (
  updates.profileImage?.startsWith("file://") ||
  updates.profileImage?.startsWith("blob:")
) {
  formData = new FormData();

  let uri = updates.profileImage;

  // On web, fetch blob and convert to File
  if (uri.startsWith("blob:") && typeof window !== "undefined") {
    const response = await fetch(uri);
    const blob = await response.blob();
    const file = new File([blob], "profile.jpg", { type: blob.type });
    formData.append("profileImage", file);
  } else {
    // Mobile: file:// URI
    formData.append("profileImage", {
      uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
  }

  if (updates.name) formData.append("name", updates.name);
  if (updates.bio) formData.append("bio", updates.bio);
  isFileUpload = true;
}


      // If not a local file, just send JSON
      const config = {
        headers: isFileUpload
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" },
      };

      const body = isFileUpload ? formData : updates;

      const { data } = await axios.put(`${API_URL}/${safeUsername}`, body, config);

      // Ensure profileImage is full URL
      if (data.profileImage && data.profileImage.startsWith("/uploads")) {
        data.profileImage = `${API_URL}${data.profileImage}`;
      }

      await AsyncStorage.setItem("profile", JSON.stringify(data));
   
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Failed to update profile");
    }
  }
);

// Load profile from AsyncStorage
export const loadProfileFromStorage = createAsyncThunk(
  "profile/loadProfileFromStorage",
  async (_, { rejectWithValue }) => {
    try {
      const profileJSON = await AsyncStorage.getItem("profile");
      if (!profileJSON) return null;
      return JSON.parse(profileJSON);
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load profile");
    }
  }
);

// -------------------- SLICE --------------------
const profileInformationSlice = createSlice({
  name: "profile",
  initialState: {
    profile: null,
    profileName: "",
    profileBio: "",
    profileImage: "",
    username: "",
    reels: [],
    reelsCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.profileName = "";
      state.profileBio = "";
      state.profileImage = "";
      state.username = "";
      state.reels = [];
      state.reelsCount = 0;
      state.error = null;
      AsyncStorage.removeItem("profile");
    },
    setProfileName: (state, action) => {
      state.profileName = action.payload;
    },
    setProfileBio: (state, action) => {
      state.profileBio = action.payload;
    },
    setProfileImage: (state, action) => {
      state.profileImage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load from AsyncStorage
      .addCase(loadProfileFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.profile = action.payload;
          state.profileName = action.payload.name || "";
          state.profileBio = action.payload.bio || "";
          state.profileImage = action.payload.profileImage || "";
          state.username = action.payload.username || "";
          state.reels = action.payload.reels || [];
          state.reelsCount = action.payload.reelsCount || 0;
        }
      })

      // Fetch profile by ID
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.profileName = action.payload?.name || "";
        state.profileBio = action.payload?.bio || "";
        state.profileImage = action.payload?.profileImage || "";
        state.username = action.payload?.username || "";
        state.reels = action.payload?.reels || [];
        state.reelsCount = action.payload?.reelsCount || 0;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch profile";
      })

      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
        state.profileName = action.payload?.name || "";
        state.profileBio = action.payload?.bio || "";
        state.profileImage = action.payload?.profileImage || "";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.error = action.payload || "Failed to update profile";
      });
  },
});

// -------------------- EXPORTS --------------------
export const { clearProfile, setProfileName, setProfileBio, setProfileImage } =
  profileInformationSlice.actions;

export default profileInformationSlice.reducer;
