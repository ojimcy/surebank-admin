import React, { useEffect, useState, useCallback } from 'react';
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
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function SuperAdminDashboard() {
  const history = useHistory();
  const { currentUser } = useAuth();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
  const [sbDailyTotal, setSbDailyTotal] = useState([]);
  const [dsDailyTotal, setDsDailyTotal] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [openPackageCount, setOpenPackageCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      // Get today's date at 00:00 and convert to timestamp
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      const startTimeStamp = startDate.getTime();
      // Get today's date at 23:59 and convert to timestamp
      const endDate = new Date();
      endDate.setHours(23, 59, 59, 999);
      const endTimeStamp = endDate.getTime();

      // Fetch total contributions and total daily withdrawals
      const [
        totalContributionResponse,
        contributionResponse,
        sbResponse,
        dsResponse,
        withdrawalResponse,
      ] = await Promise.all([
        axiosService.get(`/reports/total-contributions`),
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
          `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}`
        ),
      ]);
      setTotalContributions(totalContributionResponse.data);
      setContributionDailyTotal(contributionResponse.data);
      setSbDailyTotal(sbResponse.data);
      setDsDailyTotal(dsResponse.data);
      setDailySavingsWithdrawals(withdrawalResponse.data.totalAmount);

      // Fetch total open and closed packages
      const [openPackages] = await Promise.all([
        axiosService.get('/reports/packages?status=open'),
      ]);

      setOpenPackageCount(openPackages.data.totalResults);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!currentUser) {
      history.push('/auth/login');
    }
  }, [currentUser, history]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <SimpleGrid
            columns={{ base: 1, md: 3, lg: 3, '2xl': 3 }}
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
                    <Icon
                      w="32px"
                      h="32px"
                      as={MdAttachMoney}
                      color={brandColor}
                    />
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
              // growth="+23%"
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
              // growth="+23%"
              name="Total SB contributions"
              value={formatNaira(sbDailyTotal)}
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
              value={formatNaira(dailySavingsWithdrawals || 0)}
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
              name="Active Packages"
              value={openPackageCount && openPackageCount}
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
        </>
      )}
    </Box>
  );
}
