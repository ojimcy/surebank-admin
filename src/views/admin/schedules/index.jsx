import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Input,
  Select,
  Button,
  Badge,
  useToast,
  Spinner,
  HStack,
  VStack,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import Card from 'components/card/Card';
import CustomTable from 'components/table/CustomTable';
import axiosService from 'utils/axiosService';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [filteredSchedules, setFilteredSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [stats, setStats] = useState({});
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [actionLoading, setActionLoading] = useState(false);

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');

  useEffect(() => {
    fetchSchedules();
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterSchedules();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [schedules, searchTerm, statusFilter]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get('/scheduled-contributions/admin/all');
      console.log('response', response);
      
      setSchedules(response.data.results || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch schedules',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axiosService.get('/scheduled-contributions/stats');
      setStats(response.data || {});
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const filterSchedules = () => {
    let filtered = schedules;

    if (searchTerm) {
      filtered = filtered.filter((schedule) =>
        schedule.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((schedule) => schedule.status === statusFilter);
    }

    setFilteredSchedules(filtered);
  };

  const handleScheduleAction = async (scheduleId, action) => {
    try {
      setActionLoading(true);
      await axiosService.patch(`/scheduled-contributions/${scheduleId}/${action}`);
      toast({
        title: 'Success',
        description: `Schedule ${action}d successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchSchedules();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} schedule`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'paused':
        return 'yellow';
      case 'cancelled':
        return 'red';
      case 'completed':
        return 'blue';
      default:
        return 'gray';
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: 'Customer',
        accessor: 'user',
        Cell: ({ value }) => (
          <VStack align="start" spacing={1}>
            <Text fontWeight="bold">
              {value?.firstName} {value?.lastName}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {value?.email}
            </Text>
          </VStack>
        ),
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        Cell: ({ value }) => (
          <Text fontWeight="bold" color="green.500">
            {formatCurrency(value)}
          </Text>
        ),
      },
      {
        Header: 'Frequency',
        accessor: 'frequency',
        Cell: ({ value }) => (
          <Badge colorScheme="purple" variant="subtle">
            {value?.toUpperCase()}
          </Badge>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <Badge colorScheme={getStatusColor(value)} variant="subtle">
            {value?.toUpperCase()}
          </Badge>
        ),
      },
      {
        Header: 'Next Payment',
        accessor: 'nextPaymentDate',
        Cell: ({ value }) => (
          <Text fontSize="sm">
            {value ? formatDate(value) : 'N/A'}
          </Text>
        ),
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
        Cell: ({ value }) => (
          <Text fontSize="sm">{formatDate(value)}</Text>
        ),
      },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={() => {
              setSelectedSchedule(row.original);
              onOpen();
            }}
          >
            Manage
          </Button>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  if (loading) {
    return (
      <Box p={6}>
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Stats Cards */}
      <Flex
        mb={6}
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Card bg={cardBg} p={4} flex="1">
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="blue.500">
              {stats.totalSchedules || 0}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Total Schedules
            </Text>
          </VStack>
        </Card>
        <Card bg={cardBg} p={4} flex="1">
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {stats.activeSchedules || 0}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Active Schedules
            </Text>
          </VStack>
        </Card>
        <Card bg={cardBg} p={4} flex="1">
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="purple.500">
              {formatCurrency(stats.totalContributions || 0)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Total Contributions
            </Text>
          </VStack>
        </Card>
        <Card bg={cardBg} p={4} flex="1">
          <VStack>
            <Text fontSize="2xl" fontWeight="bold" color="orange.500">
              {stats.dueSchedules || 0}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Due Today
            </Text>
          </VStack>
        </Card>
      </Flex>

      {/* Main Content Card */}
      <Card bg={cardBg} p={6}>
        <Flex mb={6} direction={{ base: 'column', md: 'row' }} gap={4}>
          <Text fontSize="xl" fontWeight="bold" color={textColor}>
            Scheduled Contributions
          </Text>
          <Flex flex="1" direction={{ base: 'column', md: 'row' }} gap={4}>
            <InputGroup flex="1">
              <InputLeftElement>
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search by customer name, email, or schedule name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
            <Select
              placeholder="Filter by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              w={{ base: '100%', md: '200px' }}
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </Select>
            <Button
              colorScheme="blue"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
            >
              Clear Filters
            </Button>
          </Flex>
        </Flex>

        <CustomTable columns={columns} data={filteredSchedules} />
      </Card>

      {/* Schedule Management Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Manage Schedule</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSchedule && (
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text fontWeight="bold" mb={2}>
                    Schedule Details
                  </Text>
                  <Text>Name: {selectedSchedule.name}</Text>
                  <Text>Amount: {formatCurrency(selectedSchedule.amount)}</Text>
                  <Text>Frequency: {selectedSchedule.frequency}</Text>
                  <Text>Status: {selectedSchedule.status}</Text>
                  <Text>
                    Customer: {selectedSchedule.user?.firstName} {selectedSchedule.user?.lastName}
                  </Text>
                </Box>
                
                <HStack spacing={4}>
                  {selectedSchedule.status === 'active' && (
                    <Button
                      colorScheme="yellow"
                      onClick={() => handleScheduleAction(selectedSchedule.id, 'pause')}
                      isLoading={actionLoading}
                    >
                      Pause Schedule
                    </Button>
                  )}
                  {selectedSchedule.status === 'paused' && (
                    <Button
                      colorScheme="green"
                      onClick={() => handleScheduleAction(selectedSchedule.id, 'resume')}
                      isLoading={actionLoading}
                    >
                      Resume Schedule
                    </Button>
                  )}
                  {(selectedSchedule.status === 'active' || selectedSchedule.status === 'paused') && (
                    <Button
                      colorScheme="red"
                      onClick={() => handleScheduleAction(selectedSchedule.id, 'cancel')}
                      isLoading={actionLoading}
                    >
                      Cancel Schedule
                    </Button>
                  )}
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Schedules;