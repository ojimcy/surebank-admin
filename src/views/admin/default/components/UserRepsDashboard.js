import React from 'react';
import {
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Box,
  Grid,
} from '@chakra-ui/react';
import { MdAttachMoney, MdPerson } from 'react-icons/md';
import { FaMoneyBillWave } from 'react-icons/fa';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import { useAuth } from 'contexts/AuthContext';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import Withdrawals from './Withdrawals';
import { useQuery } from 'react-query';

export default function UserRepsDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const { currentUser } = useAuth();
  const staffId = currentUser.id;
  const { data, isLoading, isError } = useQuery(
    ['userRepsDashboardData', staffId],
    fetchData
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    toast.error('An error occurred while fetching data.');
    return null;
  }

  const {
    contributionsDailyTotal,
    dsDailyTotal,
    sbDailyTotal,
    dailySavingsWithdrawals,
    dailyDsCustomers,
    dailySbCustomers,
    openPackageCount,
    openSbPackageCount,
  } = data;

  const totalOpenPackages = dailyDsCustomers + dailySbCustomers;
  const totalPackages = openPackageCount + openSbPackageCount;

  return (
    <Box>
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        gap={6}
        mb="20px"
        mt="40px"
      >
        {/* Left Card */}
        <Card>
          <Text fontWeight="bold" fontSize="xl" mt="10px" color={textColor}>
            Overview
          </Text>
          <Text fontSize="sm" color={textColorSecondary} pb="20px">
            Overview of your activities
          </Text>
          <hr color={textColor} />
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={6}
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
              name="Total DS Contributions"
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
              value={formatNaira(sbDailyTotal || 0)}
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
          </Grid>
        </Card>

        {/* Right Card */}
        <Card>
          <Text fontWeight="bold" fontSize="xl" mt="10px">
            Package Reports
          </Text>
          <Text fontSize="sm" color="gray.500" pb="20px">
            Details of package reports
          </Text>
          <hr />
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
            gap={6}
            mt="20px"
          >
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
              name="Total Customers"
              value={totalPackages && totalPackages}
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
              name="Total Contributed"
              value={totalOpenPackages || 0}
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
              name="Ds Customers"
              value={openPackageCount && openPackageCount}
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
              name="SB Contributed"
              value={dailySbCustomers || 0}
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
              name="Sb Packages"
              value={openSbPackageCount && openSbPackageCount}
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
              name="DS Customers"
              value={dailyDsCustomers || 0}
            />
          </Grid>
        </Card>
      </Grid>

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

async function fetchData({ queryKey }) {
  // eslint-disable-next-line no-unused-vars
  const [_, staffId] = queryKey;
  try {
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const startTimeStamp = startDate.getTime();

    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    const endTimeStamp = endDate.getTime();

    const [
      totalContributionsResponse,
      dsResponse,
      sbResponse,
      withdrawalResponse,
      openDailyDsPackages,
      opendailySbCustomers,
      openPackagesResponse,
      openSbPackagesResponse,
    ] = await Promise.all([
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
        `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}`
      ),
      axiosService.get(
        `/reports/packages/contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&narration=Daily contribution`
      ),
      axiosService.get(
        `/reports/packages/contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&narration=SB contribution`
      ),
      axiosService.get(`/reports/packages?status=open&createdBy=${staffId}`),
      axiosService.get(`/reports/packages/sb?status=open&createdBy=${staffId}`),
    ]);

    return {
      contributionsDailyTotal: totalContributionsResponse.data,
      dsDailyTotal: dsResponse.data,
      sbDailyTotal: sbResponse.data,
      dailySavingsWithdrawals: withdrawalResponse.data.totalAmount,
      dailyDsCustomers: openDailyDsPackages.data.length,
      dailySbCustomers: opendailySbCustomers.data.length,
      openPackageCount: openPackagesResponse.data.totalResults,
      openSbPackageCount: openSbPackagesResponse.data.totalResults,
    };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || 'Failed to fetch user dashboard data'
    );
  }
}
