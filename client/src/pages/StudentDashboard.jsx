import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Stack,
  Text,
  Badge,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    eligibilityStatus: 'pending',
    mentoringSessions: [],
    recommendedJobs: [],
    profile: {}
  });
  const [selectedSession, setSelectedSession] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileResponse, sessionsResponse, jobsResponse] = await Promise.all([
        axios.get('/api/students/profile'),
        axios.get('/api/students/mentoring-sessions'),
        axios.get('/api/students/recommended-jobs')
      ]);

      setDashboardData({
        eligibilityStatus: profileResponse.data.studentDetails.eligibility,
        mentoringSessions: sessionsResponse.data,
        recommendedJobs: jobsResponse.data,
        profile: profileResponse.data
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

  const viewSessionDetails = (session) => {
    setSelectedSession(session);
    onOpen();
  };

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

  return (
    <Box p={4}>
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
        <Card>
          <CardHeader>
            <Heading size="md">Eligibility Status</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              <Box>
                <Text fontWeight="bold">Current Status:</Text>
                <Badge colorScheme={getEligibilityColor(dashboardData.eligibilityStatus)}>
                  {dashboardData.eligibilityStatus.toUpperCase()}
                </Badge>
              </Box>
              {dashboardData.profile.studentDetails && (
                <>
                  <Text>
                    <strong>CGPA:</strong> {dashboardData.profile.studentDetails.cgpa}
                  </Text>
                  <Text>
                    <strong>Branch:</strong> {dashboardData.profile.studentDetails.branch}
                  </Text>
                </>
              )}
            </Stack>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Recent Mentoring Sessions</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={4}>
              {dashboardData.mentoringSessions.map((session) => (
                <Box
                  key={session._id}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  cursor="pointer"
                  onClick={() => viewSessionDetails(session)}
                  _hover={{ bg: 'gray.50' }}
                >
                  <Text fontWeight="bold">
                    Session Date: {new Date(session.date).toLocaleDateString()}
                  </Text>
                  <Text noOfLines={2}>{session.notes}</Text>
                </Box>
              ))}
            </Stack>
          </CardBody>
        </Card>

        <Card gridColumn={{ md: 'span 2' }}>
          <CardHeader>
            <Heading size="md">Recommended Jobs</Heading>
          </CardHeader>
          <CardBody>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Position</Th>
                  <Th>Company</Th>
                  <Th>Match Score</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {dashboardData.recommendedJobs.map((job) => (
                  <Tr key={job._id}>
                    <Td>{job.position}</Td>
                    <Td>{job.company}</Td>
                    <Td>
                      <Badge colorScheme={job.matchScore > 80 ? 'green' : 'yellow'}>
                        {job.matchScore}%
                      </Badge>
                    </Td>
                    <Td>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigate(`/jobs/${job._id}`)}
                      >
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </CardBody>
        </Card>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mentoring Session Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedSession && (
              <Stack spacing={4}>
                <Text>
                  <strong>Date:</strong>{' '}
                  {new Date(selectedSession.date).toLocaleDateString()}
                </Text>
                <Text>
                  <strong>TPO:</strong> {selectedSession.tpo.name}
                </Text>
                <Box>
                  <Text fontWeight="bold" mb={2}>Session Notes:</Text>
                  <Text>{selectedSession.notes}</Text>
                </Box>
              </Stack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentDashboard;