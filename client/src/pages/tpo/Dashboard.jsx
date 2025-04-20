import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  GridItem,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    totalJobs: 0,
    totalApplications: 0,
    recentApplications: [],
    recentJobs: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'tpo') {
      navigate('/dashboard');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/tpo/dashboard');
      
      if (response.data) {
        setDashboardData({
          totalStudents: response.data.totalStudents || 0,
          totalJobs: response.data.totalJobs || 0,
          totalApplications: response.data.totalApplications || 0,
          recentApplications: response.data.recentApplications || [],
          recentJobs: response.data.recentJobs || []
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to fetch dashboard data');
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load dashboard data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={5}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button onClick={fetchDashboardData} colorScheme="blue">Retry</Button>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>TPO Dashboard</Heading>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Students</StatLabel>
              <StatNumber>{dashboardData.totalStudents}</StatNumber>
              <StatHelpText>Registered students</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Jobs</StatLabel>
              <StatNumber>{dashboardData.totalJobs}</StatNumber>
              <StatHelpText>Posted jobs</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Applications</StatLabel>
              <StatNumber>{dashboardData.totalApplications}</StatNumber>
              <StatHelpText>Job applications</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent Applications</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Student</Th>
                  <Th>Job</Th>
                  <Th>Date</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData.recentApplications.map((application) => (
                  <Tr key={application._id}>
                    <Td>{application.student.name}</Td>
                    <Td>{application.job.title}</Td>
                    <Td>{new Date(application.createdAt).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent Jobs</Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Company</Th>
                  <Th>Posted</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData.recentJobs.map((job) => (
                  <Tr key={job._id}>
                    <Td>{job.title}</Td>
                    <Td>{job.company}</Td>
                    <Td>{new Date(job.createdAt).toLocaleDateString()}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Grid>
    </Box>
  );
};

export default Dashboard;