import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Input,
  Select,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  useDisclosure,
  NumberInput,
  NumberInputField,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import api from '../../config/axios';

const JobManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    type: '',
  });

  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    deadline: '',
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/jobs');
      if (response.data) {
        setJobs(response.data);
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to fetch jobs');
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch jobs',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/api/jobs', newJob);
      if (response.data) {
        toast({
          title: 'Success',
          description: 'Job posted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchJobs(); // Refresh the jobs list
        onClose();
        setNewJob({
          title: '',
          company: '',
          location: '',
          type: 'full-time',
          experience: '',
          salary: '',
          description: '',
          requirements: '',
          deadline: '',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to post job',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await api.delete(`/api/jobs/${jobId}`);
      toast({
        title: 'Success',
        description: 'Job deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchJobs(); // Refresh the jobs list
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete job',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const searchMatch =
      job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());
    const statusMatch = !filters.status || job.status === filters.status;
    const typeMatch = !filters.type || job.type === filters.type;
    return searchMatch && statusMatch && typeMatch;
  });

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
        <Button onClick={fetchJobs}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <HStack justify="space-between" mb={5}>
        <Heading>Job Management</Heading>
        <Button colorScheme="brand" onClick={onOpen}>
          Post New Job
        </Button>
      </HStack>

      <HStack spacing={4} mb={5}>
        <Input
          placeholder="Search jobs..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <Select
          placeholder="Status"
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </Select>
        <Select
          placeholder="Job Type"
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="full-time">Full-time</option>
          <option value="part-time">Part-time</option>
          <option value="internship">Internship</option>
        </Select>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Company</Th>
              <Th>Location</Th>
              <Th>Type</Th>
              <Th>Status</Th>
              <Th>Applications</Th>
              <Th>Deadline</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredJobs.map((job) => (
              <Tr key={job._id}>
                <Td>{job.title}</Td>
                <Td>{job.company}</Td>
                <Td>{job.location}</Td>
                <Td>
                  <Badge colorScheme="blue">{job.type}</Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={job.status === 'active' ? 'green' : 'red'}
                  >
                    {job.status}
                  </Badge>
                </Td>
                <Td>{job.applicants?.length || 0}</Td>
                <Td>{new Date(job.deadline).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDeleteJob(job._id)}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Post New Job</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Job Title</FormLabel>
                  <Input
                    name="title"
                    value={newJob.title}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Company</FormLabel>
                  <Input
                    name="company"
                    value={newJob.company}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Location</FormLabel>
                  <Input
                    name="location"
                    value={newJob.location}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Job Type</FormLabel>
                  <Select
                    name="type"
                    value={newJob.type}
                    onChange={handleInputChange}
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="internship">Internship</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Experience (years)</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      name="experience"
                      value={newJob.experience}
                      onChange={handleInputChange}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Salary</FormLabel>
                  <NumberInput min={0}>
                    <NumberInputField
                      name="salary"
                      value={newJob.salary}
                      onChange={handleInputChange}
                    />
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Requirements</FormLabel>
                  <Textarea
                    name="requirements"
                    value={newJob.requirements}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Application Deadline</FormLabel>
                  <Input
                    name="deadline"
                    type="date"
                    value={newJob.deadline}
                    onChange={handleInputChange}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="brand" type="submit">
                Post Job
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default JobManagement;