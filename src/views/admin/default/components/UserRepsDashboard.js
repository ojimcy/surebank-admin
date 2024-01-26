import React, { useState, useEffect } from 'react';
import { Flex, Icon, Text, useColorModeValue, Box } from '@chakra-ui/react';
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
import RecentTransactions from 'components/transactions/RecentTransactions';

export default function UserRepsDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [loading, setLoading] = useState(true);
  const [contributionsDailyTotal, setContributionsDailyTotal] = useState([]);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [sbDailyTotal, setSbDailyTotal] = useState([]);
  const [dsDailyTotal, setDsDailyTotal] = useState([]);
  const [openPackageCount, setOpenPackageCount] = useState(0);

  const { currentUser } = useAuth();
  const staffId = currentUser.id;

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
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
          accountsResponse,
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
          axiosService.get(`accounts?accountManagerId=${staffId}`),
        ]);
        setContributionsDailyTotal(totalContributionsResponse.data);
        setDsDailyTotal(dsResponse.data);
        setSbDailyTotal(sbResponse.data);
        setDailySavingsWithdrawals(withdrawalResponse.data.totalAmount);
        setOpenPackageCount(accountsResponse.data.totalResults);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while fetching data.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [staffId]);

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
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
                          as={MdPerson}
                          color={brandColor}
                        />
                      }
                    />
                  }
                  name="Active customers"
                  value={openPackageCount && openPackageCount}
                />
              </Flex>
              
              <Flex
                direction={{ base: 'column', md: 'row' }}
                justifyContent="space-between"
                mt="40px"
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

          <RecentTransactions />
        </>
      )}
    </Box>
  );
}
