// Chakra imports
import {
  Box,
  Grid,
  Button,
  Flex,
  Text,
  Spacer,
  Stack,
  FormControl,
  Input,
  IconButton,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { EditIcon, SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import axios from 'axios';
import CustomTable from 'components/table/CustomTable';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

import { formatMdbDate } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';

export default function Users() {
  const { currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const fetchUsers = async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;
    const accessToken = localStorage.getItem('ACCESS_TOKEN_KEY');
    try {
      const response = await axiosService.get(
        `/users?role=user&limit=${pageSize}&page=${pageIndex + 1}`
      );
      setUsers(response.data.results);
      setLoading(false);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);
  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  // Filter Users based on search term
  useEffect(() => {
    const filtered = users?.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.id}`}>
            {row.firstName} {row.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Created Date',
        accessor: (row) => formatMdbDate(row.createdAt),
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <>
            {currentUser.role === 'superAdmin' ||
            currentUser.role === 'admin' ? (
              <>
                {/* Edit user icon */}
                <NavLink
                  to={`/admin/user/edit-user/${row.id}`}
                  style={{ marginRight: '10px' }}
                >
                  <IconButton
                    icon={<EditIcon />}
                    colorScheme="blue"
                    aria-label="Edit user"
                  />
                </NavLink>
              </>
            ) : (
              <NavLink to={`/admin/customer/${row.id}`}>Details</NavLink>
            )}
          </>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <BackButton />
          <Flex>
            <Text fontSize="2xl">Users</Text>
            <Spacer />
            <NavLink to="/admin/user/create">
              <Button bgColor="blue.700" color="white">
                Create User
              </Button>
            </NavLink>
          </Flex>
          <Box marginTop="30">
            <Flex>
              <Spacer />
              <Box>
                <Stack direction="row">
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Type a name"
                      borderColor="black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormControl>
                  <Button bgColor="blue.700" color="white">
                    <SearchIcon />
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </Box>
          <Box marginTop="30">
            {loading ? (
              <LoadingSpinner />
            ) : filteredUsers.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No user records found.
              </Text>
            ) : (
              <CustomTable
                columns={columns}
                data={filteredUsers}
                onPageChange={onPageChange}
              />
            )}
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
