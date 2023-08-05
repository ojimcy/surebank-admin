// Chakra imports
import {
  Box,
  Grid,
  Button,
  Spinner,
  HStack,
  Flex,
  Text,
  Spacer,
  Stack,
  FormControl,
  Input,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import axios from 'axios';
import SimpleTable from 'components/table/SimpleTable';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem('ACCESS_TOKEN_KEY');
    try {
      const response = await axiosService.get('/users/');
      setUsers(response.data.results);
      setTotalPages(response.data.totalPages);
      setLoading(false);

      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Filter Users based on search term
  useEffect(() => {
    const filtered = users?.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        user.email.includes(searchTerm)
      );
    });
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  const handleDeleteIconClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      handleDeleteUser(userToDelete);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId) => {
    try {
      await axiosService.delete(`/users/${userId}`);
      toast.success('User deleted successfully!');
      // After successful deletion, refetch the users to update the list
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'User',
        accessor: (row) => (
          <NavLink to={`/admin/customer/${row.id}`}>
            {row.firstName} {row.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Created Date',
        accessor: (row) => formatDate(row.createdAt),
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <HStack>
            {/* Edit user icon */}
            <NavLink to={`/admin/user/edit-user/${row.id}`}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                aria-label="Edit user"
              />
            </NavLink>
            {/* Delete user icon */}
            <IconButton
              icon={<DeleteIcon />}
              colorScheme="red"
              aria-label="Delete user"
              onClick={() => handleDeleteIconClick(row.id)}
            />
          </HStack>
        ),
      },
    ],
    []
  );

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
              <Spinner />
            ) : filteredUsers.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No user records found.
              </Text>
            ) : (
              <SimpleTable columns={columns} data={filteredUsers} />
            )}
            <HStack mt="4" justify="space-between" align="center">
              {users && (
                <Box>
                  Showing {(currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(currentPage * 10, users.length)} of {users.length}{' '}
                  entries
                </Box>
              )}
              <HStack>
                <Button
                  disabled={currentPage === 1}
                  onClick={handlePreviousPageClick}
                >
                  Previous Page
                </Button>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={handleNextPageClick}
                >
                  Next Page
                </Button>
              </HStack>
            </HStack>
          </Box>
        </Card>
      </Grid>
      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete User</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this user?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleDeleteConfirm}>
              Delete
            </Button>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
