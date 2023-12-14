/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tabs,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  useBreakpointValue,
} from '@chakra-ui/react';
// import { CustomButton } from 'components/Button/CustomButton';
import { NavLink, useParams } from 'react-router-dom';
// Assets

// Custom components
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

import RecentTransactions from 'components/transactions/RecentTransactions';
import UsersPackages from 'components/package/UsersPackages';
import SbPackage from 'components/package/SbPackage';
import AccountDetails from './components/AccountDetails';

export default function ViewCustomer() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('ds');

  const [shouldFetchUserActivities, setShouldFetchUserActivities] =
    useState(false);

  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleTabChange = (index) => {
    setActiveTab(index === 0 ? 'ds' : 'sb');
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const accountResponse = await axiosService.get(
        `/accounts/${id}?accountType=${activeTab}`
      );
      const activitiesResponse = await axiosService.get(
        `/transactions?accountNumber=${customerData?.accountNumber}`
      );
      console.log(activitiesResponse);
      const packagesResponse = await axiosService.get(
        `daily-savings/package?userId=${id}`
      );
      setCustomerData(accountResponse.data[0]);
      setTransactions(activitiesResponse.data);
      setUserPackages(packagesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    try {
      setLoading(true);
      const activitiesResponse = await axiosService.get(
        `/transactions?accountNumber=${customerData?.accountNumber}`
      );
      setTransactions(activitiesResponse.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [id, activeTab]);

  useEffect(() => {
    fetchUserActivities();
  }, [customerData]);

  const handleTransferSuccess = () => {
    // Fetch updated data after successful transfer here
    fetchUserData();
    fetchUserActivities();
  };

  const handleDepositSuccess = () => {
    // Fetch updated data after successful deposit here
    fetchUserData();
    fetchUserActivities();
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <Flex justifyContent="space-between" mb="20px">
        <BackButton />
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            Manage Account
          </MenuButton>
          <MenuList>
            <MenuItem>
              <NavLink to="/admin/account/assign-manager">
                Assign Account Manager
              </NavLink>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <Box>
          <Flex
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Flex>
              {isMobile ? null : (
                <Avatar
                  size="xl"
                  name="SB"
                  src={(customerData && customerData.avatarUrl) || ''}
                  m={4}
                />
              )}
              <Flex flexDirection="column" justifyContent="center">
                <Flex alignItems="center" justifyContent="center">
                  <Text fontSize="lg">
                    Balance
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

          <Tabs
            variant="soft-rounded"
            colorScheme="green"
            mt="2rem"
            onChange={handleTabChange}
          >
            <TabList>
              <Tab onClick={() => handleTabChange('ds')}>DS Account</Tab>
              <Tab onClick={() => handleTabChange('sb')}>SB Account</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Savings Summary Section */}
                <AccountDetails customerData={customerData} />
                <UsersPackages
                  userPackages={userPackages}
                  handleTransferSuccess={handleTransferSuccess}
                  handleDepositSuccess={handleDepositSuccess}
                />

                {/* Recent Transactions Section */}

                <RecentTransactions transactions={transactions} />
              </TabPanel>
              <TabPanel>
                <AccountDetails customerData={customerData} />
                <SbPackage />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </Box>
  );
}
