import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../config/axios';

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
  user: user || null,
  company: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: '',
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      let response;
      if (userData.role === 'company') {
        response = await api.post('/api/companies/register', userData);
      } else {
        response = await api.post('/api/users/register', userData);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('=== Auth Slice Login Debug ===');
      console.log('1. Login attempt with credentials:', { 
        email: credentials.email, 
        role: credentials.role 
      });
      
      let response;
      if (credentials.role === 'company') {
        response = await api.post('/api/companies/login', {
          email: credentials.email,
          password: credentials.password
        });
      } else {
        console.log('2. Attempting user login with role:', credentials.role);
        response = await api.post('/api/users/login', {
          email: credentials.email,
          password: credentials.password,
          role: credentials.role
        });
      }
      
      console.log('3. Login API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('4. Login error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Login failed. Please check your credentials and try again.'
      );
    }
  }
);

// Update user profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const response = await api.put('/api/users/profile', userData);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      // If token is invalid, logout the user
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('token');
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = '';
    },
    clearError: (state) => {
      state.isError = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.token = action.payload.token;
        if (action.payload.role === 'company') {
          state.company = action.payload;
          state.user = null;
          localStorage.setItem('user', JSON.stringify({ ...action.payload, role: 'company' }));
        } else {
          state.user = action.payload;
          state.company = null;
          localStorage.setItem('user', JSON.stringify({ ...action.payload, role: 'user' }));
        }
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log('=== Auth State Update Debug ===');
        console.log('1. Login fulfilled with payload:', action.payload);
        
        state.isLoading = false;
        state.isSuccess = true;
        state.isError = false;
        state.message = '';
        state.token = action.payload.token;
        
        if (action.payload.role === 'company') {
          state.company = { ...action.payload, role: 'company' };
          state.user = null;
          localStorage.setItem('user', JSON.stringify({ ...action.payload, role: 'company' }));
        } else {
          // For students and TPOs
          state.user = { ...action.payload, role: action.payload.role };
          state.company = null;
          localStorage.setItem('user', JSON.stringify({ ...action.payload, role: action.payload.role }));
        }
        localStorage.setItem('token', action.payload.token);
        
        console.log('2. Updated auth state:', {
          user: state.user,
          company: state.company,
          token: state.token
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Update profile cases
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Logout case
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.company = null;
        state.token = null;
        state.isSuccess = false;
        state.isError = false;
        state.message = '';
      });
  },
});

export const { reset, clearError } = authSlice.actions;
export default authSlice.reducer;