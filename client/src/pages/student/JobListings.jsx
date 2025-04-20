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
  Spinner,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getJobs } from '../../store/slices/jobSlice';

const JobListings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { jobs = [], isLoading } = useSelector((state) => state.jobs);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    location: '',
    experience: '',
  });

  useEffect(() => {
    dispatch(getJobs());
  }, [dispatch]);

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

  // Filter jobs based on search and filter criteria
  const filteredJobs = Array.isArray(jobs) ? jobs.filter((job) => {
    const matchesSearch = job.position.toLowerCase().includes(filters.search.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.search.toLowerCase());
    const matchesType = !filters.type || job.type === filters.type;
    const matchesLocation = !filters.location || job.location === filters.location;
    const matchesExperience = !filters.experience || job.experience === filters.experience;

    return matchesSearch && matchesType && matchesLocation && matchesExperience;
  }) : [];

  // Get unique values for filter options
  const jobTypes = Array.isArray(jobs) ? [...new Set(jobs.map(job => job.type))] : [];
  const locations = Array.isArray(jobs) ? [...new Set(jobs.map(job => job.location))] : [];
  const experienceLevels = Array.isArray(jobs) ? [...new Set(jobs.map(job => job.experience))] : [];

  if (isLoading) {
    return (
      <Box p={5} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

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
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Location"
          name="location"
          value={filters.location}
          onChange={handleFilterChange}
        >
          {locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
        <Select
          placeholder="Experience"
          name="experience"
          value={filters.experience}
          onChange={handleFilterChange}
        >
          {experienceLevels.map((exp) => (
            <option key={exp} value={exp}>
              {exp}
            </option>
          ))}
        </Select>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {filteredJobs.map((job) => (
          <Card key={job._id} variant="outline">
            <CardBody>
              <VStack align="stretch" spacing={3}>
                <Heading size="md">{job.position}</Heading>
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
                    {job.eligibilityCriteria?.requiredSkills?.map((skill, index) => (
                      <Badge key={index} colorScheme="gray">
                        {skill}
                      </Badge>
                    ))}
                  </HStack>
                </Box>
                <Text fontSize="sm" color="gray.500">
                  Posted on: {new Date(job.createdAt).toLocaleDateString()}
                </Text>
                <Button
                  colorScheme="brand"
                  onClick={() => handleViewDetails(job._id)}
                >
                  View Details
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      {filteredJobs.length === 0 && (
        <Box textAlign="center" py={10}>
          <Text color="gray.500">No jobs found matching your criteria</Text>
        </Box>
      )}
    </Box>
  );
};

export default JobListings;