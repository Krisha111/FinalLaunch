import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch items from backend
export const fetchItems = createAsyncThunk('items/fetchItems', async () => {
  const res = await fetch('http://192.168.0.100:5000/api/items');
  const data = await res.json();
  return data;
});

const itemsSlice = createSlice({
  name: 'items',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.list = action.payload;
      state.status = 'succeeded';
    });
  },
});

export default itemsSlice.reducer;
