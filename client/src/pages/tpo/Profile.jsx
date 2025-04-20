import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Text,
  Select,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import api from '../../config/axios';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (user?.token) {
      fetchProfile();
    }
  }, [user?.token]);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/api/tpo/profile');
      if (response.data) {
        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          department: response.data.department || '',
          designation: response.data.designation || '',
        });
      }
      setError(null);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        setError({
          title: 'Connection Error',
          message: 'Unable to connect to the server. Please make sure the backend server is running.',
        });
      } else {
        setError({
          title: 'Error',
          message: error.response?.data?.message || 'Failed to fetch profile',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await api.put('/api/tpo/profile', profile);
      if (response.data) {
        setProfile({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          department: response.data.department || '',
          designation: response.data.designation || '',
        });
      }
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setIsEditing(false);
    } catch (error) {
      if (error.code === 'ERR_NETWORK') {
        toast({
          title: 'Connection Error',
          description: 'Unable to connect to the server. Please make sure the backend server is running.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to update profile',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } finally {
      setIsLoading(false);
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
      <Alert status="error" mb={4} flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          {error.title}
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Profile</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch" maxW="600px">
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              isDisabled={!isEditing}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={profile.email}
              onChange={handleInputChange}
              isDisabled={!isEditing}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Phone</FormLabel>
            <Input
              name="phone"
              type="tel"
              value={profile.phone}
              onChange={handleInputChange}
              isDisabled={!isEditing}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Department</FormLabel>
            <Input
              name="department"
              value={profile.department}
              onChange={handleInputChange}
              isDisabled={!isEditing}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Designation</FormLabel>
            <Input
              name="designation"
              value={profile.designation}
              onChange={handleInputChange}
              isDisabled={!isEditing}
            />
          </FormControl>

          {!isEditing ? (
            <Button colorScheme="blue" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          ) : (
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              Save Changes
            </Button>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default Profile; 