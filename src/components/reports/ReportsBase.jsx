// Chakra imports
import {
  Box,
  Flex,
  Stack,
  Select,
  Text,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';

// Assets
import axiosService from 'utils/axiosService';
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom/';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira, formatDate } from 'utils/helper';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import CustomDateModal from 'components/modals/CustomDateModal';

// Constants for better maintainability
const TIME_RANGES = [
  { value: 'all', label: 'All Time' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
  { value: 'custom', label: 'Custom Range' },
];

const REASONS_OPTIONS = {
  all: [
    { value: '', label: 'All' },
    { value: 'SMS charge', label: 'SMS charge' },
    { value: 'Profit from SB', label: 'Profit from SB' },
    { value: 'DS charge', label: 'DS Charge' },
  ],
};

export default function ReportsBase({
  title,
  reportType, // 'ds', 'sb', 'others'
  endpoint,
  totalEndpoint,
  showReasonFilter = false,
  customColumns = null,
}) {
  const { branches } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [timeRange, setTimeRange] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [branch, setBranch] = useState('');
  const [isCustomDateModalOpen, setCustomDateModalOpen] = useState(false);
  const [customRangeLabel, setCustomRangeLabel] = useState('Custom Range');
  const [selectedReason, setSelectedReason] = useState('');

  // Date utilities
  const getDateRange = useCallback((range) => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (range) {
      case 'last7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case 'last30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      default:
        return null;
    }

    return { startDate: startDate.getTime(), endDate: endDate.getTime() };
  }, []);

  // Build query parameters
  const buildQueryParams = useCallback(() => {
    const params = new URLSearchParams();

    // Add fixed reasons for specific report types
    if (reportType === 'ds') {
      params.append('reasons', 'DS charge');
    } else if (reportType === 'sb') {
      params.append('reasons', 'Profit from SB');
    } else if (selectedReason && showReasonFilter) {
      params.append('reasons', selectedReason);
    }

    if (timeRange === 'custom' && startDate && endDate) {
      const customStartDate = new Date(startDate);
      customStartDate.setHours(0, 0, 0, 0);
      const customEndDate = new Date(endDate);
      customEndDate.setHours(23, 59, 59, 999);
      params.append('startDate', customStartDate.getTime());
      params.append('endDate', customEndDate.getTime());
    } else if (timeRange !== 'all') {
      const dateRange = getDateRange(timeRange);
      if (dateRange) {
        params.append('startDate', dateRange.startDate);
        params.append('endDate', dateRange.endDate);
      }
    }

    if (branch) params.append('branchId', branch);

    return params.toString();
  }, [
    timeRange,
    startDate,
    endDate,
    branch,
    selectedReason,
    showReasonFilter,
    getDateRange,
    reportType,
  ]);

  // Event handlers
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === 'custom') {
      setCustomDateModalOpen(true);
    } else {
      setTimeRange(selectedValue);
    }
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');

      try {
        const queryParams = buildQueryParams();
        const dataEndpoint = `${endpoint}${
          queryParams ? `?${queryParams}` : ''
        }`;

        // Fetch both data and total in parallel when possible
        const requests = [axiosService.get(dataEndpoint)];
        if (totalEndpoint) {
          const totalParams = branch ? `?branchId=${branch}` : '';
          requests.push(axiosService.get(`${totalEndpoint}${totalParams}`));
        }

        const responses = await Promise.all(requests);
        const dataResponse = responses[0];
        const totalResponse = responses[1];

        // Handle different response structures
        if (reportType === 'others') {
          setData(dataResponse.data.charges || []);
          setTotalAmount(dataResponse.data.totalCharge || 0);
        } else {
          setData(dataResponse.data || []);
          setTotalAmount(totalResponse?.data.totalCharge || 0);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, totalEndpoint, reportType, buildQueryParams, branch]);

  // Default columns
  const defaultColumns = React.useMemo(
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
        accessor: (row) => row.branchId?.name || 'N/A',
      },
      {
        Header: 'Amount',
        accessor: (row) => formatNaira(row.amount),
      },
      ...(showReasonFilter
        ? [
            {
              Header: 'Reasons',
              accessor: 'reasons',
            },
          ]
        : []),
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.date),
      },
    ],
    [showReasonFilter]
  );

  const columns = customColumns || defaultColumns;

  if (loading) return <LoadingSpinner />;

  return (
    <Box pt={{ base: '80px', md: '80px', xl: '80px' }}>
      {error && (
        <Alert status="error" mb="4">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Box mt="5">
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">{title}</Text>
          <Text fontSize="2xl" fontWeight="bold">
            {formatNaira(totalAmount)}
          </Text>
        </Flex>
      </Box>

      <Box mt="10">
        <Stack direction="row" spacing={4}>
          <Select
            value={timeRange}
            onChange={handleSelectChange}
            minWidth="150px"
          >
            {TIME_RANGES.map((range) => (
              <option key={range.value} value={range.value}>
                {range.value === 'custom' ? customRangeLabel : range.label}
              </option>
            ))}
          </Select>

          {showReasonFilter && (
            <Select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              minWidth="150px"
            >
              <option value="">Select Reasons</option>
              {REASONS_OPTIONS.all.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </Select>
          )}

          <Select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            minWidth="150px"
          >
            <option value="">Select Branch</option>
            {branches?.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </Select>
        </Stack>
      </Box>

      <Box marginTop="30">
        {data && data.length > 0 ? (
          <CustomTable columns={columns} data={data} />
        ) : (
          <Text fontSize="lg" textAlign="center" mt="20">
            No records found!
          </Text>
        )}
      </Box>

      <CustomDateModal
        isOpen={isCustomDateModalOpen}
        onClose={() => setCustomDateModalOpen(false)}
        startDate={startDate ? new Date(startDate) : new Date()}
        endDate={endDate ? new Date(endDate) : new Date()}
        handleStartDateChange={(e) => setStartDate(e.target.value)}
        handleEndDateChange={(e) => setEndDate(e.target.value)}
        handleCustomDateApply={handleCustomDateApply}
      />
    </Box>
  );
}
