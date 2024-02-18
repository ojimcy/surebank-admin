import React, { useState, useEffect, useRef } from 'react';
import { Flex, Icon, Text, useColorModeValue, Box } from '@chakra-ui/react';
import { MdAttachMoney, MdPerson } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import { FaMoneyBillWave } from 'react-icons/fa';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import BackButton from 'components/menu/BackButton';
import { useParams } from 'react-router-dom';
import { toSentenceCase } from 'utils/helper';

export default function BranchDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [sbDailyTotal, setSbDailyTotal] = useState([]);
  const [dsDailyTotal, setDsDailyTotal] = useState([]);
  const [totalSbContributions, setTotalSbContributions] = useState(0);
  const [totalDsContributions, setTotalDsContributions] = useState(0);
  const [totalDsWithdrawals, setTotalDsWithdrawals] = useState(0);
  const [totalSbSales, setTotalSbSales] = useState(0);
  const [openPackageCount, setOpenPackageCount] = useState(0);
  const [openSbPackageCount, setOpenSbPackageCount] = useState(0);
  const [branchInfo, setBranchInfo] = useState({});
  const [loading, setLoading] = useState(true);
  // useRef to track the mounted state
  const isMounted = useRef(true);
  const { id } = useParams();

  const sbNetBalance = totalSbContributions - totalSbSales;
  const dsNetBalance = totalDsContributions - totalDsWithdrawals;

  const totalContributions = sbNetBalance + dsNetBalance;

  const fetchData = async () => {
    try {
      setLoading(true);
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
        totalSbContributionResponse,
        totalDsContributionResponse,
        dsWithdrawalResponse,
        sbSalesResponse,
        openPackages,
        openSbPackages,
      ] = await Promise.all([
        axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${id}`
        ),
        axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${id}&narration=Daily contribution`
        ),
        axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${id}&narration=SB contribution`
        ),
        axiosService.get(
          `/transactions/withdraw/cash?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${id}&status=pending`
        ),
        axiosService.get(
          `/reports/total-contributions?narration=SB contribution&branchId=${id}`
        ),
        axiosService.get(
          `/reports/total-contributions?narration=Daily contribution&branchId=${id}`
        ),
        axiosService.get(
          `/transactions/withdraw/cash?status=approved&branchId=${id}`
        ),
        axiosService.get(`/orders?status=paid&branchId=${id}`),
        axiosService.get(`/reports/packages?branchId=${id}&status=open`),
        axiosService.get(`/reports/packages/sb?branchId=${id}&status=open`),
      ]);

      if (isMounted.current) {
        setContributionDailyTotal(contributionResponse.data);
        setDsDailyTotal(dsResponse.data);
        setSbDailyTotal(sbResponse.data);
        setDailySavingsWithdrawals(withdrawalResponse.data.totalAmount);
        setTotalDsContributions(totalDsContributionResponse.data);
        setTotalSbContributions(totalSbContributionResponse.data);
        setTotalDsWithdrawals(dsWithdrawalResponse.data.totalAmount);
        setTotalSbSales(sbSalesResponse.data.totalAmount);
        setOpenPackageCount(openPackages.data.totalResults);
        setOpenSbPackageCount(openSbPackages.data.totalResults);
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const getBranch = async () => {
    const response = await axiosService.get(`/branch/${id}`);
    setBranchInfo(response.data);
  };

  useEffect(() => {
    fetchData();
    getBranch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // Update the dependency here

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '10px', md: '80px', xl: '80px' }}>
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
                  {toSentenceCase(branchInfo?.name)} Dashbaord
                </Text>
                <Text fontSize="sm" color={textColorSecondary} pb="20px">
                  Overview of {toSentenceCase(branchInfo?.name)} activities
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
                    name="Total SB Contributions"
                    value={formatNaira(totalSbContributions)}
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
                    value={formatNaira(totalDsContributions)}
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
                    name="Total Daily Contributions"
                    value={formatNaira(contributionsDailyTotal)}
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
                    name="Total Withdrawal Requests"
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
                    name="SB Daily Total"
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
                    name="DS Daily Total"
                    value={formatNaira(dsDailyTotal || 0)}
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
                    name="DS Packages"
                    value={openPackageCount && openPackageCount}
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
                    name="SB Packages"
                    value={openSbPackageCount && openSbPackageCount}
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
          </>
        </Box>
      )}
    </Box>
  );
}
