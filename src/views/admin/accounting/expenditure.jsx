import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Button,
  Flex,
  Spacer,
  Stack,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Select,
  FormLabel,
  Text,
  useColorModeValue,
  FormErrorMessage,
} from '@chakra-ui/react';

import { useAuth } from 'contexts/AuthContext';
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import { NavLink } from 'react-router-dom/';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { formatDate, getStartDate, getEndDate } from 'utils/helper';
import { Link } from 'react-router-dom';

export default function Expenditures() {
  const { currentUser } = useAuth();
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenditure, setFilteredExpenditure] = useState([]);
  const [timeRange, setTimeRange] = useState('all');
  const [staffInfo, setStaffInfo] = useState({});
  const isMounted = useRef(true);
  const [showExpenditureModal, setShowExpenditureModal] = useState(false);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  useEffect(() => {
    isMounted.current = true;

    const fetchStaffAndExpenditures = async () => {
      try {
        const getStaff = await axiosService.get(
          `/staff/user/${currentUser.id}`
        );

        if (isMounted.current) {
          setStaffInfo(getStaff.data);
          await fetchExpenditures(getStaff.data);
        }
      } catch (error) {
        console.error(error);
        // Handle error (e.g., show a toast)
        toast.error('Failed to fetch staff information');
      }
    };

    fetchStaffAndExpenditures();

    return () => {
      // Cleanup function to set the isMounted flag to false when the component unmounts
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchExpenditures = async (staffData) => {
    setLoading(true);

    try {
      const endpoint = constructApiEndpoint(staffData);
      const response = await axiosService.get(endpoint);

      const convertedExpenditures = response.data.results.map(
        (expenditure) => ({
          ...expenditure,
          date: new Date(expenditure.date).getTime(),
        })
      );

      setExpenditures(convertedExpenditures);
      setLoading(false);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show a toast)
      toast.error('Failed to fetch expenditures');
    }
  };

  const constructApiEndpoint = (staffData) => {
    const { pageIndex, pageSize } = pagination;
    let endpoint = `/expenditure`;

    // Default parameters
    const params = {
      limit: pageSize,
      page: pageIndex + 1,
    };

    if (currentUser) {
      // If currentUser is available, add user-specific parameters
      if (currentUser.role === 'userReps') {
        params.createdBy = currentUser.id;
      } else if (currentUser.role === 'manager') {
        params.branchId = staffData.branchId;
      }
    }

    // Add date range parameters based on timeRange
    if (timeRange === 'last7days') {
      Object.assign(params, getStartDate(7));
    } else if (timeRange === 'last30days') {
      Object.assign(params, getEndDate(30));
    }

    // Construct endpoint with parameters
    endpoint += `?${new URLSearchParams(params)}`;

    return endpoint;
  };

  useEffect(() => {
    const filtered = expenditures?.filter((expenditure) => {
      const fullName =
        `${expenditure.createdBy.firstName} ${expenditure.createdBy.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm.toLowerCase()) ||
        expenditure.reason.includes(searchTerm)
      );
    });
    setFilteredExpenditure(filtered);
  }, [searchTerm, expenditures]);

  const handleOpenExpenditureModal = () => {
    setShowExpenditureModal(true);
  };

  const handleExpenditureModalClosed = () => {
    setShowExpenditureModal(false);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
  };

  const handleCreateExpenditure = async (expenditureData) => {
    try {
      await axiosService.post('/expenditure', expenditureData);
      toast.success('Expenditure successfully created');
      handleExpenditureModalClosed();
      await fetchExpenditures(staffInfo);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while creating expenditure.');
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Reason',
        accessor: 'reason',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Date',
        accessor: (row) => formatDate(row.date),
      },
      {
        Header: 'Details',
        accessor: (row) => (
          <NavLink to={`/admin/accounting/expenditure/${row.id}`}>
            View Details
          </NavLink>
        ),
      },
    ],
    []
  );

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <Flex justifyContent="space-between" mb="20px">
            <BackButton />
            <div>
              <Button
                bgColor="blue.700"
                color="white"
                borderRadius="5px"
                mr={4}
                onClick={handleOpenExpenditureModal}
              >
                Record Expenditure
              </Button>

              {currentUser.role === 'superAdmin' ||
              currentUser.role === 'admin' ||
              currentUser.role === 'manager' ? (
                <Button
                  bgColor="blue.700"
                  color="white"
                  borderRadius="5px"
                  mr={4}
                  as={Link}
                  to="/admin/accounting/note"
                >
                  Note Keeping
                </Button>
              ) : (
                ''
              )}
            </div>
          </Flex>
          <Box marginTop="30">
            <Flex>
              <Spacer />
              <Box>
                <Stack direction="row">
                  <Select value={timeRange} onChange={handleTimeRangeChange}>
                    <option value="all">All Time</option>
                    <option value="last7days">Last 7 Days</option>
                    <option value="last30days">Last 30 Days</option>
                  </Select>
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
          <Box marginTop="30">
            {loading ? (
              <LoadingSpinner />
            ) : filteredExpenditure.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            ) : (
              <CustomTable
                columns={columns}
                data={filteredExpenditure}
                onPageChange={setPagination}
              />
            )}
          </Box>
        </Card>
      </Grid>
      <Modal
        isOpen={showExpenditureModal}
        onClose={handleExpenditureModalClosed}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Expenditure</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Enter expenditure</ModalBody>
          <ModalBody>
            <form onSubmit={handleSubmit(handleCreateExpenditure)}>
              <FormControl isInvalid={errors.accountNumber}>
                <FormLabel
                  htmlFor="amount"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Amount<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: '0px', md: '0px' }}
                  type="text"
                  id="amount"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register('amount', {
                    required: 'Amount is required',
                  })}
                />
              </FormControl>
              <FormControl isInvalid={errors.reason}>
                <FormLabel
                  htmlFor="reason"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Reason<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: '0px', md: '0px' }}
                  type="text"
                  id="reason"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  {...register('reason', {
                    required: 'Reason is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.reason && errors.reason.message}
                </FormErrorMessage>
              </FormControl>

              <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
                <Button
                  colorScheme="green"
                  variant="solid"
                  w="100%"
                  h="50"
                  mb="24px"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
              </Box>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
