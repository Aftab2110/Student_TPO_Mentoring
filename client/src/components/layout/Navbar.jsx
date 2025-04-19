import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = () => {
    dispatch(logout());
  };

  // Memoize the user menu to prevent unnecessary re-renders
  const userMenu = useMemo(() => {
    return (
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<Avatar size="sm" name={user?.name} />}
          variant="ghost"
          aria-label="User menu"
        />
        <MenuList>
          <MenuItem icon={<FiUser />}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </MenuList>
      </Menu>
    );
  }, [user?.name]);

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      px={4}
      py={2}
      position="sticky"
      top={0}
      zIndex={2}
    >
      <Flex align="center" justify="space-between">
        <Flex align="center">
          <IconButton
            icon={<FiMenu />}
            variant="ghost"
            aria-label="Toggle sidebar"
            display={{ base: 'flex', md: 'none' }}
          />
          <Text fontSize="xl" fontWeight="bold" ml={4}>
            {user?.role === 'student' ? 'Student Portal' : 'TPO Portal'}
          </Text>
        </Flex>

        <Flex align="center">
          <IconButton
            icon={<FiBell />}
            variant="ghost"
            aria-label="Notifications"
            mr={4}
          />
          {userMenu}
        </Flex>
      </Flex>
    </Box>
  );
};

export default React.memo(Navbar);