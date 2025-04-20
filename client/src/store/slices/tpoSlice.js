import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001',
});

const initialState = {
  dashboardData: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get TPO dashboard data
export const getTPODashboardData = createAsyncThunk(
  'tpo/getDashboardData',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get('/api/tpo/dashboard', config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const tpoSlice = createSlice({
  name: 'tpo',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Get dashboard data
      .addCase(getTPODashboardData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTPODashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.dashboardData = action.payload;
      })
      .addCase(getTPODashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export default tpoSlice.reducer; 