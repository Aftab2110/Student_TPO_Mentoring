import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

const JobManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

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
      // TODO: Implement job creation logic
      toast({
        title: 'Job posted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error posting job',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Mock data - replace with actual API data
  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'Full-time',
      status: 'Active',
      applications: 15,
      deadline: '2024-02-15',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Web Solutions',
      location: 'Hybrid',
      type: 'Full-time',
      status: 'Closed',
      applications: 25,
      deadline: '2024-01-30',
    },
  ];

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
            {jobs.map((job) => (
              <Tr key={job.id}>
                <Td>{job.title}</Td>
                <Td>{job.company}</Td>
                <Td>{job.location}</Td>
                <Td>
                  <Badge colorScheme="blue">{job.type}</Badge>
                </Td>
                <Td>
                  <Badge
                    colorScheme={job.status === 'Active' ? 'green' : 'red'}
                  >
                    {job.status}
                  </Badge>
                </Td>
                <Td>{job.applications}</Td>
                <Td>{new Date(job.deadline).toLocaleDateString()}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button size="sm" colorScheme="blue">
                      Edit
                    </Button>
                    <Button size="sm" colorScheme="red">
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
                    placeholder="Enter job title"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Company</FormLabel>
                  <Input
                    name="company"
                    value={newJob.company}
                    onChange={handleInputChange}
                    placeholder="Enter company name"
                  />
                </FormControl>

                <HStack spacing={4} width="100%">
                  <FormControl isRequired>
                    <FormLabel>Location</FormLabel>
                    <Select
                      name="location"
                      value={newJob.location}
                      onChange={handleInputChange}
                    >
                      <option value="remote">Remote</option>
                      <option value="onsite">On-site</option>
                      <option value="hybrid">Hybrid</option>
                    </Select>
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
                </HStack>

                <HStack spacing={4} width="100%">
                  <FormControl isRequired>
                    <FormLabel>Experience (years)</FormLabel>
                    <Input
                      name="experience"
                      value={newJob.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 0-2 years"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Salary Range</FormLabel>
                    <Input
                      name="salary"
                      value={newJob.salary}
                      onChange={handleInputChange}
                      placeholder="e.g., $60,000 - $80,000"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Job Description</FormLabel>
                  <Textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    placeholder="Enter detailed job description"
                    size="sm"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Requirements</FormLabel>
                  <Textarea
                    name="requirements"
                    value={newJob.requirements}
                    onChange={handleInputChange}
                    placeholder="Enter job requirements (one per line)"
                    size="sm"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Application Deadline</FormLabel>
                  <Input
                    name="deadline"
                    value={newJob.deadline}
                    onChange={handleInputChange}
                    type="date"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="gray" mr={3} onClick={onClose}>
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