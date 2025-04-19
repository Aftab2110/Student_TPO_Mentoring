import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  useToast,
  Grid,
  GridItem,
  Select,
  VStack,
  HStack,
  Text,
  Spinner,
  Badge
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import api from '../../config/axios';

const CompanyProfile = () => {
  const { company } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/api/companies/profile');
        setProfile(response.data);
      } catch (error) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to fetch profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/api/companies/profile', profile);
      setProfile(response.data);
      setIsEditing(false);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={5} display="flex" justifyContent="center" alignItems="center" minH="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Company Profile</Heading>

      {!isEditing ? (
        <Box>
          <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={5}>
            <Box>
              <VStack align="start" spacing={4}>
                <Text><strong>Name:</strong> {profile?.name}</Text>
                <Text><strong>Email:</strong> {profile?.email}</Text>
                <Text><strong>Phone:</strong> {profile?.phone}</Text>
                <Text><strong>Website:</strong> {profile?.website}</Text>
                <Text><strong>Industry:</strong> {profile?.industry}</Text>
                <Text><strong>Size:</strong> {profile?.size}</Text>
                <Text><strong>Location:</strong> {profile?.location}</Text>
                <Text><strong>Founded Year:</strong> {profile?.foundedYear}</Text>
                <Text><strong>Status:</strong> <Badge colorScheme={profile?.status === 'active' ? 'green' : 'yellow'}>{profile?.status}</Badge></Text>
              </VStack>

              <Box mt={5}>
                <Heading size="md" mb={3}>Company Details</Heading>
                <Text><strong>About:</strong> {profile?.companyDetails?.about}</Text>
                <Text mt={2}><strong>Benefits:</strong> {profile?.companyDetails?.benefits?.join(', ')}</Text>
                <Text mt={2}><strong>Culture:</strong> {profile?.companyDetails?.culture?.join(', ')}</Text>
                <Text mt={2}><strong>Tech Stack:</strong> {profile?.companyDetails?.techStack?.join(', ')}</Text>
              </Box>
            </Box>

            <Box>
              <Heading size="md" mb={3}>Social Media</Heading>
              <VStack align="start" spacing={2}>
                <Text><strong>LinkedIn:</strong> {profile?.companyDetails?.socialMedia?.linkedin}</Text>
                <Text><strong>Twitter:</strong> {profile?.companyDetails?.socialMedia?.twitter}</Text>
                <Text><strong>Facebook:</strong> {profile?.companyDetails?.socialMedia?.facebook}</Text>
              </VStack>
            </Box>
          </Grid>

          <Button mt={5} colorScheme="blue" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={5}>
            <GridItem>
              <FormControl>
                <FormLabel>Company Name</FormLabel>
                <Input
                  value={profile?.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={profile?.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Phone</FormLabel>
                <Input
                  value={profile?.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Website</FormLabel>
                <Input
                  value={profile?.website}
                  onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Industry</FormLabel>
                <Input
                  value={profile?.industry}
                  onChange={(e) => setProfile({ ...profile, industry: e.target.value })}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Company Size</FormLabel>
                <Select
                  value={profile?.size}
                  onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                >
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-500">201-500</option>
                  <option value="501-1000">501-1000</option>
                  <option value="1000+">1000+</option>
                </Select>
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Location</FormLabel>
                <Input
                  value={profile?.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                />
              </FormControl>
            </GridItem>

            <GridItem>
              <FormControl>
                <FormLabel>Founded Year</FormLabel>
                <Input
                  type="number"
                  value={profile?.foundedYear}
                  onChange={(e) => setProfile({ ...profile, foundedYear: e.target.value })}
                />
              </FormControl>
            </GridItem>
          </Grid>

          <Box mt={5}>
            <Heading size="md" mb={3}>Company Details</Heading>
            <FormControl>
              <FormLabel>About</FormLabel>
              <Textarea
                value={profile?.companyDetails?.about}
                onChange={(e) => setProfile({
                  ...profile,
                  companyDetails: {
                    ...profile.companyDetails,
                    about: e.target.value
                  }
                })}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Benefits (comma separated)</FormLabel>
              <Input
                value={profile?.companyDetails?.benefits?.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  companyDetails: {
                    ...profile.companyDetails,
                    benefits: e.target.value.split(',').map(b => b.trim())
                  }
                })}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Culture (comma separated)</FormLabel>
              <Input
                value={profile?.companyDetails?.culture?.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  companyDetails: {
                    ...profile.companyDetails,
                    culture: e.target.value.split(',').map(c => c.trim())
                  }
                })}
              />
            </FormControl>

            <FormControl mt={3}>
              <FormLabel>Tech Stack (comma separated)</FormLabel>
              <Input
                value={profile?.companyDetails?.techStack?.join(', ')}
                onChange={(e) => setProfile({
                  ...profile,
                  companyDetails: {
                    ...profile.companyDetails,
                    techStack: e.target.value.split(',').map(t => t.trim())
                  }
                })}
              />
            </FormControl>
          </Box>

          <Box mt={5}>
            <Heading size="md" mb={3}>Social Media</Heading>
            <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={5}>
              <FormControl>
                <FormLabel>LinkedIn</FormLabel>
                <Input
                  value={profile?.companyDetails?.socialMedia?.linkedin}
                  onChange={(e) => setProfile({
                    ...profile,
                    companyDetails: {
                      ...profile.companyDetails,
                      socialMedia: {
                        ...profile.companyDetails.socialMedia,
                        linkedin: e.target.value
                      }
                    }
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Twitter</FormLabel>
                <Input
                  value={profile?.companyDetails?.socialMedia?.twitter}
                  onChange={(e) => setProfile({
                    ...profile,
                    companyDetails: {
                      ...profile.companyDetails,
                      socialMedia: {
                        ...profile.companyDetails.socialMedia,
                        twitter: e.target.value
                      }
                    }
                  })}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Facebook</FormLabel>
                <Input
                  value={profile?.companyDetails?.socialMedia?.facebook}
                  onChange={(e) => setProfile({
                    ...profile,
                    companyDetails: {
                      ...profile.companyDetails,
                      socialMedia: {
                        ...profile.companyDetails.socialMedia,
                        facebook: e.target.value
                      }
                    }
                  })}
                />
              </FormControl>
            </Grid>
          </Box>

          <HStack mt={5} spacing={4}>
            <Button type="submit" colorScheme="blue">
              Save Changes
            </Button>
            <Button onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </HStack>
        </form>
      )}
    </Box>
  );
};

export default CompanyProfile; 