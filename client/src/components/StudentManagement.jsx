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
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Stack,
  Flex,
  Text,
  HStack,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider
} from '@chakra-ui/react';
import axios from 'axios';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [mentorshipNotes, setMentorshipNotes] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    eligibility: '',
    cgpa: ''
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [mentorshipHistory, setMentorshipHistory] = useState([]);
  const [eligibilityForm, setEligibilityForm] = useState({
    cgpa: '',
    technicalSkills: '',
    communicationSkills: '',
    projectWork: '',
    internshipExperience: ''
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/tpo/students', {
        params: filters
      });
      setStudents(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching students',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const fetchMentorshipHistory = async (studentId) => {
    try {
      const response = await axios.get(`/api/tpo/mentorship/${studentId}/history`);
      setMentorshipHistory(response.data);
    } catch (error) {
      toast({
        title: 'Error fetching mentorship history',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMentorshipSession = async (student) => {
    setSelectedStudent(student);
    setMentorshipNotes('');
    await fetchMentorshipHistory(student._id);
    onOpen();
  };

  const saveMentorshipSession = async () => {
    try {
      await axios.post(`/api/tpo/mentorship/${selectedStudent._id}`, {
        notes: mentorshipNotes,
      });
      toast({
        title: 'Mentorship session saved',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchStudents();
    } catch (error) {
      toast({
        title: 'Error saving mentorship session',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const updateEligibility = async (studentId, status) => {
    try {
      await axios.put(`/api/tpo/update-eligibility`, {
        updates: [{ studentId, eligibility: status }]
      });
      toast({
        title: 'Eligibility updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchStudents();
    } catch (error) {
      toast({
        title: 'Error updating eligibility',
        description: error.response?.data?.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <Heading mb={6}>Student Management</Heading>
      
      <HStack spacing={4} mb={6}>
        <Input
          placeholder="Search students..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />
        <Select
          placeholder="Branch"
          name="branch"
          value={filters.branch}
          onChange={handleFilterChange}
        >
          <option value="CSE">Computer Science</option>
          <option value="IT">Information Technology</option>
          <option value="ECE">Electronics</option>
          <option value="ME">Mechanical</option>
        </Select>
        <Select
          placeholder="Eligibility"
          name="eligibility"
          value={filters.eligibility}
          onChange={handleFilterChange}
        >
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </Select>
        <Select
          placeholder="CGPA"
          name="cgpa"
          value={filters.cgpa}
          onChange={handleFilterChange}
        >
          <option value="9+">9.0 & Above</option>
          <option value="8+">8.0 & Above</option>
          <option value="7+">7.0 & Above</option>
        </Select>
      </HStack>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Branch</Th>
            <Th>CGPA</Th>
            <Th>Eligibility</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {students.map((student) => (
            <Tr key={student._id}>
              <Td>{student.name}</Td>
              <Td>{student.studentDetails?.branch}</Td>
              <Td>{student.studentDetails?.cgpa}</Td>
              <Td>
                <Badge
                  colorScheme={
                    student.studentDetails?.eligibility === 'approved'
                      ? 'green'
                      : student.studentDetails?.eligibility === 'pending'
                      ? 'yellow'
                      : 'red'
                  }
                >
                  {student.studentDetails?.eligibility}
                </Badge>
              </Td>
              <Td>
                <Stack direction="row" spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    onClick={() => handleMentorshipSession(student)}
                  >
                    Mentor
                  </Button>
                  <Select
                    size="sm"
                    w="150px"
                    value={student.studentDetails?.eligibility}
                    onChange={(e) => updateEligibility(student._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </Stack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Student Mentorship & Eligibility</ModalHeader>
          <ModalBody>
            {selectedStudent && (
              <Tabs>
                <TabList>
                  <Tab>Mentorship Session</Tab>
                  <Tab>Session History</Tab>
                  <Tab>Eligibility Assessment</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <Text>
                        <strong>Student:</strong> {selectedStudent.name}
                      </Text>
                      <FormControl>
                        <FormLabel>Session Notes</FormLabel>
                        <Textarea
                          value={mentorshipNotes}
                          onChange={(e) => setMentorshipNotes(e.target.value)}
                          placeholder="Enter mentorship session notes..."
                          rows={6}
                        />
                      </FormControl>
                      <Button colorScheme="blue" onClick={saveMentorshipSession}>
                        Save Session
                      </Button>
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      {mentorshipHistory.map((session, index) => (
                        <Box key={index} p={4} borderWidth="1px" borderRadius="md">
                          <Text fontWeight="bold">
                            {new Date(session.date).toLocaleDateString()}
                          </Text>
                          <Text mt={2}>{session.notes}</Text>
                        </Box>
                      ))}
                    </VStack>
                  </TabPanel>

                  <TabPanel>
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel>CGPA</FormLabel>
                        <Input
                          type="number"
                          value={eligibilityForm.cgpa}
                          onChange={(e) => setEligibilityForm(prev => ({ ...prev, cgpa: e.target.value }))}
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Technical Skills Assessment</FormLabel>
                        <Select
                          value={eligibilityForm.technicalSkills}
                          onChange={(e) => setEligibilityForm(prev => ({ ...prev, technicalSkills: e.target.value }))}
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="average">Average</option>
                          <option value="needs_improvement">Needs Improvement</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Communication Skills</FormLabel>
                        <Select
                          value={eligibilityForm.communicationSkills}
                          onChange={(e) => setEligibilityForm(prev => ({ ...prev, communicationSkills: e.target.value }))}
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="average">Average</option>
                          <option value="needs_improvement">Needs Improvement</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Project Work</FormLabel>
                        <Textarea
                          value={eligibilityForm.projectWork}
                          onChange={(e) => setEligibilityForm(prev => ({ ...prev, projectWork: e.target.value }))}
                          placeholder="Evaluate student's project work..."
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Internship Experience</FormLabel>
                        <Textarea
                          value={eligibilityForm.internshipExperience}
                          onChange={(e) => setEligibilityForm(prev => ({ ...prev, internshipExperience: e.target.value }))}
                          placeholder="Evaluate student's internship experience..."
                        />
                      </FormControl>
                      <Button colorScheme="blue" onClick={() => updateEligibility(selectedStudent._id, 'approved')}>
                        Update Eligibility
                      </Button>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentManagement;