import React from 'react';
import { Box } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';
import AdminDashboard from './components/SuperAdminDashboard';

export default function UserReports() {
  const { currentUser } = useAuth();
  currentUser && console.log(currentUser);
  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {currentUser && currentUser.role === 'superAdmin' ? (
        <AdminDashboard />
      ) : (
        <>Welcome</>
      )}
    </Box>
  );
}
