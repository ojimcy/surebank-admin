import React, { useState, useEffect, useCallback } from 'react';
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
import { formatDate } from 'utils/helper';
import CustomDateModal from 'components/modals/CustomDateModal';

function StaffRecentTransactions({ staffId }) {
  const { customerData } = useAppContext();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');
  const [timeRange, setTimeRange] = useState('all');

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      setTimeRange(selectedValue);
    }
  };

  const handleStartDateChange = useCallback(
    (e) => {
      setStartDate(e.target.value);
    },
    [setStartDate]
  );

  const handleEndDateChange = useCallback(
    (e) => {
      setEndDate(e.target.value);
    },
    [setEndDate]
  );
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
          transaction.narration === 'Daily contribution withdrawal' ||
          transaction.narration === 'Request Cash'
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

  useEffect(() => {
    let filteredData = transactions;

    if (timeRange === 'last7days') {
      const last7Days = new Date();
      last7Days.setDate(last7Days.getDate() - 7);
      filteredData = filteredData.filter(
        (item) => new Date(item.date) >= last7Days
      );
    } else if (timeRange === 'last30days') {
      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);
      filteredData = filteredData.filter(
        (item) => new Date(item.date) >= last30Days
      );
    } else if (timeRange === 'custom') {
      if (startDate && endDate) {
        const customStartDate = new Date(startDate);
        customStartDate.setHours(0, 0, 0, 0);
        const customEndDate = new Date(endDate);
        customEndDate.setHours(23, 59, 59, 999);
        filteredData = filteredData.filter(
          (item) =>
            new Date(item.date) >= customStartDate &&
            new Date(item.date) <= customEndDate
        );
      }
    }
    setFilteredTransaction(filteredData);
  }, [timeRange, startDate, endDate, transactions]);

  const handleCustomDateApply = useCallback(
    (selectedStartDate, selectedEndDate) => {
      if (selectedStartDate && selectedEndDate) {
        const formattedStartDate = formatDate(selectedStartDate);
        const formattedEndDate = formatDate(selectedEndDate);

        setCustomRangeLabel(`${formattedStartDate} to ${formattedEndDate}`);
        setStartDate(selectedStartDate);
        setEndDate(selectedEndDate);
        setTimeRange('custom');
      }
      setCustomDateModalOpen(false);
    },
    []
  );

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
            <Select value={timeRange} onChange={handleSelectChange}>
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">{customRangeLabel}</option>
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

      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        handleCustomDateApply={handleCustomDateApply}
      />
    </Box>
  );
}

export default StaffRecentTransactions;
