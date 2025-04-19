import React, { useState } from 'react';
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
  Switch,
  Text,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: true,
    emailNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        throw new Error('New passwords do not match');
      }

      const response = await axios.put(
        '/api/students/settings',
        {
          email: formData.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          notifications: formData.notifications,
          emailNotifications: formData.emailNotifications,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast({
        title: 'Settings updated',
        description: 'Your settings have been successfully updated',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={5}>
      <Heading mb={5}>Account Settings</Heading>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isDisabled
            />
            <Text fontSize="sm" color="gray.500" mt={1}>
              Email cannot be changed
            </Text>
          </FormControl>

          <Divider my={4} />

          <Heading size="md">Change Password</Heading>

          <FormControl>
            <FormLabel>Current Password</FormLabel>
            <Input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Confirm New Password</FormLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </FormControl>

          <Divider my={4} />

          <Heading size="md">Notification Settings</Heading>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Enable Notifications</FormLabel>
            <Switch
              name="notifications"
              isChecked={formData.notifications}
              onChange={handleChange}
            />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">Email Notifications</FormLabel>
            <Switch
              name="emailNotifications"
              isChecked={formData.emailNotifications}
              onChange={handleChange}
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isLoading}
            loadingText="Saving..."
            mt={4}
          >
            Save Changes
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default Settings; 