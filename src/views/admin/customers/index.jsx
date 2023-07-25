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
  Flex,
  Text,
  Spacer,
  Stack,
  FormControl,
  Input,
  TableContainer,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';

export default function Customers() {
  const [users, setUsers] = useState([]);
  const [usersAccount, setUsersAccount] = useState({});
  const [branchInfoMap, setBranchInfoMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch user information
  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get('/users/');
      setUsers(response.data.results);
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch user account information for all users
  const fetchAllUsersAccounts = async () => {
    try {
      const userAccountsPromises = users.map((user) =>
        axiosService.get(`accounts/${user.id}`)
      );
      const userAccountsResponses = await Promise.all(userAccountsPromises);
      const userAccountsData = userAccountsResponses.reduce((acc, response) => {
        acc[response.data.userId] = response.data;
        return acc;
      }, {});
      setUsersAccount(userAccountsData);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch branch information for all branches
  const fetchAllBranchInfo = async () => {
    try {
      const branchPromises = Object.values(usersAccount).map(
        (account) => account.branchId
      );
      const branchResponses = await Promise.all(
        branchPromises.map((branchId) =>
          axiosService.get(`/branch/${branchId}`)
        )
      );
      const branchData = branchResponses.reduce((acc, response, index) => {
        acc[branchPromises[index]] = response.data;
        return acc;
      }, {});
      setBranchInfoMap(branchData);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect to fetch user information and user account information on initial load and when currentPage changes
  useEffect(() => {
    fetchUserInfo();
  }, [currentPage]);

  // useEffect to fetch user account information and branch information whenever users state is updated
  useEffect(() => {
    if (users.length > 0) {
      fetchAllUsersAccounts();
      fetchAllBranchInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  // Combine user and account information for each customer
  const getCustomerInfo = (user) => {
    const account = usersAccount[user.id];
    const branch = branchInfoMap[account?.branchId];
    return {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      status: user.status,
      branch: user ? branch?.name || 'N/A' : 'N/A',
      accountType: account ? account.accountType : 'N/A',
      accountNumber: account ? account.accountNumber : 'N/A',
    };
  };

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
          <Flex>
            <Text fontSize="2xl">Customers</Text>
            <Spacer />
            <NavLink to="/admin/customer/create">
              <Button bgColor="blue.700" color="white">
                Create Customers
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
            ) : (
              <TableContainer>
                <Table variant="simple" bordered>
                  <Thead>
                    <Tr>
                      <Th>Name </Th>
                      <Th>Status</Th>
                      <Th>Branch </Th>
                      <Th>Account Type </Th>
                      <Th>Account Number </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => {
                      const customer = getCustomerInfo(user);
                      return (
                        <Tr key={customer.id}>
                          <Td>
                            <NavLink to={`/admin/customer/${customer.id}`}>
                              {customer.name}
                            </NavLink>
                          </Td>
                          <Td>{customer.status}</Td>
                          <Td>{customer.branch}</Td>
                          <Td>{customer.accountType}</Td>
                          <Td>{customer.accountNumber}</Td>
                        </Tr>
                      );
                    })}
                  </Tbody>
                </Table>
              </TableContainer>
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
    </Box>
  );
}
