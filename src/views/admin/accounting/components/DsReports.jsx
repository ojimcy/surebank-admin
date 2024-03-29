// Chakra imports
import { Box, Flex, Stack, Select, Text } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

// Assets
import axiosService from 'utils/axiosService';
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom/';

import { useAppContext } from 'contexts/AppContext';
import { formatNaira, formatDate } from 'utils/helper';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import CustomDateModal from 'components/modals/CustomDateModal';

export default function Charges() {
  const { branches } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [charges, setCharges] = useState([]);
  const [filterdCharges, setFilterdCharges] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branch, setBranch] = useState('');
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');
  const [totalCharge, setTotalCharge] = useState(0);

  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      setTimeRange(selectedValue);
    }
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
    async function fetchCharges() {
      setLoading(true);

      let endpoint = `/reports/charges?reasons=DS charge`;
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
      if (branch) {
        endpoint += `&branchId=${branch}`;
      }

      try {
        const response = await axiosService.get(endpoint);
        const chargeResponse = await axiosService.get(
          '/reports/contribution-incomes/ds/supperadmin'
          );

        setCharges(response.data);
        setTotalCharge(chargeResponse.data.totalCharge);
        setLoading(false);
      } catch (error) {
        // Handle error
        setLoading(false);
      }
    }

    fetchCharges();
  }, [timeRange, branch, startDate, endDate]);

  useEffect(() => {
    let filteredData = charges;

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
    setFilterdCharges(filteredData);
  }, [charges, endDate, startDate, timeRange]);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.userId?.id}`}>
            {row.userId?.firstName} {row.userId?.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Branch',
        accessor: (row) => row.branchId.name,
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.date),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
          <Box mt="5">
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontSize="2xl">DS Income</Text>
              <Text fontSize="2xl" fontWeight="bold">
                {formatNaira(totalCharge)}
              </Text>
            </Flex>
          </Box>
          <Box mt="10">
            <Stack direction="row">
              <Select
                value={timeRange}
                onChange={handleSelectChange}
                minWidth="150px"
              >
                <option value="all">All Time</option>
                <option value="last7days">Last 7 Days</option>
                <option value="last30days">Last 30 Days</option>
                <option value="custom">{customRangeLabel}</option>
              </Select>

              <Select value={branch} onChange={handleBranchChange}>
                <option>Select Branch</option>
                {branches &&
                  branches.map((branch) => (
                    <option key={branch?.id} value={branch?.id}>
                      {branch?.name}
                    </option>
                  ))}
              </Select>
            </Stack>
          </Box>
          <Box marginTop="30">
            {filterdCharges && filterdCharges.length > 0 ? (
              <CustomTable columns={columns} data={filterdCharges} />
            ) : (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            )}
          </Box>
        </Box>
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
    </>
  );
}
