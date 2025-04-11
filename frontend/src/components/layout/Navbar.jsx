import React from 'react';
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Avatar,
  useColorMode,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    // TODO: Implement logout logic
    navigate('/login');
  };

  return (
    <Box
      as="nav"
      bg="white"
      boxShadow="sm"
      p={4}
      position="sticky"
      top={0}
      zIndex="sticky"
    >
      <Flex justify="space-between" align="center">
        <Text fontSize="lg" fontWeight="bold">
          {user?.role === 'student' ? 'Student Portal' : 'TPO Portal'}
        </Text>

        <Flex align="center" gap={4}>
          <IconButton
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            aria-label="Toggle color mode"
          />

          <Menu>
            <MenuButton>
              <Avatar
                size="sm"
                name={user?.name}
                src={user?.avatar}
                cursor="pointer"
              />
            </MenuButton>
            <MenuList>
              {user?.role === 'student' && (
                <MenuItem onClick={() => navigate('/profile')}>
                  Profile
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Navbar;