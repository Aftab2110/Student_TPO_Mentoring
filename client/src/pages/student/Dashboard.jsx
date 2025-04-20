import React, { useEffect, useState } from 'react';
import { Box, Grid, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, useToast, Spinner, Badge, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import api from '../../config/axios';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/student/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch dashboard data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const getEligibilityColor = (status) => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Box p={5} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Welcome, {user?.name}</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Applications</StatLabel>
            <StatNumber>{dashboardData?.applications || 0}</StatNumber>
            <StatHelpText>Total job applications</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Interviews</StatLabel>
            <StatNumber>{dashboardData?.interviews || 0}</StatNumber>
            <StatHelpText>Scheduled interviews</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Eligibility Status</StatLabel>
            <Badge colorScheme={getEligibilityColor(dashboardData?.eligibilityStatus)} fontSize="lg">
              {dashboardData?.eligibilityStatus?.toUpperCase() || 'PENDING'}
            </Badge>
            <StatHelpText>Your current status</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={5}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Recent Applications</Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Job Title</Th>
                <Th>Company</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dashboardData?.recentApplications?.map((application) => (
                <Tr key={application._id}>
                  <Td>{application.job?.title}</Td>
                  <Td>{application.job?.company}</Td>
                  <Td>{new Date(application.createdAt).toLocaleDateString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Student Details</Heading>
          <Box>
            <Text><strong>Branch:</strong> {dashboardData?.branch || 'Not specified'}</Text>
            <Text><strong>CGPA:</strong> {dashboardData?.cgpa || 'Not specified'}</Text>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;