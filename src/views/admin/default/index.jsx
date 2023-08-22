import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserRepsDashboard from './components/UserRepsDashboard';

export default function UserReports() {
  const { currentUser } = useAuth();
  currentUser && console.log(currentUser);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {currentUser ? (
        currentUser.role === 'superAdmin' ? (
          <SuperAdminDashboard />
        ) : currentUser.role === 'admin' ? (
          <UserRepsDashboard />
        ) : (
          <AdminDashboard />
        )
      ) : (
        <Text>Unauthorized!!!</Text>
      )}
    </Box>
  );
}
