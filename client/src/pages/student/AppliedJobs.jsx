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
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  Button,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import api from '../../config/axios';
import { useNavigate } from 'react-router-dom';

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchAppliedJobs();
  }, [user, navigate]);

  const fetchAppliedJobs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get('/api/students/applied-jobs');
      
      // Ensure we're working with an array
      const jobs = Array.isArray(response.data) ? response.data : [];
      setAppliedJobs(jobs);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch applied jobs';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'yellow';
      case 'shortlisted':
        return 'green';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
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

  if (!appliedJobs || appliedJobs.length === 0) {
    return (
      <Box p={5}>
        <Heading mb={5}>Applied Jobs</Heading>
        <Alert status="info">
          <AlertIcon />
          You haven't applied to any jobs yet.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Applied Jobs</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Company</Th>
            <Th>Position</Th>
            <Th>Location</Th>
            <Th>Type</Th>
            <Th>Applied Date</Th>
            <Th>Status</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {appliedJobs.map((job) => (
            <Tr key={job._id}>
              <Td>{job.job?.company || 'N/A'}</Td>
              <Td>{job.job?.position || 'N/A'}</Td>
              <Td>{job.job?.location || 'N/A'}</Td>
              <Td>{job.job?.type || 'N/A'}</Td>
              <Td>
                {job.appliedAt
                  ? new Date(job.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  : 'N/A'}
              </Td>
              <Td>
                <Badge colorScheme={getStatusColor(job.status)}>
                  {job.status || 'Pending'}
                </Badge>
              </Td>
              <Td>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => navigate(`/jobs/${job.job?._id}`)}
                >
                  View Details
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AppliedJobs; 