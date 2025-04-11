import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  FormErrorMessage,
  Select,
  HStack,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    department: '',
    year: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.role) {
      newErrors.role = 'Please select a role';
    }
    if (formData.role === 'student') {
      if (!formData.department) {
        newErrors.department = 'Department is required for students';
      }
      if (!formData.year) {
        newErrors.year = 'Year is required for students';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement registration logic with Redux
      // const response = await dispatch(registerUser(formData));
      toast({
        title: 'Registration successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error.message || 'Something went wrong',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      w="full"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box
        w={['full', 'lg']}
        p={[8, 10]}
        mt={[20, '10vh']}
        mx="auto"
        border={['none', '1px']}
        borderColor={['', 'gray.300']}
        borderRadius={10}
        bg="white"
      >
        <VStack spacing={4} align="flex-start" w="full">
          <VStack spacing={1} align="center" w="full">
            <Heading>Create Account</Heading>
            <Text>Sign up to get started</Text>
          </VStack>

          <FormControl isInvalid={errors.name}>
            <FormLabel>Full Name</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <HStack w="full" spacing={4}>
            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                />
                <InputRightElement>
                  <IconButton
                    size="sm"
                    variant="ghost"
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
              />
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>
          </HStack>

          <FormControl isInvalid={errors.role}>
            <FormLabel>Role</FormLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="Select your role"
            >
              <option value="student">Student</option>
              <option value="tpo">Training & Placement Officer</option>
            </Select>
            <FormErrorMessage>{errors.role}</FormErrorMessage>
          </FormControl>

          {formData.role === 'student' && (
            <HStack w="full" spacing={4}>
              <FormControl isInvalid={errors.department}>
                <FormLabel>Department</FormLabel>
                <Select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="Select department"
                >
                  <option value="cs">Computer Science</option>
                  <option value="it">Information Technology</option>
                  <option value="ec">Electronics</option>
                  <option value="me">Mechanical</option>
                </Select>
                <FormErrorMessage>{errors.department}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={errors.year}>
                <FormLabel>Year</FormLabel>
                <Select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Select year"
                >
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </Select>
                <FormErrorMessage>{errors.year}</FormErrorMessage>
              </FormControl>
            </HStack>
          )}

          <Button
            w="full"
            colorScheme="brand"
            size="lg"
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>

          <Text w="full" align="center">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="brand.500">
              Sign In
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;