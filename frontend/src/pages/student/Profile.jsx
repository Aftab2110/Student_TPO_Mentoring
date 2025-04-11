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
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';

const StudentProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.auth);
  const { profile, isLoading } = useSelector((state) => state.student);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    degree: '',
    graduationYear: '',
    cgpa: '',
    skills: '',
    about: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        college: profile.college || '',
        degree: profile.degree || '',
        graduationYear: profile.graduationYear || '',
        cgpa: profile.cgpa || '',
        skills: profile.skills?.join(', ') || '',
        about: profile.about || '',
      });
    }
  }, [profile]);

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
      // TODO: Implement profile update logic
      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={5}>Student Profile</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                type="email"
                isReadOnly
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </FormControl>

            <FormControl>
              <FormLabel>College</FormLabel>
              <Input
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college name"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Degree</FormLabel>
              <Input
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Enter your degree"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Graduation Year</FormLabel>
              <Select
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
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

            <FormControl>
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
              />
            </FormControl>
          </SimpleGrid>

          <FormControl>
            <FormLabel>Skills</FormLabel>
            <Input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Enter your skills (comma separated)"
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
          >
            Update Profile
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default StudentProfile;