import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <Flex h="100vh">
      <Sidebar />
      <Box flex="1" overflow="auto">
        <Navbar />
        <Box as="main" p={4}>
          <Outlet />
        </Box>
      </Box>
    </Flex>
  );
};

export default Layout;