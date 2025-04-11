import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Input,
  Select,
  Stack,
  Card,
  CardBody,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

const JobListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    experience: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  // Mock data - replace with actual API call
  const jobs = [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      type: 'Full-time',
      experience: '0-2 years',
      skills: ['React', 'Node.js', 'MongoDB'],
      postedDate: '2024-01-15',
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'Web Solutions',
      location: 'Hybrid',
      type: 'Full-time',
      experience: '1-3 years',
      skills: ['JavaScript', 'React', 'CSS'],
      postedDate: '2024-01-14',
    },
  ];

  return (
    <Box p={5}>
      <Heading mb={5}>Job Listings</Heading>

      <Stack direction={{ base: 'column', md: 'row' }} spacing={4} mb={5}>
        <Input
          placeholder="Search jobs..."
          name="search"
          value={filters.search}
          onChange={handleFilterChange}
        />
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
        <Select
          placeholder="Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="remote">Remote</option>
          <option value="onsite">On-site</option>
          <option value="hybrid">Hybrid</option>
        </Select>
        <Select
          placeholder="Experience"
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
        >
          <option value="0-2">0-2 years</option>
          <option value="2-5">2-5 years</option>
          <option value="5+">5+ years</option>
        </Select>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {jobs.map((job) => (
          <Card key={job.id} variant="outline">
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Heading size="md">{job.title}</Heading>
                <Text color="gray.600">{job.company}</Text>
                <HStack>
                  <Badge colorScheme="green">{job.type}</Badge>
                  <Badge colorScheme="blue">{job.location}</Badge>
                  <Badge colorScheme="purple">{job.experience}</Badge>
                </HStack>
                <Box>
                  <Text fontSize="sm" fontWeight="bold" mb={1}>
                    Required Skills:
                  </Text>
                  <HStack spacing={2}>
                    {job.skills.map((skill, index) => (
                      <Badge key={index} colorScheme="gray">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
                <Text fontSize="sm" color="gray.500">
                  Posted on: {new Date(job.postedDate).toLocaleDateString()}
                </Text>
                <Button
                  colorScheme="brand"
                  onClick={() => handleViewDetails(job.id)}
                >
                  View Details
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {jobs.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">No jobs found matching your criteria</Text>
        </Box>
      )}
    </Box>
  );
};

export default JobListings;