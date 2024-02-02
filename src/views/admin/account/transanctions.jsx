import React from 'react';
import { Box } from '@chakra-ui/react';

import BackButton from 'components/menu/BackButton';
import StaffRecentTransactions from 'components/transactions/StaffRecentTransactions';
import { useAuth } from 'contexts/AuthContext';

const Transactions = () => {
  const { currentUser } = useAuth();
  return (
    <Box p={4}>
      <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
        <BackButton />
        <StaffRecentTransactions staffId={currentUser.id} />
      </Box>
    </Box>
  );
};

export default Transactions;
