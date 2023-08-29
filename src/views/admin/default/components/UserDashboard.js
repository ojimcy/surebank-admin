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

  // Fetch all required data
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch user activities
      const userActivitiesResponse = await axiosService.get(
        `/transactions?accountNumber=${customerData.accountNumber}`
      );
      setTransactions(userActivitiesResponse.data);

      // Fetch user account data
      const accountResponse = await axiosService.get(
        `/accounts/${currentUser.id}`
      );
      setCustomerData(accountResponse.data);

      // Fetch user ds package data
      const dsPackageResponse = await axiosService.get(
        `daily-savings/package?userId=${currentUser.id}&accountNumber=${customerData.accountNumber}`
      );
      setUserPackages(dsPackageResponse.data);

      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching data.'
      );
      setLoading(false);
    }
  };

  // Reload data when id changes
  useEffect(() => {
    fetchData();
  }, [currentUser]);

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

                  <UsersPackages userPackages={userPackages} />

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
