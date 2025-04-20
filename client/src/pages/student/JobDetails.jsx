import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Button,
  useToast,
  Divider,
  List,
  ListItem,
  ListIcon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircleIcon } from '@chakra-ui/icons';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [job, setJob] = useState({
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'Remote',
    type: 'Full-time',
    experience: '0-2 years',
    salary: '$60,000 - $80,000',
    description: 'We are looking for a talented Software Engineer to join our team...',
    requirements: [
      'Bachelor\'s degree in Computer Science or related field',
      'Strong proficiency in React and Node.js',
      'Experience with MongoDB and RESTful APIs',
      'Excellent problem-solving skills',
    ],
    responsibilities: [
      'Develop and maintain web applications',
      'Collaborate with cross-functional teams',
      'Write clean, maintainable code',
      'Participate in code reviews',
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Git'],
    postedDate: '2024-01-15',
    deadline: '2024-02-15',
  });

  const [application, setApplication] = useState({
    coverLetter: '',
  });

  const handleApply = async () => {
    try {
      // TODO: Implement job application logic
      toast({
        title: 'Application submitted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      navigate('/jobs');
    } catch (error) {
      toast({
        title: 'Error submitting application',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Button
        colorScheme="gray"
        variant="outline"
        size="sm"
        mb={5}
        onClick={() => navigate('/jobs')}
      >
        Back to Jobs
      </Button>

      <VStack align="stretch" spacing={6}>
        <Box>
          <Heading size="lg">{job.title}</Heading>
          <Text fontSize="xl" color="gray.600" mt={2}>
            {job.company}
          </Text>
          <HStack spacing={2} mt={3}>
            <Badge colorScheme="green">{job.type}</Badge>
            <Badge colorScheme="blue">{job.location}</Badge>
            <Badge colorScheme="purple">{job.experience}</Badge>
          </HStack>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Job Description
          </Heading>
          <Text>{job.description}</Text>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Requirements
          </Heading>
          <List spacing={2}>
            {job.requirements.map((req, index) => (
              <ListItem key={index}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {req}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Responsibilities
          </Heading>
          <List spacing={2}>
            {job.responsibilities.map((resp, index) => (
              <ListItem key={index}>
                <ListIcon as={CheckCircleIcon} color="green.500" />
                {resp}
              </ListItem>
            ))}
          </List>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Required Skills
          </Heading>
          <HStack spacing={2} wrap="wrap">
            {job.skills.map((skill, index) => (
              <Badge key={index} colorScheme="gray">
                {skill}
              </Badge>
            ))}
          </HStack>
        </Box>

        <Divider />

        <Box>
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Salary Range</Text>
              <Text>{job.salary}</Text>
            </VStack>
            <VStack align="start" spacing={1}>
              <Text fontWeight="bold">Application Deadline</Text>
              <Text>{new Date(job.deadline).toLocaleDateString()}</Text>
            </VStack>
          </HStack>
        </Box>

        <Button colorScheme="brand" size="lg" onClick={onOpen}>
          Apply Now
        </Button>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Apply for {job.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box w="full">
                <Text mb={2} fontWeight="bold">
                  Cover Letter
                </Text>
                <Textarea
                  value={application.coverLetter}
                  onChange={(e) =>
                    setApplication({ ...application, coverLetter: e.target.value })
                  }
                  placeholder="Write your cover letter here..."
                  size="lg"
                  rows={10}
                />
              </Box>
              <Button
                colorScheme="brand"
                w="full"
                onClick={handleApply}
                isDisabled={!application.coverLetter.trim()}
              >
                Submit Application
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default JobDetails;