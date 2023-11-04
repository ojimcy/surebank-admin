/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Icon,
  Spinner,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Button,
  Avatar,
  useBreakpointValue,
  Link,
  Grid
} from '@chakra-ui/react';

import { FaCopy } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

// Custom components
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

import RecentTransactions from 'components/transactions/RecentTransactions';
import UsersPackages from 'components/package/UsersPackages';
import SbPackage from 'components/package/SbPackage';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const isMobile = useBreakpointValue({ base: true, md: false });

  // Fetch user activities
  const fetchUserActivities = async () => {
    try {
      const response = await axiosService.get(
        `/transactions?accountNumber=${customerData?.accountNumber}`
      );
      setTransactions(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching user activities.'
      );
    }
  };
  
  // Fetch user ds package data
  const fetchUserPackages = async () => {
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
          'An error occurred while fetching user packages.'
      );
      setLoading(false);
    }
  };

  // Fetch user account data and then user activities and packages
  const fetchData = async () => {
    try {
      const accountResponse = await axiosService.get(
        `/accounts/${currentUser.id}`
      );
      setCustomerData(accountResponse.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching user account data.'
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    if (customerData) {
      fetchUserActivities();
      fetchUserPackages();
    }
  }, [customerData]);

  const handleTransferSuccess = () => {
    // Fetch updated data after successful transfer here
    fetchData();
    fetchUserPackages();
  };

  const handleDepositSuccess = () => {
    // Fetch updated data after successful deposit here
    fetchData();
    fetchUserPackages();
  };

  // Function to handle copy to clipboard
  const handleCopyToClipboard = useCallback(() => {
    const textField = document.createElement('textarea');
    textField.innerText = customerData.accountNumber;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();

    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  });

  const handleShowUserDetails = () => {
    setShowUserDetails((prevShowUserDetails) => !prevShowUserDetails);
  };

  return (
    <Box pt={{ base: '0px', md: '40px', xl: '40px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex justifyContent="space-between">
            <Flex>
              {isMobile ? null : (
                <Avatar
                  size="xl"
                  name="SB"
                  src={customerData.avatarUrl || ''}
                  m={4}
                />
              )}
              <Flex flexDirection="column" justifyContent="center">
                <Flex alignItems="center" justifyContent="center">
                  <Text fontSize="lg">
                    SB Savings
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
                  fontSize={{ base: 'xl', md: '2xl' }}
                  fontWeight="bold"
                  color={showBalance ? 'gray.800' : 'gray.400'}
                >
                  {customerData && customerData?.availableBalance && showBalance
                    ? formatNaira(customerData.availableBalance)
                    : '****'}
                </Text>
              </Flex>
            </Flex>
            <Box>
              <NavLink to="/admin/transaction/withdraw">
                <Button colorScheme="green">Withdraw Cash</Button>
              </NavLink>
            </Box>
          </Flex>

          <Link onClick={handleShowUserDetails} ml='20px'>
            {showUserDetails ? 'Hide Details' : 'Show Details'}
          </Link>

          {showUserDetails && (
            <Flex
              direction={{ base: 'column', md: 'row' }}
              spacing={{ base: '4', md: '0' }}
              justifyContent={{ base: 'center', md: 'space-between' }}
            >
              <Flex alignItems="center" mt="4">
                <Box px={6} py={2}>
                  <Grid templateColumns="repeat(1fr)" gap={1}>
                    <Text fontSize={{ base: 'md', md: 'lg' }}>
                      Account Name: {customerData.firstName}{' '}
                      {customerData.lastName}
                    </Text>
                    <Text fontSize={{ base: 'md', md: 'lg' }}>
                      Account Number: {customerData.accountNumber}
                      <Button size="sm" onClick={handleCopyToClipboard}>
                        {isCopied ? 'Copied!' : <FaCopy />}
                      </Button>
                    </Text>
                    <Text fontSize={{ base: 'md', md: 'lg' }}>
                      Branch: {customerData.branchId?.name}
                    </Text>
                    <Text fontSize={{ base: 'md', md: 'lg' }}>
                      Account Manager:{' '}
                      {customerData.accountManagerId?.firstName}{' '}
                      {customerData.accountManagerId?.lastName}
                    </Text>
                  </Grid>
                </Box>
              </Flex>
            </Flex>
          )}

          <Box mt="40px">
            <Tabs variant="soft-rounded" colorScheme="green">
              <TabList>
                <Tab>DS Account</Tab>
                <Tab>SB Account</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  {/* Savings Summary Section */}

                  <UsersPackages
                    userPackages={userPackages}
                    handleTransferSuccess={handleTransferSuccess}
                    handleDepositSuccess={handleDepositSuccess}
                  />

                  {/* Recent Transactions Section */}

                  <RecentTransactions transactions={transactions} />
                </TabPanel>
                <TabPanel>
                  <SbPackage />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      )}
    </Box>
  );
}
