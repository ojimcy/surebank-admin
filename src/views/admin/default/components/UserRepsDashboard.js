import React, { useState, useEffect } from 'react';
import {
  Flex,
  Icon,
  Text,
  useColorModeValue,
  Spacer,
  Box,
  Stack,
  FormControl,
  Input,
  Button,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
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
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function UserRepsDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [loading, setLoading] = useState(true);
  const [contributionsDailyTotal, setContributionsDailyTotal] = useState([]);
  const [dailySavingsWithdrawals, setDailySavingsWithdrawals] = useState([]);
  const [openPackageCount, setOpenPackageCount] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const { currentUser } = useAuth();
  const staffId = currentUser.id;

  useEffect(() => {
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
          withdrawalResponse,
          accountsResponse,
        ] = await Promise.all([
          axiosService.get(
            `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}`
          ),
          axiosService.get(
            `/reports/total-savings-withdrawal?startDate=${startTimeStamp}&endDate=${endTimeStamp}`
          ),
          axiosService.get(
            `accounts?limit=${pagination.pageSize}&page=${
              pagination.pageIndex + 1
            }&accountManagerId=${staffId}`
          ),
        ]);
        setContributionsDailyTotal(totalContributionsResponse.data);
        setDailySavingsWithdrawals(withdrawalResponse.data);
        setCustomers(accountsResponse.data.results);
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
  }, [staffId, pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  useEffect(() => {
    const filtered = customers?.filter((customer) => {
      const fullName =
        `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        customer.accountNumber.includes(searchTerm)
      );
    });
    setFilteredCustomers(filtered);
  }, [searchTerm, customers]);
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: (row) => (
          <NavLink to={`/admin/customer/${row.userId}`}>
            {row.firstName} {row.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Account Type',
        accessor: 'accountType',
      },
      {
        Header: 'Account Number',
        accessor: 'accountNumber',
      },
      {
        Header: 'Phone Number',
        accessor: 'phoneNumber',
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <Box>
            <NavLink to={`/admin/customer/${row.userId}`}>Details</NavLink>
          </Box>
        ),
      },
    ],
    []
  );

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
                  name="Total Daily Withdrawals"
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
            My Customers
          </Text>
          <Spacer />

          <Box marginTop="30">
            <Flex>
              <Spacer />
              <Box>
                <Stack direction="row">
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search"
                      borderColor="black"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </FormControl>
                  <Button bgColor="blue.700" color="white">
                    <SearchIcon />
                  </Button>
                </Stack>
              </Box>
            </Flex>
          </Box>

          {filteredCustomers.length === 0 ? (
            <Text fontSize="lg" textAlign="center" mt="20">
              No customer found.
            </Text>
          ) : (
            <CustomTable
              columns={columns}
              data={filteredCustomers}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </Box>
  );
}
