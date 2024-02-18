import React, { useState, useEffect } from 'react';
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

export default function AdminDetails() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [loading, setLoading] = useState(false);
  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
  const [sbDailyTotal, setSbDailyTotal] = useState([]);
  const [dsDailyTotal, setDsDailyTotal] = useState([]);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);

  useEffect(() => {
    try {
      setLoading(true);
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
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}`
        );
        setContributionDailyTotal(contributionResponse.data);

        const dsResponse = await axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&narration=Daily contribution`
        );
        setDsDailyTotal(dsResponse.data);

        const sbResponse = await axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&narration=SB contribution`
        );
        setSbDailyTotal(sbResponse.data);

        // API call to get total daily withdrawals for today
        const withdrawalResponse = await axiosService.get(
          `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}&status=pending`
        );
        setDailySavingsWithdrawals(withdrawalResponse.data.totalAmount);
      };

      fetchTotalContributions();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '40px', md: '80px', xl: '80px' }}>
          <>
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
          </>
        </Box>
      )}
    </Box>
  );
}