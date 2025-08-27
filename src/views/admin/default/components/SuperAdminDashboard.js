import React, { useEffect } from 'react';
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Flex,
  Text,
  VStack,
  HStack,
  Container,
  Badge,
  Button,
} from '@chakra-ui/react';
import {
  MdAttachMoney,
  MdPerson,
  MdTrendingUp,
  MdAccountBalance,
} from 'react-icons/md';
import {
  FaMoneyBillWave,
  FaChartBar,
  FaPiggyBank,
  FaWallet,
  FaChartLine,
  FaArrowUp,
  FaArrowDown,
  FaArrowRight,
} from 'react-icons/fa';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';

import Withdrawals from './Withdrawals';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function SuperAdminDashboard() {
  const history = useHistory();
  const { currentUser } = useAuth();

  // Modern light theme colors
  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.900', 'white');
  const subtextColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBorderColor = useColorModeValue('gray.300', 'gray.600');
  const shadowColor = useColorModeValue(
    '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    'rgba(0, 0, 0, 0.3)'
  );

  useEffect(() => {
    if (!currentUser) {
      history.push('/auth/login');
    }
  }, [currentUser, history]);

  const { data, isLoading, isError } = useQuery(
    ['dashboardSummary', currentUser?.role, currentUser?.branchId],
    () => fetchDashboardSummary(currentUser?.branchId),
    {
      enabled: !!currentUser,
      staleTime: 60000,
      refetchInterval: 60000,
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    toast.error('An error occurred while fetching dashboard data.');
    return null;
  }

  const {
    totalContributions,
    sbNetBalance,
    dsNetBalance,
    ibsNetBalance,
    contributionsDailyTotal,
    dailySavingsWithdrawals,
    sbDailyTotal,
    dsDailyTotal,
    openPackageCount,
    openSbPackageCount,
    openIbsPackageCount,
    ibsPrincipalTotal,
    ibsInterestTotal,
    ibsWithdrawalsTotal,
  } = data;

  const mainStatsData = [
    {
      name: 'Total Net Balance',
      value: formatNaira(totalContributions),
      icon: MdAccountBalance,
      iconColor: 'green.500',
      iconBg: 'green.50',
      description: 'All products combined',
    },
    {
      name: 'SB Net Balance',
      value: formatNaira(sbNetBalance),
      icon: FaWallet,
      iconColor: 'blue.500',
      iconBg: 'blue.50',
      description: 'Smart Bank balance',
    },
    {
      name: 'DS Net Balance',
      value: formatNaira(dsNetBalance),
      icon: FaPiggyBank,
      iconColor: 'purple.500',
      iconBg: 'purple.50',
      description: 'Daily Savings balance',
    },
    {
      name: 'IBS Net Balance',
      value: formatNaira(ibsNetBalance),
      icon: FaChartLine,
      iconColor: 'orange.500',
      iconBg: 'orange.50',
      description: 'Interest-based Savings',
    },
  ];

  const dailyStatsData = [
    {
      name: "Today's Total Contributions",
      value: formatNaira(contributionsDailyTotal),
      icon: MdTrendingUp,
      iconColor: 'green.500',
      change: '+8.2%',
      changeType: 'positive',
    },
    {
      name: "Today's Withdrawal Requests",
      value: formatNaira(dailySavingsWithdrawals || 0),
      icon: MdAttachMoney,
      iconColor: 'red.500',
      change: '-2.1%',
      changeType: 'negative',
    },
    {
      name: "Today's DS Contributions",
      value: formatNaira(dsDailyTotal),
      icon: FaPiggyBank,
      iconColor: 'purple.500',
      change: '+5.4%',
      changeType: 'positive',
    },
    {
      name: "Today's SB Contributions",
      value: formatNaira(sbDailyTotal),
      icon: FaWallet,
      iconColor: 'blue.500',
      change: '+3.7%',
      changeType: 'positive',
    },
  ];

  const packageStatsData = [
    {
      name: 'Active DS Packages',
      value: openPackageCount?.toLocaleString() || '0',
      icon: MdPerson,
      iconColor: 'purple.500',
      iconBg: 'purple.50',
    },
    {
      name: 'Active SB Packages',
      value: openSbPackageCount?.toLocaleString() || '0',
      icon: MdPerson,
      iconColor: 'blue.500',
      iconBg: 'blue.50',
    },
    {
      name: 'Active IBS Packages',
      value: openIbsPackageCount?.toLocaleString() || '0',
      icon: FaChartLine,
      iconColor: 'orange.500',
      iconBg: 'orange.50',
    },
  ];

  const ibsStatsData = [
    {
      name: 'IBS Principal Amount',
      value: formatNaira(ibsPrincipalTotal),
      icon: MdAccountBalance,
      iconColor: 'teal.500',
      iconBg: 'teal.50',
    },
    {
      name: 'IBS Accrued Interest',
      value: formatNaira(ibsInterestTotal),
      icon: FaChartLine,
      iconColor: 'green.500',
      iconBg: 'green.50',
    },
    {
      name: 'IBS Total Withdrawals',
      value: formatNaira(ibsWithdrawalsTotal),
      icon: MdAttachMoney,
      iconColor: 'red.500',
      iconBg: 'red.50',
    },
  ];

  const handleNavigate = (path) => {
    history.push(path);
  };

  return (
    <Box minHeight="100vh">
      <Container maxW="7xl" py={{ base: 2, md: 3 }} px={{ base: 2, md: 4 }}>
        {/* Header Section */}
        <Box mb={{ base: 4, md: 6 }}>
          <VStack align="start" spacing={{ base: 2, md: 3 }}>
            <HStack spacing={{ base: 2, md: 3 }} flexWrap="wrap">
              <Text
                fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
                fontWeight="700"
                color={textColor}
                letterSpacing="-0.025em"
              >
                Super Admin Dashboard
              </Text>
              <Badge
                colorScheme="green"
                px={2}
                py={0.5}
                borderRadius="full"
                fontSize="xs"
                fontWeight="600"
                textTransform="none"
              >
                Live
              </Badge>
            </HStack>
            <Text
              color={subtextColor}
              fontSize={{ base: 'xs', md: 'sm' }}
              fontWeight="400"
            >
              Comprehensive overview of all financial operations and performance
              metrics
            </Text>
          </VStack>
        </Box>

        {/* Main Financial Overview */}
        <Box mb={{ base: 4, md: 6 }}>
          <Text
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            fontWeight="600"
            color={textColor}
            mb={{ base: 3, md: 4 }}
          >
            Financial Overview
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={{ base: 2, md: 3, lg: 4 }}
          >
            {mainStatsData.map((stat, index) => (
              <Box
                key={index}
                bg={cardBg}
                borderRadius={{ base: 'lg', md: 'xl' }}
                border="1px"
                borderColor={borderColor}
                p={{ base: 4, md: 6 }}
                boxShadow={shadowColor}
                _hover={{
                  borderColor: hoverBorderColor,
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                transition="all 0.2s ease-in-out"
              >
                <Flex
                  justify="space-between"
                  align="start"
                  mb={{ base: 2, md: 4 }}
                >
                  <Box
                    w={{ base: '36px', md: '48px' }}
                    h={{ base: '36px', md: '48px' }}
                    bg={stat.iconBg}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      as={stat.icon}
                      w={{ base: '18px', md: '24px' }}
                      h={{ base: '18px', md: '24px' }}
                      color={stat.iconColor}
                    />
                  </Box>
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text
                    color={subtextColor}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="500"
                  >
                    {stat.name}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                    fontWeight="700"
                    lineHeight="1"
                  >
                    {stat.value}
                  </Text>
                  <Text
                    color={subtextColor}
                    fontSize="xs"
                    display={{ base: 'none', md: 'block' }}
                  >
                    {stat.description}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Today's Performance */}
        <Box mb={{ base: 4, md: 6 }}>
          <Text
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            fontWeight="600"
            color={textColor}
            mb={{ base: 3, md: 4 }}
          >
            Today's Performance
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, lg: 4 }}
            gap={{ base: 2, md: 3, lg: 4 }}
          >
            {dailyStatsData.map((stat, index) => (
              <Box
                key={index}
                bg={cardBg}
                borderRadius={{ base: 'lg', md: 'xl' }}
                border="1px"
                borderColor={borderColor}
                p={{ base: 4, md: 6 }}
                boxShadow={shadowColor}
                _hover={{
                  borderColor: hoverBorderColor,
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                transition="all 0.2s ease-in-out"
              >
                <Flex
                  justify="space-between"
                  align="start"
                  mb={{ base: 2, md: 4 }}
                >
                  <Icon
                    as={stat.icon}
                    w={{ base: '16px', md: '20px' }}
                    h={{ base: '16px', md: '20px' }}
                    color={stat.iconColor}
                  />
                  <HStack spacing={1}>
                    <Icon
                      as={
                        stat.changeType === 'positive' ? FaArrowUp : FaArrowDown
                      }
                      w="10px"
                      h="10px"
                      color={
                        stat.changeType === 'positive' ? 'green.500' : 'red.500'
                      }
                    />
                    <Text
                      fontSize="xs"
                      fontWeight="600"
                      color={
                        stat.changeType === 'positive' ? 'green.500' : 'red.500'
                      }
                    >
                      {stat.change}
                    </Text>
                  </HStack>
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text
                    color={subtextColor}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="500"
                  >
                    {stat.name}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    fontWeight="700"
                  >
                    {stat.value}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Active Packages */}
        <Box mb={{ base: 4, md: 6 }}>
          <Text
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            fontWeight="600"
            color={textColor}
            mb={{ base: 3, md: 4 }}
          >
            Active Packages
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 2, md: 3, lg: 4 }}
          >
            {packageStatsData.map((stat, index) => (
              <Box
                key={index}
                bg={cardBg}
                borderRadius={{ base: 'lg', md: 'xl' }}
                border="1px"
                borderColor={borderColor}
                p={{ base: 4, md: 6 }}
                boxShadow={shadowColor}
                _hover={{
                  borderColor: hoverBorderColor,
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                transition="all 0.2s ease-in-out"
              >
                <Flex
                  justify="space-between"
                  align="start"
                  mb={{ base: 2, md: 4 }}
                >
                  <Box
                    w={{ base: '32px', md: '40px' }}
                    h={{ base: '32px', md: '40px' }}
                    bg={stat.iconBg}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      as={stat.icon}
                      w={{ base: '16px', md: '20px' }}
                      h={{ base: '16px', md: '20px' }}
                      color={stat.iconColor}
                    />
                  </Box>
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text
                    color={subtextColor}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="500"
                  >
                    {stat.name}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
                    fontWeight="700"
                  >
                    {stat.value}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* IBS Details */}
        <Box mb={{ base: 4, md: 6 }}>
          <Text
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            fontWeight="600"
            color={textColor}
            mb={{ base: 3, md: 4 }}
          >
            Interest-Based Savings Details
          </Text>
          <SimpleGrid
            columns={{ base: 1, sm: 2, md: 3 }}
            gap={{ base: 2, md: 3, lg: 4 }}
          >
            {ibsStatsData.map((stat, index) => (
              <Box
                key={index}
                bg={cardBg}
                borderRadius={{ base: 'lg', md: 'xl' }}
                border="1px"
                borderColor={borderColor}
                p={{ base: 4, md: 6 }}
                boxShadow={shadowColor}
                _hover={{
                  borderColor: hoverBorderColor,
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                }}
                transition="all 0.2s ease-in-out"
              >
                <Flex
                  justify="space-between"
                  align="start"
                  mb={{ base: 2, md: 4 }}
                >
                  <Box
                    w={{ base: '32px', md: '40px' }}
                    h={{ base: '32px', md: '40px' }}
                    bg={stat.iconBg}
                    borderRadius="lg"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon
                      as={stat.icon}
                      w={{ base: '16px', md: '20px' }}
                      h={{ base: '16px', md: '20px' }}
                      color={stat.iconColor}
                    />
                  </Box>
                </Flex>
                <VStack align="start" spacing={1}>
                  <Text
                    color={subtextColor}
                    fontSize={{ base: 'xs', md: 'sm' }}
                    fontWeight="500"
                  >
                    {stat.name}
                  </Text>
                  <Text
                    color={textColor}
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    fontWeight="700"
                  >
                    {stat.value}
                  </Text>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
        </Box>

        {/* Quick Actions */}
        <Box mb={{ base: 4, md: 6 }}>
          <Text
            fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
            fontWeight="600"
            color={textColor}
            mb={{ base: 3, md: 4 }}
          >
            Quick Actions
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            gap={{ base: 2, md: 3, lg: 4 }}
          >
            <Button
              size={{ base: 'md', md: 'lg' }}
              h={{ base: '60px', md: '80px' }}
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              borderRadius={{ base: 'lg', md: 'xl' }}
              boxShadow={shadowColor}
              _hover={{
                borderColor: 'blue.300',
                bg: 'blue.50',
                transform: 'translateY(-2px)',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              _active={{
                transform: 'translateY(0px)',
                boxShadow: shadowColor,
              }}
              transition="all 0.2s ease-in-out"
              onClick={() => handleNavigate('/admin/accounting/dashboard')}
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                <Box
                  w={{ base: '24px', md: '32px' }}
                  h={{ base: '24px', md: '32px' }}
                  bg="blue.50"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={FaChartBar}
                    w={{ base: '12px', md: '16px' }}
                    h={{ base: '12px', md: '16px' }}
                    color="blue.500"
                  />
                </Box>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="600"
                  color={textColor}
                >
                  View Reports
                </Text>
                <Icon
                  as={FaArrowRight}
                  w={{ base: '12px', md: '16px' }}
                  h={{ base: '12px', md: '16px' }}
                  color={subtextColor}
                />
              </HStack>
            </Button>

            <Button
              size={{ base: 'md', md: 'lg' }}
              h={{ base: '60px', md: '80px' }}
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
              borderRadius={{ base: 'lg', md: 'xl' }}
              boxShadow={shadowColor}
              _hover={{
                borderColor: 'green.300',
                bg: 'green.50',
                transform: 'translateY(-2px)',
                boxShadow:
                  '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
              _active={{
                transform: 'translateY(0px)',
                boxShadow: shadowColor,
              }}
              transition="all 0.2s ease-in-out"
              onClick={() => handleNavigate('/admin/accounting/expenditure')}
            >
              <HStack spacing={{ base: 2, md: 3 }}>
                <Box
                  w={{ base: '24px', md: '32px' }}
                  h={{ base: '24px', md: '32px' }}
                  bg="green.50"
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon
                    as={FaMoneyBillWave}
                    w={{ base: '12px', md: '16px' }}
                    h={{ base: '12px', md: '16px' }}
                    color="green.500"
                  />
                </Box>
                <Text
                  fontSize={{ base: 'sm', md: 'md' }}
                  fontWeight="600"
                  color={textColor}
                >
                  Manage Expenditure
                </Text>
                <Icon
                  as={FaArrowRight}
                  w={{ base: '12px', md: '16px' }}
                  h={{ base: '12px', md: '16px' }}
                  color={subtextColor}
                />
              </HStack>
            </Button>
          </SimpleGrid>
        </Box>

        {/* Withdrawals Section */}
        <Box
          bg={cardBg}
          borderRadius={{ base: 'lg', md: 'xl' }}
          border="1px"
          borderColor={borderColor}
          overflow="hidden"
          boxShadow={shadowColor}
        >
          <Box
            p={{ base: 4, md: 6 }}
            borderBottom="1px"
            borderColor={borderColor}
          >
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              fontWeight="600"
              color={textColor}
            >
              Withdrawal Requests
            </Text>
            <Text color={subtextColor} fontSize="sm" mt={1}>
              Recent withdrawal requests requiring attention
            </Text>
          </Box>
          <Box p={{ base: 4, md: 6 }}>
            <Withdrawals />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

/**
 * Fetch dashboard summary data using the centralized API endpoint
 */
async function fetchDashboardSummary(branchId) {
  try {
    const params = branchId ? { branchId } : {};
    const response = await axiosService.get(
      '/reports/dashboard-summary',
      params
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    throw new Error('Failed to fetch dashboard data');
  }
}
