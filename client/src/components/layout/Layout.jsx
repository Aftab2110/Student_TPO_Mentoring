import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <Box 
        flex={1} 
        overflow="auto"
        ml="280px"
        transition="margin-left 0.3s ease"
      >
        <Navbar user={user} />
        <Box p={5}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;