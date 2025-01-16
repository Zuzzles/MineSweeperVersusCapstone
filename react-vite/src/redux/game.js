import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  requestTo: null,
  requestsFor: null,
  init: null,
  game: null,
  data: null,
  loading: false,
  errors: null,
};

export const createRequest = createAsyncThunk(
  "game/requestIssue",
  async ({ opponentID, hostColor }, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/game/request/issue', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ opponentID, hostColor }),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Game Request Error");
    }
  } 
)

export const getRequestsFor = createAsyncThunk(
  "game/getRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/game/request/get');
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in getting requests")
    }
  }
);

export const getRequestTo = createAsyncThunk(
  "game/getRequest",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('/api/game/request/self');
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in getting request")
    }
  }
);

export const cancelRequest = createAsyncThunk(
  "game/deleteRequest",
  async (id, { rejectWithValue }) => {
    try {
      await fetch(`/api/game/request/delete/${id}`, {
        method: "DELETE",
      });
      return;
    } catch (error) {
      return rejectWithValue(error.message || "Delete request failed");
    }
  }
);

export const createGame = createAsyncThunk(
  "game/initialize",
  async ({ hostID, opponentID, hostColor, opponentColor }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/game/init", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          hostID,
          opponentID,
          hostColor,
          opponentColor 
        })
      });
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
      .addCase(createRequest.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(createRequest.fulfilled, (state) => {
        state.loading = false;
        // state.requestTo = action.payload.request;
      })
      .addCase(getRequestsFor.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getRequestsFor.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getRequestsFor.fulfilled, (state, action) => {
        state.loading = false;
        state.requestsFor = action.payload.requests;
      })
      .addCase(getRequestTo.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getRequestTo.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getRequestTo.fulfilled, (state, action) => {
        state.loading = false;
        state.requestTo = action.payload.request;
      })
      .addCase(cancelRequest.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(cancelRequest.fulfilled, (state) => {
        state.loading = false;
        state.requestTo = null;
      })
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
        state.init = action.payload.game;
        state.game = action.payload.game_data;
        state.data = action.payload.game_tiles;
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