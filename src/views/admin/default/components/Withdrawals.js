// Withdrawals.js
import {
  Box,
  Flex,
  Select,
  Text,
  Spinner,
  HStack,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Badge,
  Icon,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import axiosService from 'utils/axiosService';
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom/';
import { useAppContext } from 'contexts/AppContext';
import { formatDate, formatNaira } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';
import CustomDateModal from 'components/modals/CustomDateModal';
import { toSentenceCase } from 'utils/helper';
import {
  FaSearch,
  FaFilter,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEye,
  FaRedo,
} from 'react-icons/fa';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  // Theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.900', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');
  const shadowColor = useColorModeValue(
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    'rgba(0, 0, 0, 0.3)'
  );
  const filterBg = useColorModeValue('gray.50', 'gray.700');

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

  const refreshData = () => {
    // Trigger refresh by updating a dependency
    setTimeRange(timeRange);
  };

  useEffect(() => {
    let isMounted = true;

    async function fetchWithdrawals() {
      setLoading(true);
      const { pageIndex, pageSize } = pagination;

      const endpoints = [
        `/transactions/withdraw/cash?narration=Request Cash SB&limit=${pageSize}&page=${pageIndex + 1
        }`,
        `/transactions/withdraw/cash?narration=Request Cash&limit=${pageSize}&page=${pageIndex + 1
        }`,
        `/transactions/withdraw/cash?narration=Self withdrawal request - ds&limit=${pageSize}&page=${pageIndex + 1
        }`,
        `/transactions/withdraw/cash?narration=Self withdrawal request - sb&limit=${pageSize}&page=${pageIndex + 1
        }`,
        `/transactions/withdraw/cash?narration=Self withdrawal request - ibs&limit=${pageSize}&page=${pageIndex + 1
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
    let filteredData = [...withdrawals];

    // Apply search filter
    if (searchTerm) {
      filteredData = filteredData.filter(
        (item) =>
          item.createdBy?.firstName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.createdBy?.lastName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          item.narration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.amount?.toString().includes(searchTerm)
      );
    }

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

    // Sort by date descending
    filteredData.sort((a, b) => b.date - a.date);

    setFilteredWithdrawals(filteredData);
  }, [withdrawals, timeRange, selectedStatus, startDate, endDate, searchTerm]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return FaCheckCircle;
      case 'pending':
        return FaClock;
      case 'rejected':
        return FaTimesCircle;
      default:
        return FaExclamationTriangle;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Sales Rep',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.createdBy?._id}`}>
            <Box>
              <Text
                fontSize="sm"
                fontWeight="600"
                color="blue.500"
                _hover={{ color: 'blue.600' }}
              >
                {row.createdBy?.firstName} {row.createdBy?.lastName}
              </Text>
            </Box>
          </NavLink>
        ),
      },
      {
        Header: 'Amount',
        accessor: (row) => (
          <Text fontSize="sm" fontWeight="600" color={textColor}>
            {formatNaira(row.amount)}
          </Text>
        ),
      },
      {
        Header: 'Type',
        accessor: (row) => (
          <Badge
            size="sm"
            variant="subtle"
            colorScheme={row.narration?.includes('SB') ? 'blue' : 'purple'}
            borderRadius="full"
            px={2}
            py={1}
          >
            {row.narration?.includes('SB') ? 'Smart Bank' : 'Daily Savings'}
          </Badge>
        ),
      },
      {
        Header: 'Status',
        accessor: (row) => (
          <HStack spacing={2}>
            <Icon
              as={getStatusIcon(row.status)}
              color={`${getStatusColor(row.status)}.500`}
            />
            <Badge
              size="sm"
              variant="subtle"
              colorScheme={getStatusColor(row.status)}
              borderRadius="full"
              px={2}
              py={1}
            >
              {toSentenceCase(row.status)}
            </Badge>
          </HStack>
        ),
      },
      {
        Header: 'Date',
        accessor: (row) => (
          <Text fontSize="sm" color={subtextColor}>
            {formatDate(row.date)}
          </Text>
        ),
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <Button
            as={NavLink}
            to={`transaction/withdraw/${row._id}`}
            size="sm"
            variant="outline"
            colorScheme="blue"
            leftIcon={<Icon as={FaEye} />}
            borderRadius="lg"
          >
            View
          </Button>
        ),
      },
    ],
    [textColor, subtextColor]
  );

  const summaryStats = {
    total: filteredWithdrawals.length,
    pending: filteredWithdrawals.filter((w) => w.status === 'pending').length,
    approved: filteredWithdrawals.filter((w) => w.status === 'approved').length,
    rejected: filteredWithdrawals.filter((w) => w.status === 'rejected').length,
    totalAmount: filteredWithdrawals.reduce(
      (sum, w) => sum + (w.amount || 0),
      0
    ),
  };

  return (
    <Box>
      {/* Summary Cards */}
      <SimpleGrid columns={{ base: 2, md: 4 }} gap={{ base: 3, md: 4 }} mb={6}>
        <Box
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow={shadowColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color={subtextColor} fontWeight="500">
              Total Requests
            </Text>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="700"
              color={textColor}
            >
              {summaryStats.total}
            </Text>
          </VStack>
        </Box>

        <Box
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow={shadowColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color={subtextColor} fontWeight="500">
              Pending
            </Text>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="700"
              color="yellow.500"
            >
              {summaryStats.pending}
            </Text>
          </VStack>
        </Box>

        <Box
          bg={cardBg}
          p={{ base: 3, md: 4 }}
          borderRadius="lg"
          border="1px"
          borderColor={borderColor}
          boxShadow={shadowColor}
        >
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color={subtextColor} fontWeight="500">
              Approved
            </Text>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              fontWeight="700"
              color="green.500"
            >
              {summaryStats.approved}
            </Text>
          </VStack>
        </Box>

      </SimpleGrid>

      {/* Filters Section */}
      <Box
        bg={cardBg}
        p={{ base: 4, md: 6 }}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow={shadowColor}
        mb={6}
      >
        <VStack spacing={4} align="stretch">
          <HStack justify="space-between" flexWrap="wrap">
            <HStack spacing={2}>
              <Icon as={FaFilter} color={subtextColor} />
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="600"
                color={textColor}
              >
                Filters
              </Text>
            </HStack>
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Icon as={FaRedo} />}
              onClick={refreshData}
              borderRadius="lg"
            >
              Refresh
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
            {/* Search */}
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Icon as={FaSearch} color={subtextColor} />
              </InputLeftElement>
              <Input
                placeholder="Search by name, amount..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="lg"
                bg={filterBg}
                border="1px"
                borderColor={borderColor}
                _focus={{ borderColor: 'blue.300', bg: cardBg }}
              />
            </InputGroup>

            {/* Date Range */}
            <Select
              value={timeRange}
              onChange={handleSelectChange}
              borderRadius="lg"
              bg={filterBg}
              border="1px"
              borderColor={borderColor}
              _focus={{ borderColor: 'blue.300', bg: cardBg }}
            >
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">{customRangeLabel}</option>
            </Select>

            {/* Branch Filter */}
            {(currentUser.role === 'superAdmin' ||
              currentUser.role === 'admin') && (
                <Select
                  value={branch}
                  onChange={handleBranchChange}
                  borderRadius="lg"
                  bg={filterBg}
                  border="1px"
                  borderColor={borderColor}
                  _focus={{ borderColor: 'blue.300', bg: cardBg }}
                >
                  <option value="">All Branches</option>
                  {branches &&
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name && toSentenceCase(branch?.name)}
                      </option>
                    ))}
                </Select>
              )}

            {/* Status Filter */}
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              borderRadius="lg"
              bg={filterBg}
              border="1px"
              borderColor={borderColor}
              _focus={{ borderColor: 'blue.300', bg: cardBg }}
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </Select>
          </SimpleGrid>
        </VStack>
      </Box>

      {/* Table Section */}
      <Box
        bg={cardBg}
        borderRadius="xl"
        border="1px"
        borderColor={borderColor}
        boxShadow={shadowColor}
        overflow="hidden"
      >
        {loading ? (
          <Flex
            justify="center"
            align="center"
            py={20}
            direction="column"
            gap={4}
          >
            <Spinner size="xl" color="blue.500" thickness="4px" />
            <Text color={subtextColor} fontSize="sm">
              Loading withdrawal requests...
            </Text>
          </Flex>
        ) : filteredWithdrawals && filteredWithdrawals.length !== 0 ? (
          <Box p={{ base: 4, md: 6 }}>
            <CustomTable
              columns={columns}
              data={filteredWithdrawals}
              onPageChange={onPageChange}
            />
          </Box>
        ) : (
          <Box p={{ base: 6, md: 10 }}>
            <Alert
              status="info"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              borderRadius="lg"
              bg={filterBg}
            >
              <AlertIcon boxSize={{ base: '32px', md: '40px' }} mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                No withdrawal requests found
              </AlertTitle>
              <AlertDescription
                maxWidth="sm"
                fontSize="sm"
                color={subtextColor}
              >
                {searchTerm ||
                  selectedStatus !== 'all' ||
                  timeRange !== 'all' ||
                  branch
                  ? 'Try adjusting your filters to see more results.'
                  : 'There are no withdrawal requests to display at this time.'}
              </AlertDescription>
            </Alert>
          </Box>
        )}
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
    </Box>
  );
}
