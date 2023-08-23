import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserRepsDashboard from './components/UserRepsDashboard';
import UserDashboard from './components/UserDashboard';

export default function UserReports() {
  const { currentUser } = useAuth();
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {currentUser ? (
        currentUser.role === 'superAdmin' ? (
          <SuperAdminDashboard />
        ) : currentUser.role === 'admin' ? (
          <UserRepsDashboard />
        ) : currentUser.role === 'admin' ? (
          <AdminDashboard />
        ) : (
          <UserDashboard />
        )
      ) : (
        <Text>Unauthorized!!!</Text>
      )}
    </Box>
  );
}
