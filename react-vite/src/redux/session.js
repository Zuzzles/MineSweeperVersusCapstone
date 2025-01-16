import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  loading: false,
  errors: null,
};

export const thunkAuthenticate = createAsyncThunk(
  "session/authenticate",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/");
      const data = await res.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Error in Returning Current User");
    }
  }
);

export const thunkLogin = createAsyncThunk(
  "session/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Login Error");
    }
  }
);

export const thunkLogout = createAsyncThunk(
  "session/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      return data.message;
    } catch (error) {
      return rejectWithValue(error.message || "Logout Error");
    }
  }
);

export const thunkSignup = createAsyncThunk(
  "session/signup",
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return rejectWithValue(data);
      }
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Signup Error");
    }
  }
)

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(thunkAuthenticate.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(thunkAuthenticate.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(thunkAuthenticate.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(thunkLogin.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(thunkLogin.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(thunkLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(thunkLogout.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(thunkLogout.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(thunkLogout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
      })
      .addCase(thunkSignup.pending, (state) => {
        state.loading = true;
        state.errors = null;
      })
      .addCase(thunkSignup.rejected, (state, action) => {
        state.loading = false;
        state.errors = action.payload;
      })
      .addCase(thunkSignup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
  }
});

export default sessionSlice.reducer;
