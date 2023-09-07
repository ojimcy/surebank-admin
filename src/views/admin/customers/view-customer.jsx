/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
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
} from '@chakra-ui/react';
// import { CustomButton } from 'components/Button/CustomButton';
import { FaCopy } from 'react-icons/fa';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
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

export default function ViewCustomer() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [transactions, setTransactions] = useState([]);

  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();

  // Function to fetch user package data
  const fetchUserPackages = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get(
        `daily-savings/package?userId=${id}&accountNumber=${customerData.accountNumber}`
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

  // Function to fetch user activities data
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

  // Function to fetch account data
  const fetchAccount = async () => {
    try {
      setLoading(true);
      const accountResponse = await axiosService.get(`/accounts/${id}`);
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
    fetchAccount();
  }, [id]);

  useEffect(() => {
    if (customerData) {
      fetchUserActivities();
      fetchUserPackages();
    }
  }, [customerData]);


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

  const handleTransferSuccess = () => {
    // Fetch updated data after successful transfer here
    fetchAccount();
    fetchUserPackages();
  };

  const handleDepositSuccess = () => {
    // Fetch updated data after successful deposit here
    fetchAccount();
    fetchUserPackages();
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
            <MenuItem>
              <NavLink to="/admin/transaction/deposit">Deposit</NavLink>
            </MenuItem>
            <MenuItem>
              <NavLink to="/admin/transaction/withdraw">Withdraw</NavLink>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      {loading ? (
        <Spinner />
      ) : (
        <Box p="4">
          <Flex flexDirection="column">
            <Flex alignItems="center">
              <Text fontSize="lg" fontWeight="bold">
                Available Balance:
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
          </Flex>

          <Flex
            direction={{ base: 'column', md: 'row' }}
            spacing={{ base: '4', md: '0' }}
            justifyContent={{ base: 'center', md: 'space-between' }}
          >
            <Flex alignItems="center" mt="4">
              <Avatar
                size="xl"
                name={customerData.firstName || ''}
                src={customerData.avatarUrl || ''}
                m={4}
              />
              <Box px={6} py={4}>
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
                    Account Manager: {customerData.accountManagerId?.firstName}{' '}
                    {customerData.accountManagerId?.lastName}
                  </Text>
                </Grid>
              </Box>
            </Flex>
          </Flex>
          <Tabs variant="soft-rounded" colorScheme="green" mt="2rem">
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
      )}
    </Box>
  );
}
