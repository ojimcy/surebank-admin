import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserRepsDashboard from './components/UserRepsDashboard';
import UserDashboard from './components/UserDashboard';
import ManagerDashboard from './components/ManagerDashboard';

export default function UserReports() {
  const { currentUser } = useAuth();
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {currentUser ? (
        currentUser.role === 'superAdmin' ? (
          <SuperAdminDashboard />
        ) : currentUser.role === 'userReps' ? (
          <UserRepsDashboard />
        ) : currentUser.role === 'admin' ? (
          <AdminDashboard />
        ) :currentUser.role === 'manager' ? (
          <ManagerDashboard />
        ) : (
          <UserDashboard />
        )
      ) : (
        <Text>Unauthorized!!!</Text>
      )}
    </Box>
  );
}
