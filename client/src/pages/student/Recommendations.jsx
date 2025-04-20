import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Divider,
  useToast,
} from '@chakra-ui/react';
import axios from '../../config/axios';

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [careerGuidance, setCareerGuidance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const [recResponse, guidanceResponse] = await Promise.all([
          axios.get('/api/students/recommendations'),
          axios.get('/api/students/career-guidance')
        ]);
        setRecommendations(recResponse.data);
        setCareerGuidance(guidanceResponse.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch recommendations');
        toast({
          title: 'Error',
          description: 'Failed to fetch recommendations',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [toast]);

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={6}>
      <VStack spacing={8} align="stretch">
        {/* Skill Recommendations */}
        <Box>
          <Heading size="lg" mb={4}>Skill Recommendations</Heading>
          <VStack spacing={4} align="stretch">
            {recommendations?.map((rec, index) => (
              <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                <HStack justify="space-between">
                  <Text fontWeight="bold">{rec.skill}</Text>
                  <Badge colorScheme="blue">Required in {rec.frequency} jobs</Badge>
                </HStack>
                <Text mt={2} color="gray.600">{rec.reason}</Text>
              </Box>
            ))}
          </VStack>
        </Box>

        <Divider />

        {/* Career Guidance */}
        <Box>
          <Heading size="lg" mb={4}>Career Guidance</Heading>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text mb={2}>{careerGuidance?.message}</Text>
            <Text color="gray.600">
              There are currently {careerGuidance?.relevantJobsCount} relevant job postings for your branch.
            </Text>
            {careerGuidance?.topCompanies?.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>Top Companies Hiring:</Text>
                <HStack spacing={2} flexWrap="wrap">
                  {careerGuidance.topCompanies.map((company, index) => (
                    <Badge key={index} colorScheme="green">{company}</Badge>
                  ))}
                </HStack>
              </Box>
            )}
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default Recommendations; 