import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  static: null,
  data: null,
  loading: false,
  errors: null,
};

export const createGame = createAsyncThunk(
  "game/initialize",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/game/init");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Current User");
    }
  }
);

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createGame.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(createGame.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(createGame.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
  }
});

export default gameSlice.reducer;