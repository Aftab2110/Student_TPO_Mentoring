import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import studentReducer from './slices/studentSlice';
import jobReducer from './slices/jobSlice';
import applicationReducer from './slices/applicationSlice';
import companyReducer from './slices/companySlice';
import tpoReducer from './slices/tpoSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    students: studentReducer,
    jobs: jobReducer,
    applications: applicationReducer,
    companies: companyReducer,
    tpo: tpoReducer,
  },
}); 