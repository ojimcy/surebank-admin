/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import { toast } from 'react-toastify';

// Custom components
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';
import { useAuth } from 'contexts/AuthContext';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

import RecentTransactions from 'components/transactions/RecentTransactions';
import UsersPackages from 'components/package/UsersPackages';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);

  // Fetch user activities
  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get(
        `/transactions?accountNumber=${customerData.accountNumber}`
      );
      setTransactions(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching user activities.'
      );
      setLoading(false);
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
      setLoading(true);
      const accountResponse = await axiosService.get(
        `/accounts/${currentUser.id}`
      );
      setCustomerData(accountResponse.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching user account data.'
      );
      setLoading(false);
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

  return (
    <Box pt={{ base: '0px', md: '40px', xl: '40px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex justifyContent="space-between" mb="40px">
            <Box>
              <Flex alignItems="center">
                {/* account informations */}
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

          <Box>
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
                  <p>SB accounts here!</p>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      )}
    </Box>
  );
}
