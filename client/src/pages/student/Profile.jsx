import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  useToast,
  Textarea,
  SimpleGrid,
  Select,
  Skeleton,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { getStudentProfile, updateProfile } from '../../store/slices/studentSlice';

const StudentProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { currentStudent, isLoading, isError, message } = useSelector((state) => state.students);

  const [formData, setFormData] = useState({
    name: '',
    email: user?.email || '',
    phone: '',
    college: '',
    degree: '',
    graduationYear: '',
    cgpa: '',
    skills: '',
    about: '',
  });

  useEffect(() => {
    if (user?.token) {
      dispatch(getStudentProfile());
    }
  }, [dispatch, user?.token]);

  useEffect(() => {
    if (isError) {
      toast({
        title: 'Error',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [isError, message, toast]);

  useEffect(() => {
    if (currentStudent) {
      console.log('Current student data:', currentStudent);
      const updatedFormData = {
        name: currentStudent.name || '',
        email: currentStudent.email || user?.email || '',
        phone: currentStudent.phone || '',
        college: currentStudent.studentDetails?.college || '',
        degree: currentStudent.studentDetails?.degree || '',
        graduationYear: currentStudent.studentDetails?.graduationYear || '',
        cgpa: currentStudent.studentDetails?.cgpa || '',
        skills: currentStudent.studentDetails?.skills?.map(skill => skill.name).join(', ') || '',
        about: currentStudent.studentDetails?.about || '',
      };
      console.log('Setting form data:', updatedFormData);
      setFormData(updatedFormData);
    }
  }, [currentStudent, user?.email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const profileData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        studentDetails: {
          college: formData.college,
          degree: formData.degree,
          graduationYear: formData.graduationYear,
          cgpa: formData.cgpa,
          skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
          about: formData.about,
        }
      };
      console.log('Sending profile data to server:', profileData);
      
      const result = await dispatch(updateProfile(profileData)).unwrap();
      console.log('Update result:', result);
      
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return (
      <Box p={5}>
        <Skeleton height="40px" mb={5} />
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} height="60px" />
          ))}
        </SimpleGrid>
      </Box>
    );
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Student Profile</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={formData.email}
                placeholder="Enter your email"
                type="email"
                isReadOnly
                bg="gray.100"
                _hover={{ bg: 'gray.100' }}
                _focus={{ bg: 'gray.100' }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                type="tel"
                required
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>College</FormLabel>
              <Input
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
                required
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Degree</FormLabel>
              <Input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Enter your degree"
                required
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Graduation Year</FormLabel>
              <Select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() + i).map(
                  (year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  )
                )}
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>CGPA</FormLabel>
              <Input
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="Enter your CGPA"
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
              />
            </FormControl>
          </SimpleGrid>

          <FormControl isRequired>
            <FormLabel>Skills</FormLabel>
            <Input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills (comma separated)"
              required
            />
          </FormControl>

          <FormControl>
            <FormLabel>About</FormLabel>
            <Textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Write something about yourself"
              size="sm"
            />
          </FormControl>

          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isLoading}
            loadingText="Updating"
            mt={4}
          >
            Update Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default StudentProfile;