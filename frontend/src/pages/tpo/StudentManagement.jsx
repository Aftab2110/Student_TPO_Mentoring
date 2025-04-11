import React, { useState } from 'react';
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
} from '@chakra-ui/react';
import { useDispatch } from 'react-redux';

const StudentManagement = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [filters, setFilters] = useState({
    search: '',
    department: '',
    year: '',
    placementStatus: '',
  });

  const [selectedStudent, setSelectedStudent] = useState(null);

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

  // Mock data - replace with actual API data
  const students = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      department: 'Computer Science',
      year: '4th',
      cgpa: '8.5',
      placementStatus: 'Placed',
      company: 'Tech Corp',
      package: '10 LPA',
      skills: ['React', 'Node.js', 'Python'],
      applications: 5,
      interviews: 3,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      department: 'Information Technology',
      year: '4th',
      cgpa: '9.0',
      placementStatus: 'In Process',
      skills: ['Java', 'Spring Boot', 'MySQL'],
      applications: 3,
      interviews: 2,
    },
  ];

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
          <option value="cs">Computer Science</option>
          <option value="it">Information Technology</option>
          <option value="ec">Electronics</option>
        </Select>
        <Select
          placeholder="Year"
          name="year"
          value={filters.year}
          onChange={handleFilterChange}
        >
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
              <Th>Department</Th>
              <Th>Year</Th>
              <Th>CGPA</Th>
              <Th>Status</Th>
              <Th>Applications</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {students.map((student) => (
              <Tr key={student.id}>
                <Td>{student.name}</Td>
                <Td>{student.department}</Td>
                <Td>{student.year}</Td>
                <Td>{student.cgpa}</Td>
                <Td>
                  <Badge
                    colorScheme={
                      student.placementStatus === 'Placed'
                        ? 'green'
                        : student.placementStatus === 'In Process'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {student.placementStatus}
                  </Badge>
                </Td>
                <Td>{student.applications}</Td>
                <Td>
                  <Button
                    size="sm"
                    colorScheme="brand"
                    onClick={() => handleViewDetails(student)}
                  >
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedStudent && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Heading size="md">{selectedStudent.name}</Heading>
                  <Text color="gray.600">{selectedStudent.email}</Text>
                </Box>

                <Divider />

                <Box>
                  <Text fontWeight="bold">Academic Information</Text>
                  <HStack mt={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Department
                      </Text>
                      <Text>{selectedStudent.department}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Year
                      </Text>
                      <Text>{selectedStudent.year}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        CGPA
                      </Text>
                      <Text>{selectedStudent.cgpa}</Text>
                    </Box>
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold">Placement Status</Text>
                  <HStack mt={2} spacing={4}>
                    <Badge colorScheme="green">
                      {selectedStudent.placementStatus}
                    </Badge>
                    {selectedStudent.company && (
                      <Text>
                        {selectedStudent.company} - {selectedStudent.package}
                      </Text>
                    )}
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold">Skills</Text>
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {selectedStudent.skills.map((skill, index) => (
                      <Badge key={index} colorScheme="blue">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                </Box>

                <Box>
                  <Text fontWeight="bold">Placement Activity</Text>
                  <HStack mt={2} spacing={4}>
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Applications
                      </Text>
                      <Text>{selectedStudent.applications}</Text>
                    </Box>
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Interviews
                      </Text>
                      <Text>{selectedStudent.interviews}</Text>
                    </Box>
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