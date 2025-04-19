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
  InputRightElement,
  IconButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Card,
  CardBody,
  Select,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../../store/slices/authSlice';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student', // Default role
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toast = useToast();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const validateForm = () => {
    const newErrors = {};
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

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Login failed',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }

    if (isSuccess) {
      // Redirect based on role
      const redirectPath = formData.role === 'company' ? '/company/dashboard' : 
                         formData.role === 'tpo' ? '/tpo' : '/dashboard';
      console.log('Redirecting to:', redirectPath);
      navigate(redirectPath);
    }

    // Only reset the state if there was an error or success
    if (isError || isSuccess) {
      dispatch(reset());
    }
  }, [isError, isSuccess, message, navigate, dispatch, toast, formData.role]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log('=== Login Debug ===');
      console.log('1. Login attempt with:', { 
        email: formData.email, 
        role: formData.role,
        passwordLength: formData.password.length 
      });
      
      const result = await dispatch(login(formData)).unwrap();
      console.log('2. Login response:', result);
      console.log('3. LocalStorage after login:', {
        user: localStorage.getItem('user'),
        token: localStorage.getItem('token')
      });
      
      // Clear any existing errors
      setErrors({});
      
      // Navigate based on role
      const redirectPath = formData.role === 'company' ? '/company/dashboard' : 
                         formData.role === 'tpo' ? '/tpo' : '/dashboard';
      console.log('4. Redirecting to:', redirectPath);
      navigate(redirectPath);
    } catch (error) {
      console.error('=== Login Error Debug ===');
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      
      // Set specific error messages based on the error
      const errorMessage = error?.message || error || 'Invalid email or password';
      setErrors({
        submit: errorMessage
      });
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      w="full"
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={8}
    >
      <Card
        w={['full', 'md']}
        mx={4}
        borderRadius="lg"
        boxShadow="lg"
      >
        <CardBody p={[4, 8]}>
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Heading size="xl" color="brand.500">Welcome Back</Heading>
              <Text color="gray.600">Sign in to your account</Text>
            </VStack>

            <FormControl>
              <FormLabel>Role</FormLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                size="lg"
              >
                <option value="student">Student</option>
                <option value="tpo">TPO</option>
                <option value="company">Company</option>
              </Select>
            </FormControl>

            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                size="lg"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <Button
              w="full"
              colorScheme="brand"
              size="lg"
              isLoading={isLoading}
              onClick={handleSubmit}
              loadingText="Signing in..."
            >
              Sign In
            </Button>

            <Text textAlign="center" color="gray.600">
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="brand.500" fontWeight="medium">
                Sign Up
              </Link>
            </Text>

            {formData.role === 'company' && (
              <Text textAlign="center" color="gray.600">
                Register as a company?{' '}
                <Link as={RouterLink} to="/register/company" color="brand.500" fontWeight="medium">
                  Register Company
                </Link>
              </Text>
            )}

            <Text textAlign="center">
              Are you a company?{' '}
              <Link as={RouterLink} to="/login/company" color="blue.500">
                Login as Company
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default Login;