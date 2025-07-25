import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Badge,
  Button,
  useToast,
  Spinner,
  VStack,
  HStack,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import { useParams, useHistory } from 'react-router-dom';
import Card from 'components/card/Card';
import CustomTable from 'components/table/CustomTable';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';

const ScheduleDetail = () => {
  const { scheduleId } = useParams();
  const history = useHistory();
  const [schedule, setSchedule] = useState(null);
  const [paymentLogs, setPaymentLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedAction, setSelectedAction] = useState('');

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');

  useEffect(() => {
    fetchScheduleDetails();
    fetchPaymentLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  const fetchScheduleDetails = async () => {
    try {
      const response = await axiosService.get(`/scheduled-contributions/${scheduleId}`);
      setSchedule(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch schedule details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      history.push('/admin/schedules');
    }
  };

  const fetchPaymentLogs = async () => {
    try {
      setLoading(true);
      const response = await axiosService.get(`/scheduled-contributions/${scheduleId}/logs`);
      setPaymentLogs(response.data.results || []);
    } catch (error) {
      console.error('Failed to fetch payment logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleAction = async (action) => {
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
      fetchScheduleDetails();
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
      case 'success':
        return 'green';
      case 'failed':
        return 'red';
      case 'pending':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const paymentColumns = useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'createdAt',
        Cell: ({ value }) => (
          <Text fontSize="sm">{formatDate(value)}</Text>
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
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => (
          <Badge colorScheme={getStatusColor(value)} variant="subtle">
            {value?.toUpperCase()}
          </Badge>
        ),
      },
      {
        Header: 'Payment Method',
        accessor: 'paymentMethod',
        Cell: ({ value }) => (
          <Text fontSize="sm">{value || 'Card'}</Text>
        ),
      },
      {
        Header: 'Reference',
        accessor: 'reference',
        Cell: ({ value }) => (
          <Text fontSize="sm" fontFamily="mono">
            {value}
          </Text>
        ),
      },
      {
        Header: 'Error Message',
        accessor: 'errorMessage',
        Cell: ({ value }) => (
          <Text fontSize="sm" color="red.500">
            {value || '-'}
          </Text>
        ),
      },
    ],
    []
  );

  if (!schedule || loading) {
    return (
      <Box p={6}>
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  const successfulPayments = paymentLogs.filter(log => log.status === 'success').length;
  const totalAmount = paymentLogs
    .filter(log => log.status === 'success')
    .reduce((sum, log) => sum + log.amount, 0);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BackButton />
      
      {/* Schedule Overview */}
      <Card bg={cardBg} p={6} mb={6}>
        <VStack spacing={6} align="stretch">
          <Flex justify="space-between" align="center">
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              {schedule.name}
            </Text>
            <Badge colorScheme={getStatusColor(schedule.status)} size="lg">
              {schedule.status?.toUpperCase()}
            </Badge>
          </Flex>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem>
              <Stat>
                <StatLabel>Customer</StatLabel>
                <StatNumber fontSize="lg">
                  {schedule.user?.firstName} {schedule.user?.lastName}
                </StatNumber>
                <StatHelpText>{schedule.user?.email}</StatHelpText>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Amount</StatLabel>
                <StatNumber color="green.500">
                  {formatCurrency(schedule.amount)}
                </StatNumber>
                <StatHelpText>{schedule.frequency}</StatHelpText>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Total Contributed</StatLabel>
                <StatNumber color="blue.500">
                  {formatCurrency(totalAmount)}
                </StatNumber>
                <StatHelpText>{successfulPayments} payments</StatHelpText>
              </Stat>
            </GridItem>
            <GridItem>
              <Stat>
                <StatLabel>Next Payment</StatLabel>
                <StatNumber fontSize="md">
                  {schedule.nextPaymentDate ? formatDate(schedule.nextPaymentDate) : 'N/A'}
                </StatNumber>
                <StatHelpText>
                  Created: {formatDate(schedule.createdAt)}
                </StatHelpText>
              </Stat>
            </GridItem>
          </Grid>

          {/* Action Buttons */}
          <HStack spacing={4}>
            {schedule.status === 'active' && (
              <Button
                colorScheme="yellow"
                onClick={() => {
                  setSelectedAction('pause');
                  onOpen();
                }}
              >
                Pause Schedule
              </Button>
            )}
            {schedule.status === 'paused' && (
              <Button
                colorScheme="green"
                onClick={() => {
                  setSelectedAction('resume');
                  onOpen();
                }}
              >
                Resume Schedule
              </Button>
            )}
            {(schedule.status === 'active' || schedule.status === 'paused') && (
              <Button
                colorScheme="red"
                onClick={() => {
                  setSelectedAction('cancel');
                  onOpen();
                }}
              >
                Cancel Schedule
              </Button>
            )}
          </HStack>
        </VStack>
      </Card>

      {/* Payment History */}
      <Card bg={cardBg} p={6}>
        <Text fontSize="xl" fontWeight="bold" color={textColor} mb={6}>
          Payment History ({paymentLogs.length} payments)
        </Text>
        
        {paymentLogs.length > 0 ? (
          <CustomTable columns={paymentColumns} data={paymentLogs} />
        ) : (
          <Flex justify="center" align="center" h="100px">
            <Text color="gray.500">No payment history available</Text>
          </Flex>
        )}
      </Card>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Action</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to {selectedAction} this schedule?
              {selectedAction === 'cancel' && (
                <Text mt={2} color="red.500" fontSize="sm">
                  This action cannot be undone. The schedule will be permanently cancelled.
                </Text>
              )}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme={selectedAction === 'cancel' ? 'red' : 'blue'}
              onClick={() => handleScheduleAction(selectedAction)}
              isLoading={actionLoading}
            >
              Confirm {selectedAction}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ScheduleDetail;