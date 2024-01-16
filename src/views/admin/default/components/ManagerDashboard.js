import React, { useState, useEffect, useRef } from 'react';
import { Flex, Icon, Text, useColorModeValue, Box } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { MdAttachMoney, MdPerson } from 'react-icons/md';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import { FaMoneyBillWave } from 'react-icons/fa';
import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';
import Withdrawals from './Withdrawals';
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
  const [openPackageCount, setOpenPackageCount] = useState(0);
  const [staffInfo, setStaffInfo] = useState({});
  const [loading, setLoading] = useState(true);
  // useRef to track the mounted state
  const isMounted = useRef(true);

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
      if (staffInfo.branchId) {
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const startTimeStamp = startDate.getTime();

        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        const endTimeStamp = endDate.getTime();
        const [contributionResponse, withdrawalResponse, accountResponse] =
          await Promise.all([
            axiosService.get(
              `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${staffInfo.branchId}`
            ),
            axiosService.get(
              `/reports/total-savings-withdrawal?startDate=${startTimeStamp}&endDate=${endTimeStamp}&branchId=${staffInfo.branchId}`
            ),
            axiosService.get(`accounts?branchId=${staffInfo.branchId}`),
          ]);

        if (isMounted.current) {
          setContributionDailyTotal(contributionResponse.data);
          setDailySavingsWithdrawals(withdrawalResponse.data);
          setOpenPackageCount(accountResponse.data.totalResults);
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
        <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
          <>
            <Flex direction={{ base: 'column', md: 'row' }} mb="20px" mt="40px">
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
                    value={formatNaira(dailySavingsWithdrawals[0]?.total || 0)}
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

            <Withdrawals />
          </>
        </Box>
      )}
    </Box>
  );
}
