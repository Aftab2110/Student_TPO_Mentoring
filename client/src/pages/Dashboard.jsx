import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import api from '../config/axios';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import {
  People as PeopleIcon,
  Work as WorkIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0,
    recentApplications: [],
    recentJobs: []
  });

  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('Fetching dashboard data...');
        const response = await api.get('/api/tpo/dashboard');
        console.log('Dashboard response:', response.data);

        // Validate response data
        if (!response.data) {
          throw new Error('No data received from server');
        }

        const {
          totalStudents = 0,
          totalJobs = 0,
          totalApplications = 0,
          recentApplications = [],
          recentJobs = []
        } = response.data;

        setDashboardData({
          totalStudents,
          totalJobs,
          totalApplications,
          recentApplications,
          recentJobs
        });
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'tpo') {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        TPO Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <PeopleIcon color="primary" style={{ fontSize: 40, marginRight: 16 }} />
                <Box>
                  <Typography variant="h6">Total Students</Typography>
                  <Typography variant="h4">{dashboardData.totalStudents}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WorkIcon color="primary" style={{ fontSize: 40, marginRight: 16 }} />
                <Box>
                  <Typography variant="h6">Total Jobs</Typography>
                  <Typography variant="h4">{dashboardData.totalJobs}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AssignmentIcon color="primary" style={{ fontSize: 40, marginRight: 16 }} />
                <Box>
                  <Typography variant="h6">Total Applications</Typography>
                  <Typography variant="h4">{dashboardData.totalApplications}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Applications */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Applications
              </Typography>
              <List>
                {dashboardData.recentApplications.map((application, index) => (
                  <React.Fragment key={application._id}>
                    <ListItem>
                      <ListItemText
                        primary={application.job?.title || 'N/A'}
                        secondary={`${application.student?.name || 'N/A'} - ${application.student?.email || 'N/A'}`}
                      />
                    </ListItem>
                    {index < dashboardData.recentApplications.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Jobs */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Jobs
              </Typography>
              <List>
                {dashboardData.recentJobs.map((job, index) => (
                  <React.Fragment key={job._id}>
                    <ListItem>
                      <ListItemText
                        primary={job.title || 'N/A'}
                        secondary={`${job.company || 'N/A'} - ${new Date(job.createdAt).toLocaleDateString()}`}
                      />
                    </ListItem>
                    {index < dashboardData.recentJobs.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
