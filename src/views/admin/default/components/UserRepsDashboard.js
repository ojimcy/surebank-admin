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
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { formatNaira } from 'utils/helper';
import Card from 'components/card/Card';
import { NavLink } from 'react-router-dom';

import { FaMoneyBillWave } from 'react-icons/fa';

import MiniStatistics from 'components/card/MiniStatistics';
import IconBox from 'components/icons/IconBox';
import ActionButton from 'components/Button/CustomButton';

import { useAuth } from 'contexts/AuthContext';
import CustomTable from 'components/table/CustomTable';

export default function UserRepsDashboard() {
  const brandColor = useColorModeValue('brand.500', 'white');
  const boxBg = useColorModeValue('secondaryGray.300', 'whiteAlpha.100');
  const textColor = useColorModeValue('secondaryGray.900', 'white');
  const textColorSecondary = 'secondaryGray.600';

  const [contributionsDailyTotal, setContributionDailyTotal] = useState([]);
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
        const contributionResponse = await axiosService.get(
          `/reports/total-contributions?startDate=${startTimeStamp}&endDate=${endTimeStamp}&createdBy=${staffId}`
        );
        setContributionDailyTotal(contributionResponse.data);

        // API call to get total daily withdrawals for today
        const withdrawalResponse = await axiosService.get(
          `/reports/total-savings-withdrawal?startDate=${startTimeStamp}&endDateParam=${endTimeStamp}`
        );
        setDailySavingsWithdrawals(withdrawalResponse.data);
      };

      fetchTotalContributions();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  }, [staffId]);

  const fetchData = async () => {
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `accounts?limit=${pageSize}&page=${
          pageIndex + 1
        }&accountManagerId=${staffId}`
      );
      setCustomers(response.data.results);
      setOpenPackageCount(response.data.totalResults);
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch customers
  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, pagination, staffId]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  // Filter customers based on search term
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
              name="Total Daily Withdrawals"
              value={formatNaira(dailySavingsWithdrawals)}
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

      <CustomTable
        columns={columns}
        data={filteredCustomers}
        onPageChange={onPageChange}
      />
    </>
  );
}
