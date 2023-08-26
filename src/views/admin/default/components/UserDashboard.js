/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
  Spacer,
  Stack,
  Select,
  FormControl,
  Input,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

// Custom components
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { SearchIcon } from '@chakra-ui/icons';

import SimpleTable from 'components/table/SimpleTable';

import Card from 'components/card/Card';
import PackageCard from 'components/package/PackageCard';

export default function UserDashboard() {
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [userPackages, setUserPackages] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { customerData, setCustomerData } = useAppContext();

  // Function to fetch user ds package data
  const fetchDsPackage = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get(
        `daily-savings/package?userId=${currentUser.id}&accountNumber=${customerData.accountNumber}`
      );
      setUserPackages(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching user package.'
      );
      setLoading(false);
    }
  };
  // Function to fetch user sb package data

  // Function to fetch user activities data
  const fetchUserActivities = async () => {
    try {
      const response = await axiosService.get(
        `/transactions?accountNumber=${customerData.accountNumber}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to fetch account data
  const fetchAccount = async () => {
    try {
      const response = await axiosService.get(`/accounts/${currentUser.id}`);
      setCustomerData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Reload data when customerData changes
  useEffect(() => {
    fetchUserActivities();
  }, [customerData, currentUser.id]);

  // Reload data when id changes
  useEffect(() => {
    fetchDsPackage();
  }, [currentUser.id, customerData, setUserPackages]);

  // Load account data when component mounts
  useEffect(() => {
    fetchAccount();
  }, [currentUser.Buttonid]);

  // Filter expenditures based on search term
  useEffect(() => {
    const filtered = transactions?.filter((transaction) => {
      if (selectedFilter === 'all') {
        return true; // Show all transactions
      } else if (selectedFilter === 'deposit') {
        return transaction.narration === 'Daily contribution';
      } else if (selectedFilter === 'withdrawal') {
        return transaction.narration !== 'Daily contribution';
      }
      return false;
    });
    setFilteredTransaction(filtered);
  }, [selectedFilter, transactions]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Naration',
        accessor: 'narration',
        Cell: ({ value }) => (
          <Text>
            {value === 'Daily contribution withdrawal'
              ? 'Deposit'
              : 'Withdrawal'}
          </Text>
        ),
      },
      {
        Header: 'Cashier',
        accessor: (row) =>
          `${row.userReps?.firstName} ${row.userReps?.lastName}`,
      },
    ],
    []
  );
  
  return (
    <Box pt={{ base: '0px', md: '40px', xl: '40px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex justifyContent="space-between">
            <Box>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold">
                  Account Ballance:
                  <Icon
                    ml="2"
                    fontSize="lg"
                    _hover={{ cursor: 'pointer', color: 'blue.500' }}
                    as={showBalance ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={() =>
                      setShowBalance((prevShowBalance) => !prevShowBalance)
                    }
                  />
                </Text>
              </Flex>
              <Text
                ml="2"
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="bold"
                color={showBalance ? 'gray.800' : 'gray.400'}
              >
                {customerData &&
                customerData.availableBalance !== undefined &&
                showBalance
                  ? formatNaira(customerData.availableBalance)
                  : '****'}
              </Text>
            </Box>
          </Flex>

          {/* Savings Summary Section */}

          <Flex direction={{ base: 'column', md: 'row' }} mb="20px" mt="40px">
            <Card>
              <Flex alignItems="center">
                <Flex flexDirection="column">
                  <Text
                    fontWeight="bold"
                    fontSize="xl"
                    mt="10px"
                    color={textColor}
                  >
                    Packages
                  </Text>
                  <Text fontSize="sm" color={textColorSecondary} pb="20px">
                    Lists of user's packages
                  </Text>
                </Flex>

                <Spacer />
                <NavLink to="/admin/daily-saving/package">
                  <Button bgColor="blue.700" color="white">
                    Create Package
                  </Button>
                </NavLink>
              </Flex>
              <hr color={textColor} />

              {userPackages.length !== 0 ? (
                <Grid
                  templateColumns={{
                    base: 'repeat(1, 1fr)',
                    md: 'repeat(2, 1fr)',
                  }}
                  gap={2}
                  mt="20px"
                >
                  {userPackages?.map((packageData, index) => (
                    <PackageCard key={index} packageData={packageData} />
                  ))}
                </Grid>
              ) : (
                <Flex justifyContent="center" mt="4">
                  <Button
                    color="green"
                    as={NavLink}
                    to="/admin/daily-saving/package"
                  >
                    No Package Found, Create One
                  </Button>
                </Flex>
              )}
            </Card>
          </Flex>

          {/* Recent Transactions Section */}
          <Box mt="80px">
            <Flex
              justifyContent="space-between"
              direction={{ base: 'column', md: 'row' }}
              mb="40px"
            >
              <Heading size="lg" mb="4">
                Recent Transactions
              </Heading>
              <Box>
                <Stack direction="row">
                  <Select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="deposit">Deposit</option>
                    <option value="withdrawal">Withdrawal</option>
                  </Select>
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search"
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
            {transactions && transactions.length > 0 ? (
              <SimpleTable columns={columns} data={filteredTransaction} />
            ) : (
              <Text>Transaction not found</Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}
