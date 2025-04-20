import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await axios.get('/api/students/interviews', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setInterviews(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch interviews');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch interviews',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={5}>
      <Heading mb={5}>My Interviews</Heading>

      {interviews.length === 0 ? (
        <Text>No interviews scheduled yet.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Company</Th>
              <Th>Position</Th>
              <Th>Date & Time</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Location</Th>
            </Tr>
          </Thead>
          <Tbody>
            {interviews.map((interview) => (
              <Tr key={interview._id}>
                <Td>{interview.company}</Td>
                <Td>{interview.position}</Td>
                <Td>
                  {new Date(interview.dateTime).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </Td>
                <Td>{interview.type}</Td>
                <Td>
                  <Badge colorScheme={getStatusColor(interview.status)}>
                    {interview.status}
                  </Badge>
                </Td>
                <Td>{interview.location}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default Interviews; 