import React, { useState } from 'react';
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
  Textarea,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Divider,
  Card,
  CardBody,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import api from '../../config/axios';

const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    phone: '',
    website: '',
    description: '',
    industry: '',
    size: '1-10',
    location: '',
    foundedYear: new Date().getFullYear(),
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

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
    if (!formData.name) newErrors.name = 'Company name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    if (!formData.description) {
      newErrors.description = 'Company description is required';
    }
    if (!formData.industry) {
      newErrors.industry = 'Industry is required';
    }
    if (!formData.location) {
      newErrors.location = 'Location is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsLoading(true);
        
        // Format website URL if provided
        const formattedData = {
          ...formData,
          website: formData.website ? (formData.website.startsWith('http') ? formData.website : `https://${formData.website}`) : '',
        };
        
        // Remove passwordConfirm as it's not needed by the backend
        delete formattedData.passwordConfirm;
        
        console.log('Submitting company registration:', formattedData);
        const response = await api.post('/api/companies/register', formattedData);
        console.log('Registration response:', response.data);
        
        toast({
          title: 'Registration successful',
          description: 'You can now login with your credentials',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        
        navigate('/login/company');
      } catch (error) {
        console.error('Registration error:', error);
        const errorMessage = error.response?.data?.message || 'Something went wrong';
        const missingFields = error.response?.data?.fields || [];
        
        // Set field-specific errors if provided
        if (missingFields.length > 0) {
          const fieldErrors = {};
          missingFields.forEach(field => {
            fieldErrors[field] = `${field} is required`;
          });
          setErrors(fieldErrors);
        }
        
        toast({
          title: 'Registration failed',
          description: errorMessage,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
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
        w={['full', '2xl']}
        mx={4}
        borderRadius="lg"
        boxShadow="lg"
      >
        <CardBody p={[4, 8]}>
          <VStack spacing={6} align="stretch">
            <VStack spacing={2} textAlign="center">
              <Heading size="xl" color="brand.500">Register Your Company</Heading>
              <Text color="gray.600">Create a company account to post jobs and manage applications</Text>
            </VStack>

            <Divider />

            <SimpleGrid columns={[1, 2]} spacing={6}>
              <FormControl isInvalid={errors.name}>
                <FormLabel htmlFor="name">Company Name</FormLabel>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your company name"
                  size="lg"
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
                  placeholder="Company email address"
                  size="lg"
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
                  placeholder="Company phone number"
                  size="lg"
                />
                <FormErrorMessage>{errors.phone}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="website">Website</FormLabel>
                <Input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Company website"
                  size="lg"
                />
              </FormControl>
            </SimpleGrid>

            <FormControl isInvalid={errors.description}>
              <FormLabel htmlFor="description">Company Description</FormLabel>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of your company"
                size="lg"
                rows={4}
              />
              <FormErrorMessage>{errors.description}</FormErrorMessage>
            </FormControl>

            <SimpleGrid columns={[1, 2]} spacing={6}>
              <FormControl isInvalid={errors.industry}>
                <FormLabel htmlFor="industry">Industry</FormLabel>
                <Input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  placeholder="Company industry"
                  size="lg"
                />
                <FormErrorMessage>{errors.industry}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="size">Company Size</FormLabel>
                <Select
                  id="size"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  size="lg"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </Select>
              </FormControl>

              <FormControl isInvalid={errors.location}>
                <FormLabel htmlFor="location">Location</FormLabel>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Company location"
                  size="lg"
                />
                <FormErrorMessage>{errors.location}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="foundedYear">Founded Year</FormLabel>
                <NumberInput
                  id="foundedYear"
                  name="foundedYear"
                  value={formData.foundedYear}
                  onChange={(value) => handleChange({ target: { name: 'foundedYear', value } })}
                  min={1900}
                  max={new Date().getFullYear()}
                  size="lg"
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>
            </SimpleGrid>

            <Divider />

            <SimpleGrid columns={[1, 2]} spacing={6}>
              <FormControl isInvalid={errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup size="lg">
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
                <InputGroup size="lg">
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
            </SimpleGrid>

            <Button
              w="full"
              colorScheme="brand"
              size="lg"
              onClick={handleSubmit}
              isLoading={isLoading}
              loadingText="Creating account..."
              mt={4}
            >
              Register Company
            </Button>

            <Text textAlign="center" color="gray.600">
              Already have an account?{' '}
              <Link as={RouterLink} to="/login" color="brand.500" fontWeight="medium">
                Sign In
              </Link>
            </Text>
          </VStack>
        </CardBody>
      </Card>
    </Box>
  );
};

export default CompanyRegister; 