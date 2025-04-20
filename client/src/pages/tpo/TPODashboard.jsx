import React, { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Heading,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Progress,
  Divider,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import api from '../../config/axios';

const TPODashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/tpo/dashboard');
      setDashboardData(response.data);
      setError(null);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  const placementRate = dashboardData?.placementStats?.placed
    ? ((dashboardData.placementStats.placed / dashboardData.totalStudents) * 100).toFixed(1)
    : 0;

  return (
    <Box p={5}>
      <Heading mb={5}>Welcome, {user?.name}</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Students</StatLabel>
              <StatNumber>{dashboardData?.totalStudents || 0}</StatNumber>
              <StatHelpText>Registered students</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Placed Students</StatLabel>
              <StatNumber>{dashboardData?.placementStats?.placed || 0}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {placementRate}% Placement Rate
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average Package</StatLabel>
              <StatNumber>₹{(dashboardData?.placementStats?.avgPackage || 0).toFixed(2)} LPA</StatNumber>
              <StatHelpText>For placed students</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Applications</StatLabel>
              <StatNumber>{dashboardData?.applicationStats?.pending || 0}</StatNumber>
              <StatHelpText>Pending reviews</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Recent Job Postings</Heading>
            <VStack align="stretch" spacing={3}>
              {dashboardData?.recentJobs?.map((job) => (
                <Box key={job._id} p={3} borderWidth="1px" borderRadius="md">
                  <Text fontWeight="bold">{job.position}</Text>
                  <Text color="gray.600">{job.company}</Text>
                  <HStack mt={2}>
                    <Badge colorScheme="green">{job.type}</Badge>
                    <Badge colorScheme="blue">{job.location}</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
              {(!dashboardData?.recentJobs || dashboardData.recentJobs.length === 0) && (
                <Text color="gray.500">No recent job postings</Text>
              )}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Eligibility Status</Heading>
            <VStack align="stretch" spacing={3}>
              {Object.entries(dashboardData?.eligibilityStats || {}).map(([status, count]) => (
                <Box key={status} p={3} borderWidth="1px" borderRadius="md">
                  <HStack justify="space-between">
                    <Text textTransform="capitalize">{status}</Text>
                    <Badge colorScheme={status === 'approved' ? 'green' : status === 'pending' ? 'yellow' : 'red'}>
                      {count}
                    </Badge>
                  </HStack>
                  <Progress
                    mt={2}
                    value={(count / dashboardData.totalStudents) * 100}
                    colorScheme={status === 'approved' ? 'green' : status === 'pending' ? 'yellow' : 'red'}
                  />
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="md" mb={4}>Branch-wise Placement Statistics</Heading>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {Object.entries(dashboardData?.branchStats || {}).map(([branch, stats]) => (
              <Box key={branch} p={3} borderWidth="1px" borderRadius="md">
                <Heading size="sm" mb={2}>{branch}</Heading>
                <VStack align="stretch" spacing={2}>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Total Students:</Text>
                    <Text fontWeight="bold">{stats.totalStudents}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Placed:</Text>
                    <Text fontWeight="bold">{stats.placedStudents}</Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Placement Rate:</Text>
                    <Badge colorScheme={stats.placementRate >= 75 ? 'green' : 'yellow'}>
                      {stats.placementRate}%
                    </Badge>
                  </HStack>
                  <Divider />
                  <HStack justify="space-between">
                    <Text fontSize="sm">Avg Package:</Text>
                    <Text fontWeight="bold">₹{stats.avgPackage} LPA</Text>
                  </HStack>
                  <Progress value={stats.placementRate} colorScheme={stats.placementRate >= 75 ? 'green' : 'yellow'} />
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default TPODashboard; 