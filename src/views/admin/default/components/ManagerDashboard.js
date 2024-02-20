import React, { useState, useEffect, useRef } from 'react';
import { Flex, Icon, Text, useColorModeValue, Box } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { MdAttachMoney } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import { FaMoneyBillWave } from 'react-icons/fa';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import BranchWithdrawals from './BranchWithdrawals';
import { useAuth } from 'contexts/AuthContext';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function ManagerDashboard() {
  const { currentUser } = useAuth();
  const history = useHistory();
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [sbDailyTotal, setSbDailyTotal] = useState([]);
  const [dsDailyTotal, setDsDailyTotal] = useState([]);
  const [managerTotal, setManagerTotal] = useState([]);
  const [managerWithdrawals, setManagerWithdrawals] = useState([]);
  const [managerSbTotal, setManagerSbTotal] = useState([]);
  const [managerDsTotal, setManagerDsTotal] = useState([]);
  const [staffInfo, setStaffInfo] = useState({});
  const [loading, setLoading] = useState(true);
  // useRef to track the mounted state
  const isMounted = useRef(true);
  const staffId = currentUser.id;

  useEffect(() => {
    if (!currentUser) {
      history.push('/auth/login');
    }
  }, [currentUser, history]);

  useEffect(() => {
    isMounted.current = true;

    const fetchStaff = async () => {
      try {
        const getStaff = await axiosService.get(
          `/staff/user/${currentUser.id}`
        );
        if (isMounted.current) {
          setStaffInfo(getStaff.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStaff();

    return () => {
      // Cleanup function to set the isMounted flag to false when the component unmounts
      isMounted.current = false;
    };
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
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

        if (isMounted.current) {
          setContributionDailyTotal(contributionResponse.data);
          setDsDailyTotal(dsResponse.data);
          setSbDailyTotal(sbResponse.data);
          setDailySavingsWithdrawals(withdrawalResponse.data.totalAmount);
          setManagerTotal(managerTotalContributionResponse.data);
          setManagerDsTotal(managerDsResponse.data);
          setManagerSbTotal(managerSbResponse.data);
          setManagerWithdrawals(managerWithdrawalResponse.data.totalAmount);
          setLoading(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [staffInfo.branchId]); // Update the dependency here

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '10px', md: '80px', xl: '80px' }}>
          <>
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
          </>
        </Box>
      )}
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

      <BranchWithdrawals staffInfo={staffInfo} />
    </Box>
  );
}
