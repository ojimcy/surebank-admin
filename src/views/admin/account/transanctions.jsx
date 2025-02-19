import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Input,
  Select,
  Stack,
  Text,
  Spinner,
} from '@chakra-ui/react';

import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import { useAuth } from 'contexts/AuthContext';
import axiosService from 'utils/axiosService';
import CustomDateModal from 'components/modals/CustomDateModal';
import { formatDate, formatNaira } from 'utils/helper';

const Transactions = () => {
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');
  const [selectedStaff, setSelectedStaff] = useState(currentUser.id);
  const [staffList, setStaffList] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 100000000,
  });
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchStaffList = async () => {
    try {
      const response = await axiosService.get('/staff');
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  useEffect(() => {
    if (currentUser.role === 'superAdmin') {
      fetchStaffList();
    }
  }, [currentUser.role]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const { pageIndex, pageSize } = pagination;

    const params = new URLSearchParams();
    params.append('page', pageIndex + 1);
    params.append('limit', pageSize);

    // Filter by staff
    if (selectedStaff !== 'all') params.append('createdBy', selectedStaff);

    // Fetch all transactions without filters
    try {
      const response = await axiosService.get(
        `/transactions?${params.toString()}`
      );
      setTransactions(response.data.transactions);
      setFilteredTransactions(response.data.transactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination, selectedStaff]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Filter transactions on the frontend
  useEffect(() => {
    let filtered = [...transactions];

    // Filter by narration
    if (selectedFilter !== 'all') {
      filtered = filtered.filter((transaction) => {
        const narration = transaction.narration.toLowerCase();
        if (selectedFilter === 'ds-deposit') {
          return narration === 'daily contribution';
        } else if (selectedFilter === 'sb-deposit') {
          return (
            narration === 'sb daily contribution - cash' ||
            narration === 'sb daily contribution - transfer'
          );
        } else if (selectedFilter === 'withdrawal') {
          return narration === 'daily contribution withdrawal';
        }
        return true;
      });
    }

    // Filter by date range
    if (timeRange !== 'all') {
      const now = new Date();
      if (timeRange === 'last7days') {
        const last7Days = new Date();
        last7Days.setDate(now.getDate() - 7);
        filtered = filtered.filter(
          (transaction) => new Date(transaction.date) >= last7Days
        );
      } else if (timeRange === 'last30days') {
        const last30Days = new Date();
        last30Days.setDate(now.getDate() - 30);
        filtered = filtered.filter(
          (transaction) => new Date(transaction.date) >= last30Days
        );
      } else if (timeRange === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        filtered = filtered.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          return transactionDate >= start && transactionDate <= end;
        });
      }
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((transaction) => {
        const fullNameRep =
          `${transaction.createdBy?.firstName} ${transaction.createdBy?.lastName}`.toLowerCase();
        return fullNameRep.includes(searchTerm.toLowerCase());
      });
    }

    // Calculate total amount
    const total = filtered.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );
    setTotalAmount(total);

    // Update filtered transactions
    setFilteredTransactions(filtered);
  }, [transactions, selectedFilter, timeRange, startDate, endDate, searchTerm]);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      setTimeRange(selectedValue);
    }
  };

  const handleCustomDateApply = (selectedStartDate, selectedEndDate) => {
    if (selectedStartDate && selectedEndDate) {
      setCustomRangeLabel(
        `${formatDate(selectedStartDate)} to ${formatDate(selectedEndDate)}`
      );
      setStartDate(selectedStartDate);
      setEndDate(selectedEndDate);
      setTimeRange('custom');
    }
    setCustomDateModalOpen(false);
  };

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Narration',
        accessor: 'narration',
      },
      {
        Header: 'Rep',
        accessor: (row) =>
          `${row.createdBy?.firstName} ${row.createdBy?.lastName}`,
      },
      {
        Header: 'Account',
        accessor: (row) => `${row.userId?.lastName} ${row.userId?.firstName}`,
      },
      {
        Header: 'Amount',
        accessor: (row) => formatNaira(row.amount),
      },
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.date),
      },
    ],
    []
  );

  return (
    <Box p={4}>
      <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
        <BackButton />
        <Flex justifyContent="space-between" mb="40px">
          <Stack direction="row">
            <Select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="ds-deposit">DS Deposit</option>
              <option value="sb-deposit">SB Deposit</option>
              <option value="withdrawal">Withdrawals</option>
            </Select>
            <Select value={timeRange} onChange={handleSelectChange}>
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">{customRangeLabel}</option>
            </Select>
            {currentUser.role === 'superAdmin' && (
              <>
                <Select
                  value={selectedStaff}
                  onChange={(e) => setSelectedStaff(e.target.value)}
                >
                  <option value="">Select Staff</option>
                  <option value="all">All Staff</option>
                  {staffList.map((staff) => (
                    <option key={staff.id} value={staff.staffId?.id}>
                      {staff.staffId?.firstName} {staff.staffId?.lastName}
                    </option>
                  ))}
                </Select>
                <FormControl>
                  <Input
                    type="search"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </FormControl>
              </>
            )}
          </Stack>
        </Flex>

        <Flex justifyContent="space-between" alignItems="center" mb="30px">
          <Heading size={{ base: 'sm', md: 'lg' }}>Recent Transactions</Heading>
          {currentUser.role === 'superAdmin' && (
            <Text justifyContent="flex-end">
              Total Amount: {formatNaira(totalAmount)}
            </Text>
          )}
        </Flex>
        {loading ? (
          <Flex justifyContent="center" alignItems="center" h="50vh">
            <Spinner size="xl" />
          </Flex>
        ) : filteredTransactions.length > 0 ? (
          <CustomTable
            columns={columns}
            data={filteredTransactions}
            onPageChange={onPageChange}
          />
        ) : (
          <Text>No transactions found</Text>
        )}
      </Box>

      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        startDate={startDate}
        endDate={endDate}
        handleCustomDateApply={handleCustomDateApply}
      />
    </Box>
  );
};

export default Transactions;
