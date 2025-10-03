// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // -------------------- THUNKS --------------------

// // Remove background using remove.bg API
// export const removeBackgroundThunk = createAsyncThunk(
//   "background/removeBackground",
//   async (file, { rejectWithValue }) => {
//     if (!file) return rejectWithValue("No file provided");

//     const formData = new FormData();
//     formData.append("image_file", file);
//     formData.append("size", "auto");

//     try {
//       const response = await axios.post(
//         "https://api.remove.bg/v1.0/removebg",
//         formData,
//         {
//           headers: {
//             "X-Api-Key": "VLUJAFMH7ZA5Xqiviaj4KnYm", // replace with your API key
//           },
//           responseType: "blob",
//         }
//       );

//       const imageBlob = response.data;
//       const imageObjectURL = URL.createObjectURL(imageBlob);
//       return imageObjectURL;
//     } catch (error) {
//       return rejectWithValue(
//         error.response?.data?.errors?.[0]?.title || error.message || "Error removing background"
//       );
//     }
//   }
// );

// // -------------------- SLICE --------------------

// const initialState = {
//   selectedFile: null,              // raw uploaded file
//   outputImage: null,               // image with background removed
//   clothingBgColor: null,           // average clothing color
//   finalImageWithBackground: null,  // final image with background filled
//   loading: false,                  // API loading state
//   error: null,                     // error messages
// };

// const backgroundSlice = createSlice({
//   name: "background",
//   initialState,
//   reducers: {
//     setSelectedFile(state, action) {
//       state.selectedFile = action.payload;
//     },
//     clearOutput(state) {
//       state.outputImage = null;
//       state.clothingBgColor = null;
//       state.finalImageWithBackground = null;
//       state.error = null;
//     },
//     setClothingBgColor(state, action) {
//       state.clothingBgColor = action.payload;
//     },
//     setFinalImageWithBackground(state, action) {
//       state.finalImageWithBackground = action.payload;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // removeBackgroundThunk pending
//       .addCase(removeBackgroundThunk.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       // removeBackgroundThunk fulfilled
//       .addCase(removeBackgroundThunk.fulfilled, (state, action) => {
//         state.loading = false;
//         state.outputImage = action.payload;
//       })
//       // removeBackgroundThunk rejected
//       .addCase(removeBackgroundThunk.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || "Failed to remove background";
//       });
//   },
// });

// // -------------------- EXPORTS --------------------

// export const {
//   setSelectedFile,
//   clearOutput,
//   setClothingBgColor,
//   setFinalImageWithBackground,
// } = backgroundSlice.actions;

// export default backgroundSlice.reducer;
