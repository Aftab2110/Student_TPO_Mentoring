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
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const DriveSchedule = () => {
  const [drives, setDrives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newDrive, setNewDrive] = useState({
    company: '',
    date: '',
    time: '',
    type: 'On-Campus',
    positions: '',
    eligibility: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = async () => {
    try {
      const response = await axios.get('/api/tpo/drives', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setDrives(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch drives');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch drives',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrive((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/tpo/drives',
        newDrive,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      toast({
        title: 'Success',
        description: 'Drive scheduled successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchDrives();
      setNewDrive({
        company: '',
        date: '',
        time: '',
        type: 'On-Campus',
        positions: '',
        eligibility: '',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to schedule drive',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'upcoming':
        return 'yellow';
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

  return (
    <Box p={5}>
      <Heading mb={5}>Placement Drives</Heading>

      <Button colorScheme="blue" mb={5} onClick={onOpen}>
        Schedule New Drive
      </Button>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Company</Th>
            <Th>Date & Time</Th>
            <Th>Type</Th>
            <Th>Positions</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {drives.map((drive) => (
            <Tr key={drive._id}>
              <Td>{drive.company}</Td>
              <Td>
                {new Date(drive.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
                {' '}
                {drive.time}
              </Td>
              <Td>{drive.type}</Td>
              <Td>{drive.positions}</Td>
              <Td>
                <Badge colorScheme={getStatusColor(drive.status)}>
                  {drive.status}
                </Badge>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule New Drive</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Company Name</FormLabel>
                  <Input
                    name="company"
                    value={newDrive.company}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    name="date"
                    value={newDrive.date}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    name="time"
                    value={newDrive.time}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Drive Type</FormLabel>
                  <Select
                    name="type"
                    value={newDrive.type}
                    onChange={handleInputChange}
                  >
                    <option value="On-Campus">On-Campus</option>
                    <option value="Off-Campus">Off-Campus</option>
                    <option value="Virtual">Virtual</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Positions</FormLabel>
                  <Input
                    name="positions"
                    value={newDrive.positions}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer, Data Analyst"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Eligibility Criteria</FormLabel>
                  <Input
                    name="eligibility"
                    value={newDrive.eligibility}
                    onChange={handleInputChange}
                    placeholder="e.g., CGPA > 7.5, No backlogs"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" type="submit">
                Schedule Drive
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DriveSchedule; 