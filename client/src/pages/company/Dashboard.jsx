import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Heading,
  Text,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Flex,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Stack,
  StackDivider,
  Link,
  useColorModeValue,
  HStack,
  VStack,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { FiPlus, FiUsers, FiBriefcase, FiCalendar, FiTrendingUp } from 'react-icons/fi';
import api from '../../config/axios';

const CompanyDashboard = () => {
  const { company } = useSelector((state) => state.auth);
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/api/companies/dashboard');
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

  if (isLoading) {
    return (
      <Box p={5} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  const getApplicationStatusColor = (status) => {
    switch (status) {
      case 'accepted':
        return 'green';
      case 'rejected':
        return 'red';
      case 'interview_scheduled':
        return 'blue';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getJobStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'closed':
        return 'red';
      case 'draft':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={5}>
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="start" spacing={1}>
          <Heading size="lg">Welcome back, {company?.name}</Heading>
          <Text color="gray.500">Here's what's happening with your company</Text>
        </VStack>
        <Button
          as={RouterLink}
          to="/company/jobs/new"
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="blue"
          size="md"
        >
          Post New Job
        </Button>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={6}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <Box
                p={3}
                bg="blue.50"
                color="blue.500"
                borderRadius="lg"
              >
                <Icon as={FiBriefcase} boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Total Jobs</Text>
                <Text fontSize="2xl" fontWeight="bold">{dashboardData?.totalJobs || 0}</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <Box
                p={3}
                bg="green.50"
                color="green.500"
                borderRadius="lg"
              >
                <Icon as={FiUsers} boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Total Applications</Text>
                <Text fontSize="2xl" fontWeight="bold">{dashboardData?.totalApplications || 0}</Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <Box
                p={3}
                bg="purple.50"
                color="purple.500"
                borderRadius="lg"
              >
                <Icon as={FiCalendar} boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Interviews Scheduled</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {dashboardData?.recentApplications?.filter(app => app.status === 'interview_scheduled').length || 0}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>

        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardBody>
            <HStack spacing={4}>
              <Box
                p={3}
                bg="orange.50"
                color="orange.500"
                borderRadius="lg"
              >
                <Icon as={FiTrendingUp} boxSize={6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="sm" color="gray.500">Conversion Rate</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {dashboardData?.totalApplications && dashboardData?.totalJobs
                    ? `${Math.round((dashboardData.totalApplications / dashboardData.totalJobs) * 100)}%`
                    : '0%'}
                </Text>
              </VStack>
            </HStack>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
        <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md">Recent Applications</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Student</Th>
                  <Th>Job</Th>
                  <Th>Status</Th>
                  <Th>Date</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData?.recentApplications?.map((application) => (
                  <Tr key={application._id}>
                    <Td>
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium">{application.student?.name}</Text>
                        <Text fontSize="sm" color="gray.500">{application.student?.email}</Text>
                      </VStack>
                    </Td>
                    <Td>{application.job?.title}</Td>
                    <Td>
                      <Badge colorScheme={getApplicationStatusColor(application.status)}>
                        {application.status.replace('_', ' ')}
                      </Badge>
                    </Td>
                    <Td>{new Date(application.createdAt).toLocaleDateString()}</Td>
                    <Td>
                      <Button
                        as={RouterLink}
                        to={`/company/applications/${application._id}`}
                        size="sm"
                        variant="outline"
                      >
                        View
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>

        <Stack spacing={6}>
          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Recent Jobs</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                {dashboardData?.recentJobs?.map((job) => (
                  <Box key={job._id} p={4} borderWidth="1px" borderRadius="md">
                    <VStack align="start" spacing={2}>
                      <HStack justify="space-between" width="100%">
                        <Text fontWeight="medium">{job.title}</Text>
                        <Badge colorScheme={getJobStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Posted on {new Date(job.createdAt).toLocaleDateString()}
                      </Text>
                      <Progress
                        value={(job.applications || 0) * 20}
                        size="sm"
                        width="100%"
                        colorScheme="blue"
                      />
                      <Text fontSize="sm" color="gray.500">
                        {job.applications || 0} applications received
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </Stack>
            </CardBody>
          </Card>

          <Card bg={bgColor} borderWidth="1px" borderColor={borderColor}>
            <CardHeader>
              <Heading size="md">Quick Actions</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Button
                  as={RouterLink}
                  to="/company/jobs/new"
                  leftIcon={<Icon as={FiPlus} />}
                  colorScheme="blue"
                  variant="outline"
                >
                  Post New Job
                </Button>
                <Button
                  as={RouterLink}
                  to="/company/profile"
                  leftIcon={<Icon as={FiUsers} />}
                  colorScheme="purple"
                  variant="outline"
                >
                  Update Company Profile
                </Button>
                <Button
                  as={RouterLink}
                  to="/company/applications"
                  leftIcon={<Icon as={FiBriefcase} />}
                  colorScheme="green"
                  variant="outline"
                >
                  View All Applications
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </Grid>
    </Box>
  );
};

export default CompanyDashboard; 