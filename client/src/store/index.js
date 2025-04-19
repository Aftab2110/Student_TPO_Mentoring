import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import jobReducer from './slices/jobSlice';
import studentReducer from './slices/studentSlice';
import chatReducer from './slices/chatSlice';
import careerReducer from './slices/careerSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    students: studentReducer,
    chat: chatReducer,
    career: careerReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;