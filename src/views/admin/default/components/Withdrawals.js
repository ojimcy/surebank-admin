// Withdrawals.js
import { Box, Flex, Stack, Select, Text, Spinner } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import axiosService from 'utils/axiosService';
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom/';
import { useAppContext } from 'contexts/AppContext';
import { formatDate } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';
import CustomDateModal from 'components/modals/CustomDateModal';
import { toSentenceCase } from 'utils/helper';

export default function Withdrawals() {
  const { currentUser } = useAuth();
  const { branches, loading, setLoading } = useAppContext();
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
    pageSize: 10000000,
  });

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      setTimeRange(selectedValue);
    }
  };

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

  useEffect(() => {
    let isMounted = true;

    async function fetchWithdrawals() {
      setLoading(true);
      const { pageIndex, pageSize } = pagination;

      const endpoints = [
        `/transactions/withdraw/cash?narration=Request Cash SB&limit=${pageSize}&page=${
          pageIndex + 1
        }`,
        `/transactions/withdraw/cash?narration=Request Cash&limit=${pageSize}&page=${
          pageIndex + 1
        }`,
      ];

      const withdrawalPromises = endpoints.map(async (endpoint) => {
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
        if (currentUser.role === 'manager') {
          endpoint += `&branchId=${branch}`;
        }
        if (currentUser.role === 'userReps') {
          endpoint += `&createdBy=${currentUser.id}`;
        }
        if (branch) {
          endpoint += `&branchId=${branch}`;
        }
        if (selectedStatus !== 'all') {
          endpoint += `&status=${selectedStatus}`;
        }
        const response = await axiosService.get(endpoint);
        return response.data.withdrawals;
      });

      try {
        const allWithdrawals = await Promise.all(withdrawalPromises);
        if (isMounted) {
          setWithdrawals(allWithdrawals.flat()); // Combine withdrawals from both requests
          setLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchWithdrawals();

    return () => {
      isMounted = false;
    };
  }, [
    timeRange,
    branch,
    startDate,
    endDate,
    pagination,
    currentUser,
    selectedStatus,
    setLoading,
  ]);

  useEffect(() => {
    let filteredData = withdrawals;

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

    if (selectedStatus !== 'all') {
      filteredData = filteredData.filter(
        (item) => item.status === selectedStatus
      );
    }

    setFilteredWithdrawals(filteredData);
  }, [withdrawals, timeRange, selectedStatus, startDate, endDate]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Sales Rep',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.createdBy?._id}`}>
            {row.createdBy?.firstName} {row.createdBy?.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Narration',
        accessor: 'narration',
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
                <Select value={timeRange} onChange={handleSelectChange}>
                  <option value="all">All Time</option>
                  <option value="last7days">Last 7 Days</option>
                  <option value="last30days">Last 30 Days</option>
                  <option value="custom">{customRangeLabel}</option>
                </Select>
                {currentUser.role === 'superAdmin' ||
                currentUser.role === 'admin' ? (
                  <Select value={branch} onChange={handleBranchChange}>
                    <option value="">Select Branch</option>
                    {branches &&
                      branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name && toSentenceCase(branch?.name)}
                        </option>
                      ))}
                  </Select>
                ) : (
                  ''
                )}
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
          {loading ? (
            <Spinner />
          ) : filteredWithdrawals && filteredWithdrawals.length !== 0 ? (
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

      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        startDate={new Date(startDate)}
        endDate={new Date(endDate)}
        handleStartDateChange={handleStartDateChange}
        handleEndDateChange={handleEndDateChange}
        handleCustomDateApply={handleCustomDateApply}
      />
    </>
  );
}
