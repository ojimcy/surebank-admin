import React, { useState, useEffect } from 'react';
import {
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Spacer,
  Box,
} from '@chakra-ui/react';

import { MdAttachMoney, MdPerson } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';

import { FaMoneyBillWave } from 'react-icons/fa';

import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';

import DsWithdrawals from './DsWithdrawals';

export default function UserRepsDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [openPackageCount, setOpenPackageCount] = useState(0);

  useEffect(() => {
    try {
      const fetchTotalContributions = async () => {
        // Get today's date at 00:00 and convert to timestamp
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const startTimeStamp = startDate.getTime();

        // Get today's date at 23:59 and convert to timestamp
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const endTimeStamp = endDate.getTime();

        // API call with date parameters as timestamps
        const contributionResponse = await axiosService.get(
          `/reports/user-reps/total-contributions?startDate=${startTimeStamp}&endDateParam=${endTimeStamp}`
        );

        setContributionDailyTotal(
          contributionResponse.data.contributionsPerDay
        );

        // API call to get total daily withdrawals for today
        const withdrawalResponse = await axiosService.get(
          `/reports/user-reps/total-savings-withdrawal?startDate=${startTimeStamp}&endDateParam=${endTimeStamp}`
        );
        setDailySavingsWithdrawals(withdrawalResponse.data);
      };

      fetchTotalContributions();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, []);

  useEffect(() => {
    try {
      const fetchPackageReport = async () => {
        const response = await axiosService.get('/reports/user-reps/packages');
        setOpenPackageCount(response.data.totalOpenPackages);
      };

      fetchPackageReport();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, []);

  return (
    <>
      <Flex direction={{ base: 'column', md: 'row' }} mb="20px" mt="40px">
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
              // growth="+23%"
              name="Total Daily contributions"
              value={formatNaira(contributionsDailyTotal[0]?.total || 0)}
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
              name="Total Daily Withdrawals"
              value={formatNaira(dailySavingsWithdrawals[0]?.total || 0)}
            />

            <MiniStatistics
              startContent={
                <IconBox
                  w="56px"
                  h="56px"
                  bg={boxBg}
                  icon={
                    <Icon w="32px" h="32px" as={MdPerson} color={brandColor} />
                  }
                />
              }
              name="Active customers"
              value={openPackageCount && openPackageCount}
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

      <Text fontSize="2xl" mt="5rem">
        Transactions
      </Text>
      <Spacer />

      <DsWithdrawals />
    </>
  );
}
