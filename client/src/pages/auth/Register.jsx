import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  VStack,
  Heading,
  Text,
  Link,
  Input,
  InputGroup,
  IconButton,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
  InputRightElement,
  Select,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../../store/slices/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: 'student', // Default role
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Registration failed',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    if (isSuccess) {
      toast({
        title: 'Registration successful',
        description: 'You can now login with your credentials',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/login');
    }

    dispatch(reset());
  }, [isError, isSuccess, message, navigate, dispatch, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
      };
      dispatch(register(userData));
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
        w={['full', 'md']}
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
            <Heading>Create an Account</Heading>
            <Text>Sign up to get started</Text>
          </VStack>

          <FormControl isInvalid={errors.name}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email address"
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.phone}>
            <FormLabel htmlFor="phone">Phone Number</FormLabel>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Your phone number"
            />
            <FormErrorMessage>{errors.phone}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel htmlFor="role">Role</FormLabel>
            <Select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="student">Student</option>
              <option value="tpo">TPO</option>
            </Select>
          </FormControl>

          <FormControl isInvalid={errors.password}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              <InputRightElement>
                <IconButton
                  icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowPassword(!showPassword)}
                  size="sm"
                  variant="ghost"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={errors.passwordConfirm}>
            <FormLabel htmlFor="passwordConfirm">Confirm Password</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="passwordConfirm"
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirm your password"
              />
              <InputRightElement>
                <IconButton
                  icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  size="sm"
                  variant="ghost"
                  aria-label={
                    showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'
                  }
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.passwordConfirm}</FormErrorMessage>
          </FormControl>

          <Button
            w="full"
            colorScheme="brand"
            size="lg"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="Creating account..."
          >
            Sign Up
          </Button>

          <Text textAlign="center" w="full">
            Already have an account?{' '}
            <Link as={RouterLink} to="/login" color="brand.500">
              Sign In
            </Link>
          </Text>

          <Text textAlign="center" w="full">
            Want to register as a company?{' '}
            <Link as={RouterLink} to="/register/company" color="brand.500">
              Register Company
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default Register;