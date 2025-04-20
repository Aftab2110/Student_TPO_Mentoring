import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001',
});

const initialState = {
  students: [],
  currentStudent: null,
  academicRecords: [],
  skillsProgress: [],
  recommendations: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Get all students (TPO only)
export const getAllStudents = createAsyncThunk(
  'students/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get('/api/students', config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get student profile
export const getStudentProfile = createAsyncThunk(
  'students/getProfile',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user?.token;
      if (!token) {
        return thunkAPI.rejectWithValue('No authentication token found');
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get('/api/students/profile', config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update student profile
export const updateProfile = createAsyncThunk(
  'students/updateProfile',
  async (profileData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.put('/api/students/update-profile', profileData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update academic records
export const updateAcademicRecords = createAsyncThunk(
  'students/updateAcademicRecords',
  async (academicData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.put('/api/students/academics', academicData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Update skills
export const updateSkills = createAsyncThunk(
  'students/updateSkills',
  async (skillsData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.put('/api/students/skills', skillsData, config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Get skill recommendations
export const getSkillRecommendations = createAsyncThunk(
  'students/getSkillRecommendations',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await api.get('/api/students/skill-recommendations', config);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearCurrentStudent: (state) => {
      state.currentStudent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all students cases
      .addCase(getAllStudents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllStudents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.students = action.payload;
      })
      .addCase(getAllStudents.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get student profile cases
      .addCase(getStudentProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStudentProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentStudent = action.payload;
      })
      .addCase(getStudentProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.currentStudent = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update academic records cases
      .addCase(updateAcademicRecords.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateAcademicRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.academicRecords = action.payload;
      })
      .addCase(updateAcademicRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update skills cases
      .addCase(updateSkills.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateSkills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.skillsProgress = action.payload;
      })
      .addCase(updateSkills.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Get skill recommendations cases
      .addCase(getSkillRecommendations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSkillRecommendations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.recommendations = action.payload;
      })
      .addCase(getSkillRecommendations.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { reset, clearCurrentStudent } = studentSlice.actions;
export default studentSlice.reducer;