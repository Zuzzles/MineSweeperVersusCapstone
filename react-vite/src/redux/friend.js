import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  users: null,
  details: null,
  requested: null,
  loading: false,
  errors: null,
};

export const getUsers = createAsyncThunk(
  "friends/getUserList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users/");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in getting user list");
    }
  }
);

export const getFriendDetails = createAsyncThunk(
  "friends/getFriendDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users/friends");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in getting friends")
    }
  }
);

export const getRequestedFriends = createAsyncThunk(
  "friends/getRequestedFriends",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/users/requested_friends");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in getting friends")
    }
  }
);

export const createFriendRequest = createAsyncThunk(
  "friends/createFriendRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/friend/request/create/${id}`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in creating request")
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/friend/request/${id}/accept`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in creating request")
    }
  }
);

export const declineFriendRequest = createAsyncThunk(
  "friends/declineFriendRequest",
  async (id, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/users/friend/request/${id}/decline`);
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in creating request")
    }
  }
);

const friendSlice = createSlice({
  name: "friends/acceptFriendRequest",
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
        state.users = action.payload.users;
      })
      .addCase(getFriendDetails.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getFriendDetails.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getFriendDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.details = action.payload;
      })
      .addCase(getRequestedFriends.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(getRequestedFriends.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(getRequestedFriends.fulfilled, (state, action) => {
        state.loading = false;
        state.requested = action.payload.requestedFriends;
      })
      .addCase(createFriendRequest.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(createFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(createFriendRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(acceptFriendRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(declineFriendRequest.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(declineFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(declineFriendRequest.fulfilled, (state) => {
        state.loading = false;
      })
  }
});

export default friendSlice.reducer;