import React from 'react';
import { Box, Grid, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react';
import { useSelector } from 'react-redux';

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box p={5}>
      <Heading mb={5}>Welcome, {user?.name}</Heading>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5} mb={5}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Applications</StatLabel>
            <StatNumber>0</StatNumber>
            <StatHelpText>Total job applications</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Interviews</StatLabel>
            <StatNumber>0</StatNumber>
            <StatHelpText>Scheduled interviews</StatHelpText>
          </Stat>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Stat>
            <StatLabel>Profile Completion</StatLabel>
            <StatNumber>0%</StatNumber>
            <StatHelpText>Complete your profile</StatHelpText>
          </Stat>
        </Box>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={5}>
        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Recent Job Listings</Heading>
          <Text color="gray.500">No recent job listings</Text>
        </Box>

        <Box p={5} shadow="md" borderWidth="1px" borderRadius="lg">
          <Heading size="md" mb={4}>Upcoming Events</Heading>
          <Text color="gray.500">No upcoming events</Text>
        </Box>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;