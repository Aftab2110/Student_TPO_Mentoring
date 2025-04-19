import React, { useState } from 'react';
import {
  Box,
  VStack,
  IconButton,
  useColorModeValue,
  Text,
  Flex,
  Tooltip,
} from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBriefcase,
  FiFileText,
  FiUser,
  FiLogOut,
  FiUsers,
  FiBarChart2,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const NavItem = ({ icon, children, to, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Tooltip label={children} placement="right" isDisabled={!isCollapsed}>
      <Link to={to}>
        <Flex
          align="center"
          p="4"
          mx="4"
          borderRadius="lg"
          role="group"
          cursor="pointer"
          bg={isActive ? bgColor : 'transparent'}
          _hover={{
            bg: hoverBgColor,
          }}
        >
          {icon}
          {!isCollapsed && (
            <Text ml="4" fontWeight="medium">
              {children}
            </Text>
          )}
        </Flex>
      </Link>
    </Tooltip>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    // Update the main content margin
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.marginLeft = isCollapsed ? '280px' : '80px';
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderStudentMenu = () => (
    <>
      <NavItem
        icon={<FiHome size={20} />}
        to="/dashboard"
        isCollapsed={isCollapsed}
      >
        Dashboard
      </NavItem>
      <NavItem
        icon={<FiBriefcase size={20} />}
        to="/jobs"
        isCollapsed={isCollapsed}
      >
        Jobs
      </NavItem>
      <NavItem
        icon={<FiFileText size={20} />}
        to="/applied-jobs"
        isCollapsed={isCollapsed}
      >
        Applied Jobs
      </NavItem>
      <NavItem
        icon={<FiUser size={20} />}
        to="/profile"
        isCollapsed={isCollapsed}
      >
        Profile
      </NavItem>
    </>
  );

  const renderTPOMenu = () => (
    <>
      <NavItem
        icon={<FiHome size={20} />}
        to="/tpo"
        isCollapsed={isCollapsed}
      >
        Dashboard
      </NavItem>
      <NavItem
        icon={<FiUsers size={20} />}
        to="/students"
        isCollapsed={isCollapsed}
      >
        Students
      </NavItem>
      <NavItem
        icon={<FiBriefcase size={20} />}
        to="/manage-jobs"
        isCollapsed={isCollapsed}
      >
        Manage Jobs
      </NavItem>
      <NavItem
        icon={<FiUser size={20} />}
        to="/tpo/profile"
        isCollapsed={isCollapsed}
      >
        Profile
      </NavItem>
    </>
  );

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      top="0"
      h="100vh"
      w={isCollapsed ? '80px' : '280px'}
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      transition="width 0.3s ease"
      zIndex="sticky"
    >
      <VStack h="100%" spacing={0} align="stretch">
        <Box p={4} borderBottom="1px" borderColor={borderColor}>
          <Flex justify="space-between" align="center">
            {!isCollapsed && (
              <Text fontSize="xl" fontWeight="bold">
                TPO Portal
              </Text>
            )}
            <IconButton
              icon={isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
              variant="ghost"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            />
          </Flex>
        </Box>

        <VStack spacing={1} align="stretch" mt={4}>
          {user?.role === 'student' ? renderStudentMenu() : renderTPOMenu()}
          
          <Box
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            _hover={{
              bg: useColorModeValue('gray.200', 'gray.600'),
            }}
            onClick={handleLogout}
          >
            <Flex align="center">
              <FiLogOut size={20} />
              {!isCollapsed && (
                <Text ml="4" fontWeight="medium">
                  Logout
                </Text>
              )}
            </Flex>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};

export default Sidebar;