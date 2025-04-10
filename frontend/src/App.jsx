import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import JobListings from './pages/student/JobListings';
import JobDetails from './pages/student/JobDetails';

// TPO Pages
import TPODashboard from './pages/tpo/Dashboard';
import StudentManagement from './pages/tpo/StudentManagement';
import JobManagement from './pages/tpo/JobManagement';

// Shared Pages
import Chat from './pages/chat/Chat';
import NotFound from './pages/NotFound';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Student Routes */}
            <Route
              path="/"
              element={
                user?.role === 'student' ? (
                  <StudentDashboard />
                ) : user?.role === 'tpo' ? (
                  <TPODashboard />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                user?.role === 'student' ? (
                  <StudentProfile />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/jobs"
              element={
                user?.role === 'student' ? (
                  <JobListings />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/jobs/:id"
              element={
                user?.role === 'student' ? (
                  <JobDetails />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* TPO Routes */}
            <Route
              path="/students"
              element={
                user?.role === 'tpo' ? (
                  <StudentManagement />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/manage-jobs"
              element={
                user?.role === 'tpo' ? (
                  <JobManagement />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />

            {/* Shared Routes */}
            <Route path="/chat" element={<Chat />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Box>
  );
}

export default App;