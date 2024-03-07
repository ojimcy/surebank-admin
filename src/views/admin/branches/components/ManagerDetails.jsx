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
import BackButton from 'components/menu/BackButton';
import BranchWithdrawals from 'views/admin/default/components/BranchWithdrawals';
import { useQuery } from 'react-query';

export default function ManagerDetails({ staffId }) {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const { data, isLoading, isError } = useQuery(
    ['managerDetailsData', staffId],
    fetchData
  );

  if (isLoading) return <LoadingSpinner />;
  if (isError) {
    // handle error
    return null;
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
  } = data;

  return (
    <Box pt={{ base: '10px', md: '80px', xl: '80px' }}>
      <BackButton />
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
              name="Branch Total Contributions"
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
              name="Branch Total Withdrawal Requests"
              value={formatNaira(dailySavingsWithdrawals || 0)}
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
              name="Branch Total SB Contributions"
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
              name="Branch Total DS Contributions"
              value={formatNaira(dsDailyTotal || 0)}
            />
          </Flex>

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
              name="My Total Contributions"
              value={formatNaira(managerTotal)}
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
              name="My Total Withdrawal Requests"
              value={formatNaira(managerWithdrawals || 0)}
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
              name="My Total SB Contributions"
              value={formatNaira(managerSbTotal)}
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
              name="My Total DS Contributions"
              value={formatNaira(managerDsTotal || 0)}
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

      <BranchWithdrawals staffInfo={staffId} />
    </Box>
  );
}

async function fetchData({ queryKey }) {
  // eslint-disable-next-line no-unused-vars
  const [_, staffId] = queryKey;
  try {
    const staffInfoResponse = await axiosService.get(`/staff/user/${staffId}`);
    const staffInfo = staffInfoResponse.data;

    if (staffInfo.branchId) {
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
        managerDsTotal: managerDsResponse.data,
        managerSbTotal: managerSbResponse.data,
        managerWithdrawals: managerWithdrawalResponse.data.totalAmount,
      };
    } else {
      throw new Error('Branch ID not found');
    }
  } catch (error) {
    console.error(error);
    throw new Error(
      error.response?.data?.message || 'An error occurred while fetching data.'
    );
  }
}
