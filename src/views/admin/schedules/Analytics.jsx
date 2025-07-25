import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  useColorModeValue,
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
  StatArrow,
  Badge,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';

const ScheduleAnalytics = () => {
  const [stats, setStats] = useState({});
  const [schedulerStats, setSchedulerStats] = useState({});
  const [dueSchedules, setDueSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingDue, setProcessingDue] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const cardBg = useColorModeValue('white', 'navy.700');

  useEffect(() => {
    fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [statsRes, schedulerRes, dueRes] = await Promise.all([
        axiosService.get('/scheduled-contributions/stats'),
        axiosService.get('/scheduled-contributions/admin/scheduler/stats'),
        axiosService.get('/scheduled-contributions/admin/due-list'),
      ]);
      
      setStats(statsRes.data || {});
      setSchedulerStats(schedulerRes.data || {});
      setDueSchedules(dueRes.data.results || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const processDueContributions = async () => {
    try {
      setProcessingDue(true);
      const response = await axiosService.post('/scheduled-contributions/admin/process-due');
      toast({
        title: 'Success',
        description: `Processed ${response.data.processed || 0} due contributions`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchAnalytics();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process due contributions',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setProcessingDue(false);
    }
  };

  const restartScheduler = async () => {
    try {
      await axiosService.post('/scheduled-contributions/admin/scheduler/restart');
      toast({
        title: 'Success',
        description: 'Scheduler restarted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchAnalytics();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to restart scheduler',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateSuccessRate = () => {
    const total = (stats.successfulPayments || 0) + (stats.failedPayments || 0);
    if (total === 0) return 0;
    return Math.round(((stats.successfulPayments || 0) / total) * 100);
  };

  if (loading) {
    return (
      <Box p={6}>
        <Flex justify="center" align="center" h="200px">
          <Spinner size="xl" />
        </Flex>
      </Box>
    );
  }

  const successRate = calculateSuccessRate();

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      <BackButton />
      
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Schedule Analytics
        </Text>
        <HStack spacing={4}>
          <Button
            colorScheme="orange"
            onClick={onOpen}
            isDisabled={dueSchedules.length === 0}
          >
            Process Due ({dueSchedules.length})
          </Button>
          <Button
            colorScheme="blue"
            variant="outline"
            onClick={restartScheduler}
          >
            Restart Scheduler
          </Button>
          <Button
            colorScheme="green"
            variant="outline"
            onClick={fetchAnalytics}
          >
            Refresh
          </Button>
        </HStack>
      </Flex>

      {/* Overview Stats */}
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={6}>
        <GridItem>
          <Card bg={cardBg} p={6}>
            <Stat>
              <StatLabel>Total Schedules</StatLabel>
              <StatNumber color="blue.500">{stats.totalSchedules || 0}</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                {stats.activeSchedules || 0} active
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>
        <GridItem>
          <Card bg={cardBg} p={6}>
            <Stat>
              <StatLabel>Total Contributions</StatLabel>
              <StatNumber color="green.500">{formatCurrency(stats.totalContributions)}</StatNumber>
              <StatHelpText>
                {stats.totalPayments || 0} payments
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>
        <GridItem>
          <Card bg={cardBg} p={6}>
            <Stat>
              <StatLabel>Success Rate</StatLabel>
              <StatNumber color={successRate > 80 ? 'green.500' : 'orange.500'}>
                {successRate}%
              </StatNumber>
              <StatHelpText>
                {stats.successfulPayments || 0} / {(stats.successfulPayments || 0) + (stats.failedPayments || 0)} payments
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>
        <GridItem>
          <Card bg={cardBg} p={6}>
            <Stat>
              <StatLabel>Due Today</StatLabel>
              <StatNumber color="orange.500">{dueSchedules.length}</StatNumber>
              <StatHelpText>
                Pending processing
              </StatHelpText>
            </Stat>
          </Card>
        </GridItem>
      </Grid>

      {/* Detailed Analytics */}
      <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={6} mb={6}>
        {/* Payment Status Breakdown */}
        <GridItem>
          <Card bg={cardBg} p={6}>
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Payment Status Breakdown
            </Text>
            <VStack spacing={4} align="stretch">
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">Successful Payments</Text>
                  <Text fontSize="sm" fontWeight="bold" color="green.500">
                    {stats.successfulPayments || 0}
                  </Text>
                </Flex>
                <Progress
                  colorScheme="green"
                  value={successRate}
                  size="sm"
                />
              </Box>
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">Failed Payments</Text>
                  <Text fontSize="sm" fontWeight="bold" color="red.500">
                    {stats.failedPayments || 0}
                  </Text>
                </Flex>
                <Progress
                  colorScheme="red"
                  value={100 - successRate}
                  size="sm"
                />
              </Box>
              <Box>
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">Pending Payments</Text>
                  <Text fontSize="sm" fontWeight="bold" color="orange.500">
                    {stats.pendingPayments || 0}
                  </Text>
                </Flex>
                <Progress
                  colorScheme="orange"
                  value={(stats.pendingPayments || 0) / ((stats.totalPayments || 1)) * 100}
                  size="sm"
                />
              </Box>
            </VStack>
          </Card>
        </GridItem>

        {/* Schedule Status Distribution */}
        <GridItem>
          <Card bg={cardBg} p={6}>
            <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
              Schedule Status Distribution
            </Text>
            <VStack spacing={4} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm">Active Schedules</Text>
                <Badge colorScheme="green" variant="subtle">
                  {stats.activeSchedules || 0}
                </Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm">Paused Schedules</Text>
                <Badge colorScheme="yellow" variant="subtle">
                  {stats.pausedSchedules || 0}
                </Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm">Cancelled Schedules</Text>
                <Badge colorScheme="red" variant="subtle">
                  {stats.cancelledSchedules || 0}
                </Badge>
              </Flex>
              <Flex justify="space-between" align="center">
                <Text fontSize="sm">Completed Schedules</Text>
                <Badge colorScheme="blue" variant="subtle">
                  {stats.completedSchedules || 0}
                </Badge>
              </Flex>
            </VStack>
          </Card>
        </GridItem>
      </Grid>

      {/* Scheduler Status */}
      <Card bg={cardBg} p={6}>
        <Text fontSize="lg" fontWeight="bold" color={textColor} mb={4}>
          Scheduler Status
        </Text>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6}>
          <GridItem>
            <Stat>
              <StatLabel>Scheduler Status</StatLabel>
              <StatNumber fontSize="lg">
                <Badge 
                  colorScheme={schedulerStats.isRunning ? 'green' : 'red'} 
                  size="lg"
                >
                  {schedulerStats.isRunning ? 'RUNNING' : 'STOPPED'}
                </Badge>
              </StatNumber>
              <StatHelpText>
                Last check: {formatDate(schedulerStats.lastCheck)}
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Jobs Processed Today</StatLabel>
              <StatNumber color="blue.500">
                {schedulerStats.jobsProcessedToday || 0}
              </StatNumber>
              <StatHelpText>
                Last processed: {formatDate(schedulerStats.lastProcessed)}
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Queue Status</StatLabel>
              <StatNumber color="purple.500">
                {schedulerStats.queueSize || 0} pending
              </StatNumber>
              <StatHelpText>
                Next run: {formatDate(schedulerStats.nextRun)}
              </StatHelpText>
            </Stat>
          </GridItem>
        </Grid>
      </Card>

      {/* Process Due Contributions Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Process Due Contributions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>
              You are about to process {dueSchedules.length} due contributions.
            </Text>
            <Text fontSize="sm" color="orange.500">
              This will attempt to charge all customers with due payments. 
              Make sure the payment gateway is operational before proceeding.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="orange"
              onClick={processDueContributions}
              isLoading={processingDue}
            >
              Process Now
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ScheduleAnalytics;