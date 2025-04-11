import React from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Heading,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  Badge,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const TPODashboard = () => {
  const { user } = useSelector((state) => state.auth);

  // Mock data - replace with actual API data
  const stats = {
    totalStudents: 150,
    activeJobs: 25,
    placedStudents: 45,
    averagePackage: '8.5 LPA',
  };

  const recentPlacements = [
    {
      studentName: 'John Doe',
      company: 'Tech Corp',
      package: '12 LPA',
      date: '2024-01-15',
    },
    {
      studentName: 'Jane Smith',
      company: 'Web Solutions',
      package: '10 LPA',
      date: '2024-01-14',
    },
  ];

  const upcomingDrives = [
    {
      company: 'Innovation Tech',
      date: '2024-02-01',
      positions: ['Software Engineer', 'Product Manager'],
      status: 'Scheduled',
    },
    {
      company: 'Digital Systems',
      date: '2024-02-05',
      positions: ['Frontend Developer', 'Backend Developer'],
      status: 'Pending',
    },
  ];

  return (
    <Box p={5}>
      <Heading mb={5}>Welcome, {user?.name}</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Total Students</StatLabel>
            <StatNumber>{stats.totalStudents}</StatNumber>
            <StatHelpText>Registered students</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Active Jobs</StatLabel>
            <StatNumber>{stats.activeJobs}</StatNumber>
            <StatHelpText>Open positions</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Placed Students</StatLabel>
            <StatNumber>{stats.placedStudents}</StatNumber>
            <StatHelpText>This academic year</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Average Package</StatLabel>
            <StatNumber>{stats.averagePackage}</StatNumber>
            <StatHelpText>Current batch</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Recent Placements
            </Heading>
            <VStack spacing={4} align="stretch">
              {recentPlacements.map((placement, index) => (
                <Box
                  key={index}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50' }}
                >
                  <Text fontWeight="bold">{placement.studentName}</Text>
                  <HStack mt={2} spacing={2}>
                    <Text color="gray.600">{placement.company}</Text>
                    <Badge colorScheme="green">{placement.package}</Badge>
                  </HStack>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    {new Date(placement.date).toLocaleDateString()}
                  </Text>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>
              Upcoming Placement Drives
            </Heading>
            <VStack spacing={4} align="stretch">
              {upcomingDrives.map((drive, index) => (
                <Box
                  key={index}
                  p={3}
                  borderWidth="1px"
                  borderRadius="md"
                  _hover={{ bg: 'gray.50' }}
                >
                  <Text fontWeight="bold">{drive.company}</Text>
                  <Text fontSize="sm" color="gray.600" mt={1}>
                    {new Date(drive.date).toLocaleDateString()}
                  </Text>
                  <HStack mt={2} spacing={2} flexWrap="wrap">
                    {drive.positions.map((position, idx) => (
                      <Badge key={idx} colorScheme="blue">
                        {position}
                      </Badge>
                    ))}
                  </HStack>
                  <Badge
                    mt={2}
                    colorScheme={drive.status === 'Scheduled' ? 'green' : 'yellow'}
                  >
                    {drive.status}
                  </Badge>
                </Box>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default TPODashboard;