import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Stack,
  Select,
  FormControl,
  Input,
  Button,
  Text,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import axiosService from 'utils/axiosService';
import { useAppContext } from 'contexts/AppContext';
import TransactionItem from 'components/transactions/TransactionItem';
import { useAuth } from 'contexts/AuthContext';

function RecentTransactions({ staffId }) {
  const { customerData } = useAppContext();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [transactions, setTransactions] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await axiosService.get(
        `/transactions?createdBy=${staffId}`
      );

      setTransactions(response.data);
    };

    fetchActivities();
  }, [currentUser.id, currentUser.role, customerData?.accountNumber, staffId]);

  useEffect(() => {
    const filtered = transactions?.filter((transaction) => {
      if (selectedFilter === 'all') {
        return true;
      } else if (selectedFilter === 'deposit') {
        return (
          transaction.narration === 'Daily contribution' ||
          transaction.narration === 'SB Daily contribution'
        );
      } else if (selectedFilter === 'withdrawal') {
        return (
          transaction.narration !== 'Daily contribution' &&
          !transaction.narration !== 'SB Daily contribution'
        );
      }
      return false;
    });
    setFilteredTransaction(filtered);
  }, [selectedFilter, transactions]);

  useEffect(() => {
    const filtered = transactions?.filter((transaction) => {
      const fullNameRep =
        `${transaction.createdBy.firstName} ${transaction.createdBy.lastName}`.toLowerCase();
      const fullNameUser =
        `${transaction.userId.firstName} ${transaction.userId.lastName}`.toLowerCase();

      const repNameMatch = fullNameRep.includes(searchTerm.toLowerCase());
      const userMameMatch = fullNameUser.includes(searchTerm.toLowerCase());

      return repNameMatch || userMameMatch;
    });
    setFilteredTransaction(filtered);
  }, [searchTerm, transactions]);

  const visibleTransactions = showAllTransactions
    ? filteredTransaction
    : filteredTransaction.slice(0, 20);

  const shouldShowViewAllButton = filteredTransaction.length > 20;

  return (
    <Box mt="80px">
      <Flex
        justifyContent="space-between"
        mb="40px"
        flexDirection={{
          base: 'column',
          xl: 'row',
        }}
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
      {visibleTransactions && visibleTransactions.length > 0 ? (
        <>
          {visibleTransactions.map((transaction, index) => (
            <TransactionItem key={index} transaction={transaction} />
          ))}
          {!showAllTransactions && shouldShowViewAllButton && (
            <Button
              mt="4"
              bgColor="blue.700"
              color="white"
              onClick={() => setShowAllTransactions(true)}
            >
              View All Transactions
            </Button>
          )}
        </>
      ) : (
        <Text>Transaction not found</Text>
      )}
    </Box>
  );
}

export default RecentTransactions;
