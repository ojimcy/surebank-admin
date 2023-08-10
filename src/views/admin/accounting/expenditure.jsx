// Chakra imports
import {
  Box,
  Grid,
  Button,
  Spinner,
  Flex,
  Text,
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
  ModalFooter,
  Select,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import SimpleTable from 'components/table/SimpleTable';
import { NavLink } from 'react-router-dom/';

export default function Expenditures() {
  const [expenditures, setExpenditures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredExpenditure, setFilteredExpenditure] = useState([]);
  const [timeRange, setTimeRange] = useState('all');

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchExpenditures = async () => {
      setLoading(true);
      try {
        // Construct the API endpoint based on filters
        let endpoint = `/accounting/expenditure`;

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
  }, [timeRange]);

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

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
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
            <Text fontSize="2xl">Expenditures</Text>
            <Spacer />
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

      {/* Delete confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={handleDeleteCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this customer?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3}>
              Delete
            </Button>
            <Button variant="ghost" onClick={handleDeleteCancel}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
