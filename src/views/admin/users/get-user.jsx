import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

// Chakra imports
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Text,
} from '@chakra-ui/react';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function User() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [branchInfo, setBranchInfo] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get(`users/${id}`);
        setUser(response.data);

        // Fetch branch information using the branchId
        if (response.data.branchId) {
          const branchResponse = await axiosService.get(
            `branch/${response.data.branchId}`
          );

          setBranchInfo(branchResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id]);

  const roleLabels = {
    userReps: 'Sales Rep',
    manager: 'Manager',
    admin: 'Admin',
    superAdmin: 'Super Admin',
  };

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
          <BackButton />
          <Grid
            mb="20px"
            gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}
          >
            <Flex
              flexDirection="column"
              gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
            >
              <Center py={6}>
                <Box
                  w={{ base: '90%', md: '80%' }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                >
                  {user && (
                    <Flex alignItems="center">
                      <Avatar
                        size="xl"
                        name={user.firstName || ''}
                        src={user.avatarUrl || ''}
                        m={4}
                      />
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text fontWeight="bold">Name</Text>
                          <Text>
                            {user.firstName} {user.lastName}
                          </Text>
                          <Text fontWeight="bold">Email:</Text>
                          <Text>{user.email}</Text>
                          <Text fontWeight="bold">Phone Number:</Text>
                          <Text>{user.phoneNumber}</Text>
                          <Text fontWeight="bold">Address:</Text>
                          <Text>{user.address}</Text>
                          <Text fontWeight="bold">Status:</Text>
                          <Text>{user.status}</Text>
                          <Text fontWeight="bold">Roles:</Text>
                          <Text>{roleLabels[user.role]}</Text>
                          <Text fontWeight="bold">Branch:</Text>
                          <Text>{branchInfo.name}</Text>
                        </Grid>
                        <NavLink to={`/admin/branch/staff/${id}`} mr={4}>
                          <Button mt={4} mr={2} colorScheme="blue" size="md">
                            Details
                          </Button>
                        </NavLink>
                        <NavLink to={`/admin/customer/staffaccounts/${id}`}>
                          <Button mt={4} colorScheme="blue" size="md">
                            View customers
                          </Button>
                        </NavLink>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
