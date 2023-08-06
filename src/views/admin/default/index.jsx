import { useState, useEffect } from 'react';
import { Box, Icon, SimpleGrid, useColorModeValue } from '@chakra-ui/react';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import React from 'react';
import { MdAttachMoney, MdPerson } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';

export default function UserReports() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');

  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [packageCount, setPackageCount] = useState(0);
  const [openPackages, setOpenPackages] = useState(0);
  const [closedPackages, setClosedPackages] = useState(0);

  useEffect(() => {
    // Fetch total contributions data from the backend API
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
        const response = await axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}`
        );

        setContributionDailyTotal(response.data.contributionsPerDay);
        setTotalContributions(response.data.sumTotal);
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
        const response = await axiosService.get(
          '/reports/total-savings-withdrawal'
        );
        console.log(response.data)
        setDailySavingsWithdrawals(response.data);
      };

      fetchPackageReport();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, []);

  useEffect(() => {
    try {
      const fetchPackageReport = async () => {
        const response = await axiosService.get('/reports/packages');
        setPackageCount(response.data.totalPackages);
        setOpenPackages(response.data.totalOpenPackages);
        setClosedPackages(response.data.totalClosedPackages);
      };

      fetchPackageReport();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, []);

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
                <Icon w="32px" h="32px" as={MdAttachMoney} color={brandColor} />
              }
            />
          }
          name="Total Contributions"
          value={`${formatNaira(totalContributions && totalContributions)}`}
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
          growth="+23%"
          name="Total Daily contributions"
          value={`${
            contributionsDailyTotal?.length > 0
              ? formatNaira(contributionsDailyTotal[0]?.total)
              : formatNaira(0)
          }`}
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
          name="Total Daily DS Withdrawals"
          value={`${formatNaira(
            dailySavingsWithdrawals &&
              formatNaira(dailySavingsWithdrawals[0]?.total)
          )}`}
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
          name="Active Packages"
          value={packageCount && packageCount}
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
          name="Active Packages"
          value={openPackages && openPackages}
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
          name="Active Packages"
          value={closedPackages && closedPackages}
        />
      </SimpleGrid>
    </Box>
  );
}
