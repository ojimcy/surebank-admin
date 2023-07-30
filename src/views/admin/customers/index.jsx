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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import { toSentenceCase } from 'utils/helper';

export default function Customers() {
  const [customers, setCustomers] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch customers
  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get('/accounts/');
        setCustomers(response.data.results);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAccounts();
  }, []);

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
          <Flex justifyContent="space-between" mb="20px">
            <BackButton />
            <Menu isLazy>
              <MenuButton>Manage Customer</MenuButton>
              <MenuList>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                  as={Link}
                  to="/admin/transaction/deposit"
                >
                  <Text fontSize="sm">Deposit</Text>
                </MenuItem>
                <MenuItem
                  _hover={{ bg: 'none' }}
                  _focus={{ bg: 'none' }}
                  borderRadius="8px"
                  px="14px"
                  as={Link}
                  to="/admin/transaction/withdraw"
                >
                  <Text fontSize="sm">Withdraw</Text>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
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
            ) : customers.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No customer records found.
              </Text>
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
                    {customers.map((customer) => {
                      return (
                        <Tr key={customer.id}>
                          <Td>
                            <NavLink to={`/admin/customer/${customer.userId}`}>
                              {customer.firstName} {customer.lastName}
                            </NavLink>
                          </Td>
                          <Td>{customer.status}</Td>
                          <Td>
                            {customer.branchName &&
                              toSentenceCase(customer.branchName)}
                          </Td>
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
              {customers && (
                <Box>
                  Showing {(currentPage - 1) * 10 + 1} to{' '}
                  {Math.min(currentPage * 10, customers.length)} of{' '}
                  {customers.length} entries
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
