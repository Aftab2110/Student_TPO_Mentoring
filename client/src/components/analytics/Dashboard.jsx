import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  Typography, 
  CircularProgress 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    averagePackage: 0,
    ongoingDrives: 0,
    placementData: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchStats = async () => {
      try {
        // Simulated data for demonstration
        const data = {
          totalStudents: 500,
          placedStudents: 350,
          averagePackage: 800000,
          ongoingDrives: 5,
          placementData: [
            { month: 'Jan', placements: 45 },
            { month: 'Feb', placements: 52 },
            { month: 'Mar', placements: 38 },
            { month: 'Apr', placements: 65 },
            { month: 'May', placements: 48 },
            { month: 'Jun', placements: 55 }
          ]
        };
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Placement Analytics Dashboard
      </Typography>
      
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Students
              </Typography>
              <Typography variant="h4">
                {stats.totalStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Placed Students
              </Typography>
              <Typography variant="h4">
                {stats.placedStudents}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Package (LPA)
              </Typography>
              <Typography variant="h4">
                {(stats.averagePackage / 100000).toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Ongoing Drives
              </Typography>
              <Typography variant="h4">
                {stats.ongoingDrives}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Monthly Placement Statistics
          </Typography>
          <Box sx={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={stats.placementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="placements" fill="#8884d8" name="Placements" />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard;