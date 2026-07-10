import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { settingsService } from '../../services/apiServices';

export const fetchPublicSettings = createAsyncThunk(
  'settings/fetchPublic',
  async (_, { rejectWithValue }) => {
    try {
      const response = await settingsService.getPublic();
      return response.data.data.settings;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch settings'
      );
    }
  }
);

const initialState = {
  data: {
    org_name: 'Anpuneri',
    org_tagline: 'Empowering Communities, Transforming Lives',
    org_email: 'info@ngo.org',
    org_phone: '+1 (555) 123-4567',
    org_address: '123 Community Lane, Hope District, City 10001',
    social_facebook: '',
    social_twitter: '',
    social_instagram: '',
    social_linkedin: '',
  },
  status: 'idle',
  error: null,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicSettings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPublicSettings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = { ...state.data, ...action.payload };
      })
      .addCase(fetchPublicSettings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export default settingsSlice.reducer;
