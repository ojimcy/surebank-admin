// Chakra imports
import {
  Box,
  Grid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  HStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get('/users/');
      console.log('res', response);
      setUsers(response.data.results);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

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
        <Card>
          {loading ? (
            <Spinner />
          ) : (
            <Table>
              <Thead>
                <Tr>
                  <Th>User </Th>
                  <Th>Status</Th>
                  <Th>Last Updated </Th>
                  <Th>Created Date </Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <NavLink
                        to={`/admin/profile/${user.id}`}
                      >{`${user.firstName} ${user.lastName}`}</NavLink>{' '}
                    </Td>
                    <Td>{user.status}</Td>
                    <Td>{formatDate(user.updatedAt)}</Td>
                    <Td>{formatDate(user.createdAt)}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
        </Card>
      </Grid>
    </Box>
  );
}
