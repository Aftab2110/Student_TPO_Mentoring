import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Text,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    placedStudents: 0,
    placementRate: 0,
    averagePackage: 0,
    topCompanies: [],
    branchWiseStats: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get('/api/tpo/analytics', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setAnalytics(response.data);
      setIsLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch analytics');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to fetch analytics',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
      <Heading mb={5}>Placement Analytics</Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={5} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Total Students</StatLabel>
              <StatNumber>{analytics.totalStudents}</StatNumber>
              <StatHelpText>Registered students</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Placed Students</StatLabel>
              <StatNumber>{analytics.placedStudents}</StatNumber>
              <StatHelpText>Successfully placed</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Placement Rate</StatLabel>
              <StatNumber>{analytics.placementRate}%</StatNumber>
              <StatHelpText>Overall placement rate</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Average Package</StatLabel>
              <StatNumber>₹{analytics.averagePackage} LPA</StatNumber>
              <StatHelpText>Mean annual package</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={5}>
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Top Recruiting Companies</Heading>
            {analytics.topCompanies.map((company, index) => (
              <Text key={index} mb={2}>
                {index + 1}. {company.name} - {company.offers} offers
              </Text>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Branch-wise Statistics</Heading>
            {analytics.branchWiseStats.map((branch, index) => (
              <Text key={index} mb={2}>
                {branch.name}: {branch.placed}/{branch.total} placed
              </Text>
            ))}
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
};

export default Analytics; 