import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: null,
  loading: false,
  errors: null,
};

export const getUsers = createAsyncThunk(
  "friend/getUserList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users/");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Creating Game");
    }
  }
);

const friendSlice = createSlice({
  name: "friend",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.game = action.payload.users;
      })
  }
});

export default friendSlice.reducer;