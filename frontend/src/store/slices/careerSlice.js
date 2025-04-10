import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  careerPath: null,
  analytics: null,
  mentoringSessions: [],
  resumeAnalysis: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get AI career path recommendations
export const getCareerPathRecommendations = createAsyncThunk(
  'career/getRecommendations',
  async (studentData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('/api/career/recommendations', studentData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get placement analytics
export const getPlacementAnalytics = createAsyncThunk(
  'career/getAnalytics',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get('/api/career/analytics', config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Schedule mentoring session
export const scheduleMentoring = createAsyncThunk(
  'career/scheduleMentoring',
  async (sessionData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.post('/api/career/mentoring', sessionData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get AI-powered resume analysis
export const analyzeResume = createAsyncThunk(
  'career/analyzeResume',
  async (resumeData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      const response = await axios.post('/api/career/resume-analysis', resumeData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const careerSlice = createSlice({
  name: 'career',
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
      // Career path recommendations cases
      .addCase(getCareerPathRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCareerPathRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.careerPath = action.payload;
      })
      .addCase(getCareerPathRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Analytics cases
      .addCase(getPlacementAnalytics.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPlacementAnalytics.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.analytics = action.payload;
      })
      .addCase(getPlacementAnalytics.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Mentoring session cases
      .addCase(scheduleMentoring.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(scheduleMentoring.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.mentoringSessions = [...state.mentoringSessions, action.payload];
      })
      .addCase(scheduleMentoring.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Resume analysis cases
      .addCase(analyzeResume.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.resumeAnalysis = action.payload;
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset } = careerSlice.actions;
export default careerSlice.reducer;