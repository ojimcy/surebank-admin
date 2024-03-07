import React, { useEffect } from 'react';
import { Flex, Icon, Text, useColorModeValue, Box } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { MdAttachMoney } from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useQuery } from 'react-query';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import Withdrawals from './Withdrawals';
import { useAuth } from 'contexts/AuthContext';

export default function UserRepsDashboard() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

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
    console.error('An error occurred while fetching data.');
    return null;
  }

  const {
    contributionsDailyTotal,
    dailySavingsWithdrawals,
    sbDailyTotal,
    dsDailyTotal,
  } = data;

  return (
    <Box pt={{ base: '40px', md: '80px', xl: '80px' }}>
      <Flex direction={{ base: 'column', md: 'row' }} mb="20px">
        <Card>
          <Text fontWeight="bold" fontSize="xl" mt="10px" color={textColor}>
            Overview
          </Text>
          <Text fontSize="sm" color={textColorSecondary} pb="20px">
            Overview of your activities
          </Text>
          <hr color={textColor} />
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            mt="20px"
          >
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdAttachMoney}
                      color={brandColor}
                    />
                  }
                />
              }
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
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdAttachMoney}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Total Daily Withdrawal Requests"
              value={formatNaira(dailySavingsWithdrawals)}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdAttachMoney}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Total DS contributions"
              value={formatNaira(dsDailyTotal)}
            />
            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdAttachMoney}
                      color={brandColor}
                    />
                  }
                />
              }
              name="Total SB Contributions"
              value={formatNaira(sbDailyTotal)}
            />
          </Flex>
        </Card>
      </Flex>

      <Box>
        <Flex
          justify="end"
          alignItems="center"
          mb="20px"
          flexDirection={{ base: 'column', md: 'row' }}
        >
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

  const [contributionResponse, dsResponse, sbResponse, withdrawalResponse] =
    await Promise.all([
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&narration=Daily contribution`
      ),
      axiosService.get(
        `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&narration=SB contribution`
      ),
      axiosService.get(
        `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}&status=pending`
      ),
    ]);

  return {
    contributionsDailyTotal: contributionResponse.data,
    dsDailyTotal: dsResponse.data,
    sbDailyTotal: sbResponse.data,
    dailySavingsWithdrawals: withdrawalResponse.data.totalAmount,
  };
}
