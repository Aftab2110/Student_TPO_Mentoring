import React from 'react';
import {
  Box,
  VStack,
  Icon,
  Text,
  Link,
  Divider,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiHome,
  FiUser,
  FiBriefcase,
  FiUsers,
  FiMessageSquare,
} from 'react-icons/fi';

const NavItem = ({ icon, children, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      as={RouterLink}
      to={to}
      textDecoration="none"
      _hover={{ textDecoration: 'none' }}
      w="full"
    >
      <Box
        display="flex"
        alignItems="center"
        p={3}
        borderRadius="md"
        bg={isActive ? 'brand.50' : 'transparent'}
        color={isActive ? 'brand.500' : 'gray.600'}
        _hover={{ bg: isActive ? 'brand.50' : 'gray.50' }}
      >
        <Icon as={icon} boxSize={5} />
        <Text ml={4} fontWeight={isActive ? 'medium' : 'normal'}>
          {children}
        </Text>
      </Box>
    </Link>
  );
};

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Box
      as="aside"
      w="250px"
      h="100vh"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py={4}
    >
      <VStack spacing={1} align="stretch" px={3}>
        <NavItem icon={FiHome} to="/">
          Dashboard
        </NavItem>

        {user?.role === 'student' ? (
          <>
            <NavItem icon={FiUser} to="/profile">
              Profile
            </NavItem>
            <NavItem icon={FiBriefcase} to="/jobs">
              Job Listings
            </NavItem>
          </>
        ) : (
          <>
            <NavItem icon={FiUsers} to="/students">
              Students
            </NavItem>
            <NavItem icon={FiBriefcase} to="/manage-jobs">
              Manage Jobs
            </NavItem>
          </>
        )}

        <Divider my={2} />

        <NavItem icon={FiMessageSquare} to="/chat">
          Chat
        </NavItem>
      </VStack>
    </Box>
  );
};

export default Sidebar;