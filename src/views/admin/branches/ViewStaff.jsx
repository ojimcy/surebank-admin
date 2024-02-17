import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import AdminDashboard from './components/AdminDashboard';
import UserRepsDashboard from './components/UserRepsDashboard';
import ManagerDashboard from './components/ManagerDashboard';
import { useParams } from 'react-router-dom';
import axiosService from 'utils/axiosService';

export default function ViewStaffDetails() {
  const { id } = useParams();
  const staffId = id;

  const [staffInfo, setStaffInfo] = useState({});

  useEffect(() => {
    let isMounted = true;

    const fetchStaff = async () => {
      try {
        const getStaff = await axiosService.get(`/staff/user/${staffId}`);
        if (isMounted) {
          setStaffInfo(getStaff.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStaff();

    return () => {
      // Cleanup function to set the isMounted flag to false when the component unmounts
      isMounted = false;
    };
  }, [staffId]);

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {staffInfo.role === 'superAdmin' ? (
        <SuperAdminDashboard />
      ) : staffInfo.role === 'userReps' ? (
        <UserRepsDashboard />
      ) : staffInfo.role === 'admin' ? (
        <AdminDashboard />
      ) : staffInfo.role === 'manager' ? (
        <ManagerDashboard />
      ) : (
        <Text>Unauthorized!!!</Text>
      )}
    </Box>
  );
}
