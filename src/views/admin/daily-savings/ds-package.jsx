import React, { useEffect, useState, useCallback } from 'react';

import {
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  Text,
  useBreakpointValue,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';

import { NavLink, useParams } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';

import RecentTransactions from 'components/transactions/RecentTransactions';
import UsersPackages from 'components/package/UsersPackages';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import AccountDetails from '../customers/components/AccountDetails';
import { ChevronDownIcon } from '@chakra-ui/icons';

const ViewCustomerDs = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();

  const isMobile = useBreakpointValue({ base: true, md: false });

  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      const accountResponse = await axiosService.get(
        `/accounts/${id}?accountType=ds`
      );
      const packagesResponse = await axiosService.get(
        `daily-savings/package?userId=${id}`
      );
      setCustomerData(accountResponse.data);
      setUserPackages(packagesResponse.data);
    } catch (error) {
      console.error(error);
      setCustomerData(null);
    } finally {
      setLoading(false);
    }
  }, [id, setCustomerData, setUserPackages]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleTransferSuccess = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  const handleDepositSuccess = useCallback(() => {
    fetchUserData();
  }, [fetchUserData]);

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <Flex justifyContent="space-between" mb="20px">
        <BackButton />
      </Flex>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
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
                <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
                  {customerData && customerData?.availableBalance && showBalance
                    ? formatNaira(customerData.availableBalance)
                    : '****'}
                </Text>
              </Flex>
            </Flex>
            <Box>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                  Withdraw
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <NavLink to="/admin/transaction/withdraw">
                      Withdraw Cash
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink to="/admin/transaction/bank-transfer">
                      Bank Transfer
                    </NavLink>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          </Flex>
          <AccountDetails customerData={customerData} />
          <UsersPackages
            userPackages={userPackages}
            handleTransferSuccess={handleTransferSuccess}
            handleDepositSuccess={handleDepositSuccess}
          />
          <RecentTransactions />
        </>
      )}
    </Box>
  );
};

export default ViewCustomerDs;
