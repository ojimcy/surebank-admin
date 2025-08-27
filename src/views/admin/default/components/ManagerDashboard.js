import React, { useEffect } from 'react';
import {
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Box,
  SimpleGrid,
} from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import {
  MdAttachMoney,
  MdTrendingDown,
  MdAccountBalanceWallet,
  MdDonutLarge,
} from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import { FaMoneyBillWave } from 'react-icons/fa';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import BranchWithdrawals from './BranchWithdrawals';
import { useAuth } from 'contexts/AuthContext';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { useQuery } from 'react-query';

export default function ManagerDashboard() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const staffId = currentUser?.id;

  const { data, isLoading, isError } = useQuery(
    ['managerDashboardData', staffId],
    fetchData,
    {
      enabled: !!staffId, // ensure staffId is available before fetching
    }
  );

  useEffect(() => {
    if (!currentUser) {
      history.push('/auth/login');
    }
  }, [currentUser, history]);

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    return (
      <Box pt={{ base: '10px', md: '80px', xl: '80px' }}>
        <Text>Error fetching dashboard data. Please try again later.</Text>
      </Box>
    );
  }

  const {
    contributionsDailyTotal,
    dailySavingsWithdrawals,
    sbDailyTotal,
    dsDailyTotal,
    managerTotal,
    managerWithdrawals,
    managerSbTotal,
    managerDsTotal,
  } = data || {};

  const branchStats = [
    {
      name: 'Branch Total Contributions',
      value: formatNaira(contributionsDailyTotal || 0),
      icon: MdAttachMoney,
    },
    {
      name: 'Branch Total Withdrawal Requests',
      value: formatNaira(dailySavingsWithdrawals || 0),
      icon: MdTrendingDown,
    },
    {
      name: 'Branch Total SB Contributions',
      value: formatNaira(sbDailyTotal || 0),
      icon: MdAccountBalanceWallet,
    },
    {
      name: 'Branch Total DS Contributions',
      value: formatNaira(dsDailyTotal || 0),
      icon: MdDonutLarge,
    },
  ];

  const managerStats = [
    {
      name: 'My Total Contributions',
      value: formatNaira(managerTotal || 0),
      icon: MdAttachMoney,
    },
    {
      name: 'My Total Withdrawal Requests',
      value: formatNaira(managerWithdrawals || 0),
      icon: MdTrendingDown,
    },
    {
      name: 'My Total SB Contributions',
      value: formatNaira(managerSbTotal || 0),
      icon: MdAccountBalanceWallet,
    },
    {
      name: 'My Total DS Contributions',
      value: formatNaira(managerDsTotal || 0),
      icon: MdDonutLarge,
    },
  ];

  return (
    <Box pt={{ base: '10px', md: '40px', xl: '40px' }}>
      <Flex
        justify="space-between"
        alignItems="center"
        mb="20px"
        flexDirection={{ base: 'column', md: 'row' }}
      >
        <Box>
          <Text fontWeight="bold" fontSize="xl" color={textColor}>
            Manager's Dashboard
          </Text>
          <Text fontSize="sm" color={textColorSecondary}>
            Welcome, {currentUser?.firstName}! Here's your daily summary.
          </Text>
        </Box>
        <ActionButton
          to="/admin/accounting/expenditure"
          icon={FaMoneyBillWave}
          label="Expenditure"
        />
      </Flex>

      <Card mb="20px">
        <Text fontWeight="bold" fontSize="lg" color={textColor}>
          Branch Overview
        </Text>
        <Text fontSize="xs" color={textColorSecondary} pb="10px">
          Today's summary for your branch
        </Text>
        <hr />
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          gap="20px"
          mt="20px"
        >
          {branchStats.map((stat, index) => (
            <MiniStatistics
              key={index}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={stat.icon}
                      color={brandColor}
                    />
                  }
                />
              }
              name={stat.name}
              value={stat.value}
            />
          ))}
        </SimpleGrid>
      </Card>

      <Card>
        <Text fontWeight="bold" fontSize="lg" color={textColor}>
          My Performance
        </Text>
        <Text fontSize="xs" color={textColorSecondary} pb="10px">
          Today's summary of your activities
        </Text>
        <hr />
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 4 }}
          gap="20px"
          mt="20px"
        >
          {managerStats.map((stat, index) => (
            <MiniStatistics
              key={index}
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={stat.icon}
                      color={brandColor}
                    />
                  }
                />
              }
              name={stat.name}
              value={stat.value}
            />
          ))}
        </SimpleGrid>
      </Card>

      <Box mt="20px">
        <BranchWithdrawals staffInfo={staffId} />
      </Box>
    </Box>
  );
}

async function fetchData({ queryKey }) {
  // eslint-disable-next-line no-unused-vars
  const [_, staffId] = queryKey;

  try {
    const staffResponse = await axiosService.get(`/staff/user/${staffId}`);
    const staffInfo = staffResponse.data;

    if (!staffInfo.branchId) {
      return {
        contributionsDailyTotal: 0,
        dailySavingsWithdrawals: 0,
        sbDailyTotal: 0,
        dsDailyTotal: 0,
        managerTotal: 0,
        managerWithdrawals: 0,
        managerSbTotal: 0,
        managerDsTotal: 0,
      };
    }

    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const startTimeStamp = startDate.getTime();

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const endTimeStamp = endDate.getTime();

    const [
      contributionResponse,
      dsResponse,
      sbResponse,
      withdrawalResponse,
      managerTotalContributionResponse,
      managerDsResponse,
      managerSbResponse,
      managerWithdrawalResponse,
    ] = await Promise.all([
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${staffInfo.branchId}`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${staffInfo.branchId}&narration=Daily contribution`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${staffInfo.branchId}&narration=SB contribution`
      ),
      axiosService.get(
        `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${staffInfo.branchId}&status=pending`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&narration=Daily contribution`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&narration=SB contribution`
      ),
      axiosService.get(
        `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&status=pending`
      ),
    ]);

    return {
      contributionsDailyTotal: contributionResponse.data,
      dailySavingsWithdrawals: withdrawalResponse.data.totalAmount,
      sbDailyTotal: sbResponse.data,
      dsDailyTotal: dsResponse.data,
      managerTotal: managerTotalContributionResponse.data,
      managerWithdrawals: managerWithdrawalResponse.data.totalAmount,
      managerSbTotal: managerSbResponse.data,
      managerDsTotal: managerDsResponse.data,
    };
  } catch (error) {
    throw new Error('Failed to fetch manager dashboard data');
  }
}
