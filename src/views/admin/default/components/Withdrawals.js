// Chakra imports
import {
  Box,
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
  Text,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

// Assets
import axiosService from 'utils/axiosService';
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom/';

import { useAppContext } from 'contexts/AppContext';
import { formatDate } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';

export default function Withdrawals() {
  const { currentUser } = useAuth();
  const { branches, setLoading } = useAppContext();
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branch, setBranch] = useState('');
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const handleTimeRangeChange = useCallback(
    (e) => {
      setTimeRange(e.target.value);
    },
    [setTimeRange]
  );

  const handleBranchChange = useCallback(
    (e) => {
      setBranch(e.target.value);
    },
    [setBranch]
  );

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

  const handleStatusChange = useCallback(
    (e) => {
      setSelectedStatus(e.target.value);
    },
    [setSelectedStatus]
  );

  const handleCustomDateApply = useCallback(() => {
    if (startDate && endDate) {
      setCustomRangeLabel(`${startDate} to ${endDate}`);
    }
    setCustomDateModalOpen(false);
  }, [endDate, startDate]);

  const handleCustomRangeClick = useCallback(() => {
    setCustomDateModalOpen(true);
  }, [setCustomDateModalOpen]);

  useEffect(() => {
    async function fetchWithdrawals() {
      setLoading(true);
      const { pageIndex, pageSize } = pagination;

      let endpoint = `/transactions/withdraw/cash?limit=${pageSize}&page=${
        pageIndex + 1
      }`;
      if (timeRange === 'last7days') {
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        endpoint += `&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
      } else if (timeRange === 'last30days') {
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 30);
        startDate.setHours(0, 0, 0, 0);
        endpoint += `&startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
      } else if (timeRange === 'custom') {
        if (startDate && endDate) {
          const customStartDate = new Date(startDate);
          customStartDate.setHours(0, 0, 0, 0);
          const customEndDate = new Date(endDate);
          customEndDate.setHours(23, 59, 59, 999);
          endpoint += `&startDate=${customStartDate.getTime()}&endDate=${customEndDate.getTime()}`;
        }
      }
      if (branch) {
        endpoint += `&branchId=${branch}`;
      }
      if (selectedStatus !== 'all') {
        endpoint += `&status=${selectedStatus}`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange, branch, startDate, endDate, pagination]);

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
    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus
      );
    }

    setFilteredWithdrawals(filteredData);
  }, [withdrawals, timeRange, selectedStatus]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Narration',
        accessor: 'narration',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Sales Rep',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.createdBy?._id}`}>
            {row.createdBy?.firstName} {row.createdBy?.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.date),
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
      <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
        <Box marginTop="30">
          <Flex>
            <Box>
              <Stack direction="row">
                <Select value={timeRange} onChange={handleTimeRangeChange}>
                  <option value="all">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="custom" onClick={handleCustomRangeClick}>
                    {customRangeLabel}
                  </option>
                </Select>
                {currentUser.role === 'superAdmin' ||
                  (currentUser.role === 'admin' && (
                    <Select value={branch} onChange={handleBranchChange}>
                      <option>Select Branch</option>
                      {branches &&
                        branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch?.name}
                          </option>
                        ))}
                    </Select>
                  ))}

                <Select value={selectedStatus} onChange={handleStatusChange}>
                  <option value="all">All</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </Stack>
            </Box>
          </Flex>
        </Box>
        <Box marginTop="30">
          {filteredWithdrawals && filteredWithdrawals.length !== 0 ? (
            <CustomTable
              columns={columns}
              data={filteredWithdrawals}
              onPageChange={onPageChange}
            />
          ) : (
            <Text fontSize="lg" textAlign="center" mt="20">
              No records found!
            </Text>
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
