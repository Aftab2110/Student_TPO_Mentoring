import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import CompanyRegister from './pages/auth/CompanyRegister';
import CompanyLogin from './pages/auth/CompanyLogin';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentProfile from './pages/student/Profile';
import JobListings from './pages/student/JobListings';
import JobDetails from './pages/student/JobDetails';
import AppliedJobs from './pages/student/AppliedJobs';

// TPO Pages
import TPODashboard from './pages/tpo/Dashboard';
import StudentManagement from './pages/tpo/StudentManagement';
import JobManagement from './pages/tpo/JobManagement';
import TPOProfile from './pages/tpo/Profile';
import Analytics from './pages/tpo/Analytics';
import DriveSchedule from './pages/tpo/DriveSchedule';
import Chat from './pages/chat/Chat';

// Company Pages
import CompanyDashboard from './pages/company/Dashboard';
import CompanyProfile from './pages/company/Profile';

// Shared Pages
import NotFound from './pages/NotFound';

function App() {
  const { user, company } = useSelector((state) => state.auth);

  // Determine the default route based on user role
  const getDefaultRoute = () => {
    if (company) return '/company/dashboard';
    if (user?.role === 'student') return '/dashboard';
    if (user?.role === 'tpo') return '/tpo';
    return '/login';
  };

  // Debug auth state
  console.log('Auth State:', { user, company });

  return (
    <Box minH="100vh" bg="gray.50">
      <Routes>
        {/* Root Route */}
        <Route
          path="/"
          element={
            user || company ? (
              <Navigate to={getDefaultRoute()} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/company" element={<CompanyRegister />} />
        <Route path="/login/company" element={<CompanyLogin />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Student Routes */}
            <Route
              path="/dashboard"
              element={
                user?.role === 'student' ? (
                  <StudentDashboard />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/profile"
              element={
                user?.role === 'student' ? (
                  <StudentProfile />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/jobs"
              element={
                user?.role === 'student' ? (
                  <JobListings />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/jobs/:id"
              element={
                user?.role === 'student' ? (
                  <JobDetails />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/applied-jobs"
              element={
                user?.role === 'student' ? (
                  <AppliedJobs />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />

            {/* TPO Routes */}
            <Route
              path="/tpo"
              element={
                user?.role === 'tpo' ? (
                  <TPODashboard />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/tpo/profile"
              element={
                user?.role === 'tpo' ? (
                  <TPOProfile />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/students"
              element={
                user?.role === 'tpo' ? (
                  <StudentManagement />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/manage-jobs"
              element={
                user?.role === 'tpo' ? (
                  <JobManagement />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/analytics"
              element={
                user?.role === 'tpo' ? (
                  <Analytics />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/drive-schedule"
              element={
                user?.role === 'tpo' ? (
                  <DriveSchedule />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />

            {/* Company Routes */}
            <Route
              path="/company/dashboard"
              element={
                company ? (
                  <CompanyDashboard />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
                )
              }
            />
            <Route
              path="/company/profile"
              element={
                company ? (
                  <CompanyProfile />
                ) : (
                  <Navigate to={getDefaultRoute()} replace />
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