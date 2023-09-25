// Chakra imports
import {
  Box,
  Spinner,
  Flex,
  Stack,
  Select,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

// Assets
import axiosService from 'utils/axiosService';
import SimpleTable from 'components/table/SimpleTable';
import { NavLink } from 'react-router-dom/';

import { useAppContext } from 'contexts/AppContext';

export default function Withdrawals() {
  const { branches } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branch, setBranch] = useState('');
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleCustomDateApply = () => {
    if (startDate && endDate) {
      setCustomRangeLabel(`${startDate} to ${endDate}`);
    }
    setCustomDateModalOpen(false);
  };

  useEffect(() => {
    async function fetchWithdrawals() {
      setLoading(true);

      let endpoint = `/transactions/withdraw/cash`;
      if (timeRange === 'last7days') {
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endpoint += `?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
      } else if (timeRange === 'last30days') {
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endpoint += `?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
      } else if (timeRange === 'custom') {
        if (startDate && endDate) {
          const customStartDate = new Date(startDate);
          customStartDate.setHours(0, 0, 0, 0);
          const customEndDate = new Date(endDate);
          customEndDate.setHours(23, 59, 59, 999);
          endpoint += `?startDate=${customStartDate.getTime()}&endDate=${customEndDate.getTime()}`;
        }
      }
      try {
        const response = await axiosService.get(endpoint);
        setWithdrawals(response.data);
        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    }

    fetchWithdrawals();
  }, [timeRange, branch, startDate, endDate]);

  useEffect(() => {
    let filteredData = withdrawals;

    // Apply filters
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
    }
    setFilteredWithdrawals(filteredData);
  }, [withdrawals, timeRange]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Cashier',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.userReps._id}`}>
            {row.userReps?.firstName} {row.userReps?.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Direction',
        accessor: 'direction',
      },

      {
        Header: 'Action',
        accessor: (row) => (
          <NavLink
            to={`transaction/withdraw/${row._id}`}
            style={{ marginRight: '10px' }}
          >
            View
          </NavLink>
        ),
      },
    ],
    []
  );

  return (
    <>
      <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
        <Box marginTop="30">
          <Flex>
            <Box>
              <Stack direction="row">
                <Select
                  value={timeRange}
                  onChange={handleTimeRangeChange}
                  minWidth="150px"
                >
                  <option value="all">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option
                    value="custom"
                    onClick={() => setCustomDateModalOpen(true)}
                  >
                    {customRangeLabel}
                  </option>
                </Select>

                <Select value={branch} onChange={handleBranchChange}>
                  <option>Select Branch</option>
                  {branches &&
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch?.name}
                      </option>
                    ))}
                </Select>
              </Stack>
            </Box>
          </Flex>
        </Box>
        <Box marginTop="30">
          {loading ? (
            <Spinner />
          ) : (
            <SimpleTable columns={columns} data={filteredWithdrawals} />
          )}
        </Box>
      </Box>

      <Modal
        isOpen={isCustomDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Custom Date Selection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing="4">
              <Flex align="center">
                <label htmlFor="startDate">Start Date:</label>
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </Flex>
              <Flex align="center">
                <label htmlFor="endDate">End Date:</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={handleEndDateChange}
                  max={new Date().toISOString().split('T')[0]}
                />
              </Flex>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCustomDateApply}>
              Apply
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCustomDateModalOpen(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
