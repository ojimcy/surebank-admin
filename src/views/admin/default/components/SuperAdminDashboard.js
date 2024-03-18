import React, { useEffect } from 'react';
import {
  Box,
  Icon,
  SimpleGrid,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import { MdAttachMoney, MdPerson } from 'react-icons/md';
import { FaMoneyBillWave, FaChartBar } from 'react-icons/fa';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';
import { useAuth } from 'contexts/AuthContext';

import ActionButton from 'components/Button/CustomButton';
import Withdrawals from './Withdrawals';
import { useHistory } from 'react-router-dom';
import { useQuery } from 'react-query';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function SuperAdminDashboard() {
  const history = useHistory();
  const { currentUser } = useAuth();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  useEffect(() => {
    if (!currentUser) {
      history.push('/auth/login');
    }
  }, [currentUser, history]);

  const { data, isLoading, isError } = useQuery('dashboardData', fetchData, {
    staleTime: 60000, // Refresh data every 60 seconds
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    toast.error('An error occurred while fetching data.');
    return null;
  }

  const {
    totalContributions,
    sbNetBalance,
    dsNetBalance,
    contributionsDailyTotal,
    dailySavingsWithdrawals,
    sbDailyTotal,
    dsDailyTotal,
    openPackageCount,
    openSbPackageCount,
  } = data;

  return (
    <Box>
      <SimpleGrid
        columns={{ base: 1, md: 4, lg: 4, '2xl': 4 }}
        gap="20px"
        mb="20px"
        mt="40px"
      >
        {/* Use the fetched total contributions data */}
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Contributions"
          value={formatNaira(totalContributions)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total SB Contributions"
          value={formatNaira(sbNetBalance)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total DS Contributions"
          value={formatNaira(dsNetBalance)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          // growth="+23%"
          name="Total Daily contributions"
          value={formatNaira(contributionsDailyTotal)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Daily Withdrawal Requests"
          value={formatNaira(dailySavingsWithdrawals || 0)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          // growth="+23%"
          name="DS Daily Total"
          value={formatNaira(dsDailyTotal)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          // growth="+23%"
          name="SB Daily Total"
          value={formatNaira(sbDailyTotal)}
        />

        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPerson} color={brandColor} />}
            />
          }
          name="Ds Packages"
          value={openPackageCount && openPackageCount}
        />
        <MiniStatistics
          startContent={
            <IconBox
              w="56px"
              h="56px"
              bg={boxBg}
              icon={<Icon w="32px" h="32px" as={MdPerson} color={brandColor} />}
            />
          }
          name="Sb Packages"
          value={openSbPackageCount && openSbPackageCount}
        />
      </SimpleGrid>
      <Box>
        <Flex
          justify="space-between"
          alignItems="center"
          mb="20px"
          flexDirection={{ base: 'column', md: 'row' }}
        >
          <ActionButton
            to="/admin/accounting/dashboard"
            icon={FaChartBar}
            label="Report"
          />
          <ActionButton
            to="/admin/accounting/expenditure"
            icon={FaMoneyBillWave}
            label="Expenditure"
          />
        </Flex>
      </Box>
      <Withdrawals />
    </Box>
  );
}

async function fetchData() {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const startTimeStamp = startDate.getTime();
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);
  const endTimeStamp = endDate.getTime();

  const [
    totalSbContributionResponse,
    totalDsContributionResponse,
    contributionResponse,
    sbResponse,
    dsResponse,
    withdrawalResponse,
    dsWithdrawalResponse,
    sbSalesResponse,
    openPackages,
    openSbPackages,
  ] = await Promise.all([
    axiosService.get(`/reports/total-contributions?narration=SB contribution`),
    axiosService.get(
      `/reports/total-contributions?narration=Daily contribution`
    ),
    axiosService.get(
      `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}`
    ),
    axiosService.get(
      `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&narration=SB contribution`
    ),
    axiosService.get(
      `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&narration=Daily contribution`
    ),
    axiosService.get(
      `/transactions/withdraw/cash?status=pending&startDate=${startTimeStamp}&endDate=${endTimeStamp}`
    ),
    axiosService.get(`/transactions/withdraw/cash?status=approved`),
    axiosService.get(`/orders?status=paid`),
    axiosService.get('/reports/packages?status=open'),
    axiosService.get(`/reports/packages/sb?status=open`),
  ]);

  const sbNetBalance =
    totalSbContributionResponse.data - sbSalesResponse.data.totalAmount;
  const dsNetBalance =
    totalDsContributionResponse.data - dsWithdrawalResponse.data.totalAmount;
  const totalContributions = sbNetBalance + dsNetBalance;

  return {
    totalContributions,
    sbNetBalance,
    dsNetBalance,
    contributionsDailyTotal: contributionResponse.data,
    dailySavingsWithdrawals: withdrawalResponse.data.totalAmount,
    sbDailyTotal: sbResponse.data,
    dsDailyTotal: dsResponse.data,
    openPackageCount: openPackages.data.totalResults,
    openSbPackageCount: openSbPackages.data.totalResults,
  };
}
