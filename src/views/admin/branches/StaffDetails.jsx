import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import AdminDetails from './components/AdminDetails';
import UserRepsDetails from './components/UserRepsDetails';
import ManagerDetails from './components/ManagerDetails';

export default function ViewStaffDetails() {
  const { id } = useParams();
  const staffId = id;

  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const getUser = await axiosService.get(`/users/${staffId}`);
        setUser(getUser.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [staffId]);

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {user.role === 'userReps' ? (
        <UserRepsDetails staffId={staffId} />
      ) : user.role === 'admin' ? (
        <AdminDetails />
      ) : user.role === 'manager' ? (
        <ManagerDetails staffId={staffId} />
      ) : (
        <Text>Not found!!!</Text>
      )}
    </Box>
  );
}
