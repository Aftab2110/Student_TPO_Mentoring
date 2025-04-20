import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Card,
  CardHeader,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useToast,
  SimpleGrid,
  Progress,
  Text
} from '@chakra-ui/react';
import axios from 'axios';

const TPODashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalStudents: 0,
    eligibilityStats: {},
    recentJobs: [],
    placementStats: {},
    branchStats: [],
    mentorshipStats: {
      totalSessions: 0,
      pendingMentorships: 0,
      completedMentorships: 0
    }
  });
  const toast = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardResponse, analyticsResponse] = await Promise.all([
        axios.get('/api/tpo/dashboard'),
        axios.get('/api/tpo/analytics')
      ]);

      setDashboardData({
        ...dashboardResponse.data,
        ...analyticsResponse.data
      });
    } catch (error) {
      toast({
        title: 'Error fetching dashboard data',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>TPO Dashboard</Heading>

      <StatGroup mb={8}>
        <Stat>
          <StatLabel>Total Students</StatLabel>
          <StatNumber>{dashboardData.totalStudents}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Eligible Students</StatLabel>
          <StatNumber>{dashboardData.eligibilityStats.approved || 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Pending Eligibility</StatLabel>
          <StatNumber>{dashboardData.eligibilityStats.pending || 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Total Mentorship Sessions</StatLabel>
          <StatNumber>{dashboardData.mentorshipStats.totalSessions}</StatNumber>
        </Stat>
      </StatGroup>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
        <Card>
          <CardHeader>
            <Heading size="md">Branch-wise Statistics</Heading>
          </CardHeader>
          <CardBody>
            {dashboardData.branchStats.map((stat) => (
              <Box key={stat._id} mb={4}>
                <Text fontWeight="bold">{stat._id}</Text>
                <Text>Students: {stat.studentCount}</Text>
                <Text mb={2}>Average CGPA: {stat.avgCGPA.toFixed(2)}</Text>
                <Progress
                  value={(stat.eligibleCount / stat.studentCount) * 100}
                  colorScheme="green"
                />
                <Text fontSize="sm">
                  {stat.eligibleCount} eligible out of {stat.studentCount} students
                </Text>
              </Box>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Recent Job Postings</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Company</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData.recentJobs.map((job) => (
                  <Tr key={job._id}>
                    <Td>{job.position}</Td>
                    <Td>{job.company}</Td>
                    <Td>
                      <Badge
                        colorScheme={job.status === 'active' ? 'green' : 'red'}
                      >
                        {job.status}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardHeader>
          <Heading size="md">Placement Statistics</Heading>
        </CardHeader>
        <CardBody>
          <Grid templateColumns="repeat(4, 1fr)" gap={4}>
            <Stat>
              <StatLabel>Total Applications</StatLabel>
              <StatNumber>
                {dashboardData.placementStats.applied || 0}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Shortlisted</StatLabel>
              <StatNumber>
                {dashboardData.placementStats.shortlisted || 0}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Interviewed</StatLabel>
              <StatNumber>
                {dashboardData.placementStats.interviewed || 0}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Placed</StatLabel>
              <StatNumber>
                {dashboardData.placementStats.placed || 0}
              </StatNumber>
            </Stat>
          </Grid>
        </CardBody>
      </Card>
    </Box>
  );
};

export default TPODashboard;