import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/apiServices';
import toast from 'react-hot-toast';

const getStoredUser = () => {
  try {
    const user = localStorage.getItem('ngo_user');
    return user ? JSON.parse(user) : null;
  } catch { return null; }
};

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await authService.login(credentials);
    const { user, token } = res.data.data;
    localStorage.setItem('ngo_token', token);
    localStorage.setItem('ngo_user', JSON.stringify(user));
    return { user, token };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const res = await authService.getMe();
    return res.data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (data, { rejectWithValue }) => {
  try {
    const res = await authService.updateProfile(data);
    const user = res.data.data.user;
    localStorage.setItem('ngo_user', JSON.stringify(user));
    return user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem('ngo_token'),
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem('ngo_token'),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('ngo_token');
      localStorage.removeItem('ngo_user');
      toast.success('Logged out successfully');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getMe.fulfilled, (state, action) => { state.user = action.payload; })
      .addCase(updateProfile.fulfilled, (state, action) => { state.user = action.payload; });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
