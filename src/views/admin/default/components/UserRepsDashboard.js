import React, { useState, useEffect } from 'react';
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
  const [dailyDsCustomers, setDailyDsCustomers] = useState([]);
  const [dailySbCustomers, setDailySbCustomers] = useState([]);
  const [openPackageCount, setOpenPackageCount] = useState(0);
  const [openSbPackageCount, setOpenSbPackageCount] = useState(0);

  const { currentUser } = useAuth();
  const staffId = currentUser.id;

  const totalOpenPackages = dailyDsCustomers + dailySbCustomers;
  const totalPackages = openPackageCount + openSbPackageCount;

  useEffect(() => {
    setLoading(true);
    let isMounted = true;
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
          // axiosService.get(`accounts?accountManagerId=${staffId}`),

          axiosService.get(
            `/reports/packages/contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&narration=Daily contribution`
          ),
          axiosService.get(
            `/reports/packages/contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}&narration=SB contribution`
          ),
          axiosService.get(
            `/reports/packages?status=open&createdBy=${staffId}`
          ),
          axiosService.get(
            `/reports/packages/sb?status=open&createdBy=${staffId}`
          ),
        ]);

        setContributionsDailyTotal(totalContributionsResponse.data);
        setDsDailyTotal(dsResponse.data);
        setSbDailyTotal(sbResponse.data);
        setDailySavingsWithdrawals(withdrawalResponse.data.totalAmount);
        setDailyDsCustomers(openDailyDsPackages.data.length);
        setDailySbCustomers(opendailySbCustomers.data.length);
        setOpenPackageCount(openPackagesResponse.data.totalResults);
        setOpenSbPackageCount(openSbPackagesResponse.data.totalResults);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
            'An error occurred while fetching data.'
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [staffId]);

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr' }}
          gap={6}
          mb="20px"
          mt="40px"
        >
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
                      <Icon
                        w="32px"
                        h="32px"
                        as={MdPerson}
                        color={brandColor}
                      />
                    }
                  />
                }
                name="Total Packages"
                value={totalPackages && totalPackages}
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
                      <Icon
                        w="32px"
                        h="32px"
                        as={MdPerson}
                        color={brandColor}
                      />
                    }
                  />
                }
                name="Ds Packages"
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
                      <Icon
                        w="32px"
                        h="32px"
                        as={MdPerson}
                        color={brandColor}
                      />
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
                      <Icon
                        w="32px"
                        h="32px"
                        as={MdPerson}
                        color={brandColor}
                      />
                    }
                  />
                }
                name="DS Contributed"
                value={dailyDsCustomers || 0}
              />
            </Grid>
          </Card>
        </Grid>
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

      <Withdrawals />
    </Box>
  );
}
