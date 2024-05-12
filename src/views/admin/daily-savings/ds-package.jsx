import React, { useEffect, useState, useCallback } from 'react';

import { Box, Flex } from '@chakra-ui/react';

import { useParams } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';

import RecentTransactions from 'components/transactions/RecentTransactions';
import UsersPackages from 'components/package/UsersPackages';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import AccountDetails from '../customers/components/AccountDetails';
import PackageBalance from 'components/others/PackageBalance';

const ViewCustomerDs = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const { customerData, setCustomerData, userPackages, setUserPackages } =
    useAppContext();

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
          <PackageBalance customerData={customerData} />
          <AccountDetails customerData={customerData} />
          <UsersPackages
            userPackages={userPackages}
            handleTransferSuccess={handleTransferSuccess}
            handleDepositSuccess={handleDepositSuccess}
            handleEditSuccess={handleDepositSuccess}
          />
          <RecentTransactions />
        </>
      )}
    </Box>
  );
};

export default ViewCustomerDs;
