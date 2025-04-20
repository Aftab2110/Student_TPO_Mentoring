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
  Button,
  Input,
  Select,
  HStack,
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  Text,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios';

const StudentManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    search: '',
    department: '',
    year: '',
    placementStatus: '',
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'tpo') {
      navigate('/dashboard');
      return;
    }
    fetchStudents();
  }, [user, navigate]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/students');
      if (response.data && Array.isArray(response.data)) {
        // Ensure each student has the required properties and format the data properly
        const formattedStudents = response.data.map(student => ({
          _id: student._id || '',
          name: student.name || '',
          email: student.email || '',
          phone: student.phone || '',
          studentDetails: {
            branch: student.studentDetails?.branch || '',
            year: student.studentDetails?.year || '',
            cgpa: student.studentDetails?.cgpa || '',
            placementStatus: typeof student.studentDetails?.placementStatus === 'string' 
              ? student.studentDetails.placementStatus 
              : 'not_placed',
            skills: Array.isArray(student.studentDetails?.skills) 
              ? student.studentDetails.skills.map(skill => typeof skill === 'string' ? skill : skill.name || '')
              : []
          }
        }));
        setStudents(formattedStudents);
      } else {
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      const errorMessage = error.response?.data?.message || 'Failed to fetch students';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
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

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    onOpen();
  };

  const filteredStudents = students.filter((student) => {
    if (!student || typeof student !== 'object') return false;
    
    const searchMatch =
      (student.name?.toLowerCase() || '').includes(filters.search.toLowerCase()) ||
      (student.email?.toLowerCase() || '').includes(filters.search.toLowerCase());

    const departmentMatch =
      !filters.department || student.studentDetails?.branch === filters.department;

    const yearMatch =
      !filters.year || student.studentDetails?.year === filters.year;

    const statusMatch =
      !filters.placementStatus ||
      student.studentDetails?.placementStatus === filters.placementStatus;

    return searchMatch && departmentMatch && yearMatch && statusMatch;
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
        <Button onClick={fetchStudents}>Retry</Button>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Student Management</Heading>

      <HStack spacing={4} mb={5}>
        <Input
          placeholder="Search students..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <Select
          placeholder="Department"
          name="department"
          value={filters.department}
          onChange={handleFilterChange}
        >
          <option value="CSE">Computer Science</option>
          <option value="IT">Information Technology</option>
          <option value="ECE">Electronics</option>
          <option value="ME">Mechanical</option>
        </Select>
        <Select
          placeholder="Year"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
        >
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </Select>
        <Select
          placeholder="Placement Status"
          name="placementStatus"
          value={filters.placementStatus}
          onChange={handleFilterChange}
        >
          <option value="placed">Placed</option>
          <option value="not_placed">Not Placed</option>
          <option value="in_process">In Process</option>
        </Select>
      </HStack>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Department</Th>
              <Th>Year</Th>
              <Th>CGPA</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <Tr key={student._id}>
                  <Td>{student.name}</Td>
                  <Td>{student.email}</Td>
                  <Td>{student.studentDetails.branch}</Td>
                  <Td>{student.studentDetails.year}</Td>
                  <Td>{student.studentDetails.cgpa}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        student.studentDetails?.placementStatus === 'placed'
                          ? 'green'
                          : student.studentDetails?.placementStatus === 'in_process'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {typeof student.studentDetails?.placementStatus === 'string' 
                        ? student.studentDetails.placementStatus.replace('_', ' ')
                        : 'Not Placed'}
                    </Badge>
                  </Td>
                  <Td>
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleViewDetails(student)}
                    >
                      View Details
                    </Button>
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  No students found
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedStudent && (
              <VStack spacing={4} align="stretch" p={4}>
                <Box>
                  <Text fontWeight="bold">Name</Text>
                  <Text>{selectedStudent.name}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Email</Text>
                  <Text>{selectedStudent.email}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Phone</Text>
                  <Text>{selectedStudent.phone}</Text>
                </Box>
                <Divider />
                <Box>
                  <Text fontWeight="bold">Department</Text>
                  <Text>{selectedStudent.studentDetails.branch}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Year</Text>
                  <Text>{selectedStudent.studentDetails.year}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">CGPA</Text>
                  <Text>{selectedStudent.studentDetails.cgpa}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold">Placement Status</Text>
                  <Badge
                    colorScheme={
                      selectedStudent.studentDetails?.placementStatus === 'placed'
                        ? 'green'
                        : selectedStudent.studentDetails?.placementStatus === 'in_process'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {typeof selectedStudent.studentDetails?.placementStatus === 'string'
                      ? selectedStudent.studentDetails.placementStatus.replace('_', ' ')
                      : 'Not Placed'}
                  </Badge>
                </Box>
                <Box>
                  <Text fontWeight="bold">Skills</Text>
                  <HStack spacing={2} flexWrap="wrap">
                    {selectedStudent.studentDetails.skills.length > 0 ? (
                      selectedStudent.studentDetails.skills.map((skill, index) => (
                        <Badge key={index} colorScheme="blue">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <Text>No skills added</Text>
                    )}
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentManagement;