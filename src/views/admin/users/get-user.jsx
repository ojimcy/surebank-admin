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
import { useAuth } from 'contexts/AuthContext';

export default function User() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get(`users/${id}`);
        setUser(response.data);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, [id]);

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
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
                    <Flex
                      alignItems="center"
                      flexDirection={{ base: 'column', md: 'row' }}
                    >
                      <Avatar
                        size="xl"
                        name={user.firstName || ''}
                        src={user.avatarUrl || ''}
                        m={{ base: 4, md: 0 }}
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
                          <Text>{user.role}</Text>
                          <Text fontWeight="bold">Address:</Text>
                          <Text>{user.address}</Text>
                        </Grid>
                        <Grid
                          templateColumns={{
                            base: '1fr',
                            md: 'repeat(3, 1fr)',
                          }}
                          gap={4}
                          mt={4}
                        >
                          {user.role !== 'user' && (
                            <>
                              <NavLink to={`/admin/branch/staff/${id}`}>
                                <Button colorScheme="blue" size="md" w="100%">
                                  Details
                                </Button>
                              </NavLink>
                              <NavLink
                                to={`/admin/customer/staffaccounts/${id}`}
                              >
                                <Button colorScheme="blue" size="md" w="100%">
                                  View Customers
                                </Button>
                              </NavLink>
                            </>
                          )}
                          {currentUser.id !== user.id && (
                            <NavLink to={`/admin/user/edit-user/${id}`}>
                              <Button colorScheme="blue" size="md" w="100%">
                                Edit Profile
                              </Button>
                            </NavLink>
                          )}
                        </Grid>
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
