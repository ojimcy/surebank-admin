// Chakra imports
import {
  Box,
  Grid,
  Button,
  Spinner,
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
import React, { useEffect, useState } from 'react';

import { useAuth } from 'contexts/AuthContext';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import SimpleTable from 'components/table/SimpleTable';
import { NavLink } from 'react-router-dom/';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

export default function Expenditures() {
  const { currentUser } = useAuth();
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenditure, setFilteredExpenditure] = useState([]);
  const [timeRange, setTimeRange] = useState('all');

  const [showExpenditureModal, setShowExpenditureModal] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  useEffect(() => {
    const fetchExpenditures = async () => {
      setLoading(true);
      try {
        // Construct the API endpoint based on filters
        let endpoint = `/expenditure`;

        if (currentUser.role === 'superAdmin') {
          if (timeRange === 'last7days') {
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 7);
            startDate.setHours(0, 0, 0, 0);
            endpoint += `?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
          } else if (timeRange === 'last30days') {
            const endDate = new Date();
            endDate.setHours(23, 59, 59, 999);
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 30);
            startDate.setHours(0, 0, 0, 0);
            endpoint += `?startDate=${startDate.getTime()}&endDate=${endDate.getTime()}`;
          }
        } else if (currentUser.role === 'admin') {
          endpoint = '/expenditure/user-reps';
        }

        const response = await axiosService.get(endpoint);

        // Convert the "date" field to Unix timestamps in the response data
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
      }
    };
    fetchExpenditures();
  }, [currentUser.role, timeRange]);

  // Filter expenditures based on search term
  useEffect(() => {
    const filtered = expenditures?.filter((expenditure) => {
      const fullName =
        `${expenditure.userReps.firstName} ${expenditure.userReps.lastName}`.toLowerCase();
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
      await axiosService.post('/accounting/expenditure', expenditureData);
      toast.success('Expenditure succesfully created');
      handleExpenditureModalClosed();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while creating expenditure.'
      );
    }
  };

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Date',
        accessor: 'date',
      },
      {
        Header: 'Amount',
        accessor: 'amount',
      },
      {
        Header: 'Reason',
        accessor: 'reason',
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
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
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
          </Flex>
          <Flex>
            <Spacer />

            <Button
              bgColor="blue.700"
              color="white"
              borderRadius="5px"
              mr={4}
              onClick={handleOpenExpenditureModal}
            >
              Record Expenditure
            </Button>
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
              <Spinner />
            ) : (
              <SimpleTable columns={columns} data={filteredExpenditure} />
            )}
          </Box>
        </Card>
      </Grid>

      {/* Expenditure modal */}
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
