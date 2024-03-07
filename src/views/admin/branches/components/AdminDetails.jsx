import React from 'react';
import { Flex, Icon, Text, useColorModeValue, Box } from '@chakra-ui/react';
import { MdAttachMoney } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import { FaMoneyBillWave } from 'react-icons/fa';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import Withdrawals from 'views/admin/default/components/Withdrawals';
import BackButton from 'components/menu/BackButton';
import { useQuery } from 'react-query';

export default function AdminDetails() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const { data, isLoading, isError } = useQuery('adminDetailsData', fetchData);

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    // handle error
    return null;
  }

  const {
    contributionsDailyTotal,
    sbDailyTotal,
    dsDailyTotal,
    dailySavingsWithdrawals,
  } = data;

  return (
    <Box pt={{ base: '40px', md: '80px', xl: '80px' }}>
      <BackButton />
      <Flex direction={{ base: 'column', md: 'row' }} mb="20px">
        <Card>
          <Text
            fontWeight="bold"
            fontSize="xl"
            mt="10px"
            color={textColor}
          >
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
  try {
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
    ] = await Promise.all([
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
  } catch (error) {
    console.error(error);
    throw new Error(
      error.response?.data?.message || 'An error occurred while fetching data.'
    );
  }
}
