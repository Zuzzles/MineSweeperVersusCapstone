import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  init: null,
  game: null,
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
      return rejectWithValue(error.message || "Error in Creating Game");
    }
  }
);

export const getGame = createAsyncThunk(
  "game/get",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/game/get/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Game");
    }
  }
);

export const getActive = createAsyncThunk(
  "game/active",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/game/active');
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Game");
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
        state.game = action.payload.game;
        state.data = action.payload.game_tiles
      })
      .addCase(getGame.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getGame.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getGame.fulfilled, (state, action) => {
        state.loading = false;
        state.game = action.payload.game;
        state.data = action.payload.game_tiles;
      })
      .addCase(getActive.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getActive.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getActive.fulfilled, (state, action) => {
        state.loading = false;
        state.init = action.payload.game;
      })
  }
});

export default gameSlice.reducer;