// Chakra imports
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Flex,
  Button,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Select,
} from '@chakra-ui/react';

import { ChevronDownIcon } from '@chakra-ui/icons';

import { NavLink } from 'react-router-dom';
import { formatMdbDate } from 'utils/helper';
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import axiosService from 'utils/axiosService';
import MerchantDetailsModal from 'components/modals/MerchantDetailsModal';
import CreateMerchantModal from 'components/modals/CreateMerchantRequest';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

export default function Merchants() {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [merchantDetailsModal, setMerchantDetailsModal] = useState(false);
  const [createMerchantModal, setCreateMerchantModal] = useState(false);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

  const fetchMerchants = async () => {
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/merchants/requests/?limit=${pageSize}&page=${pageIndex + 1}`
      );
      setMerchants(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching merchants:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const handleShowDetailsModal = (merchant) => {
    setSelectedMerchant(merchant);
    setMerchantDetailsModal(true);
  };

  const closeModalAndResetMerchant = () => {
    setSelectedMerchant(null);
    setMerchantDetailsModal(false);
    fetchMerchants();
  };

  
  const handleShowMerchantModal = () => {
    setCreateMerchantModal(true);
  };

  const handleCloseMerchantModal = () => {
    setCreateMerchantModal(false);
    fetchMerchants();
  };

  // Function to filter merchants based on the selected status
  const filterMerchantsByStatus = (merchants, status) => {
    if (status === 'All') {
      return merchants;
    }
    return merchants.filter(
      (merchant) => merchant.status.toLowerCase() === status.toLowerCase()
    );
  };
  const filteredMerchants = filterMerchantsByStatus(merchants, selectedStatus);

  // Columns for the merchant table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Store Name',
        accessor: 'storeName',
      },
      {
        Header: 'Phone Number',
        accessor: 'storePhoneNumber',
      },
      {
        Header: 'Address',
        accessor: 'storeAddress',
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Created At',
        accessor: (row) => formatMdbDate(row.createdAt),
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <>
            <Button
              onClick={() => handleShowDetailsModal(row)}
              style={{ marginRight: '10px' }}
            >
              View Details
            </Button>
          </>
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
          <BackButton />
          <Flex justifyContent="space-between" mb="20px">
            <Text fontSize="2xl">Merchant Requests</Text>
            <Spacer />
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Manage Store
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NavLink to="#" onClick={handleShowMerchantModal}>New Merchant</NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/admin/stores/collections">
                    Collections
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/admin/stores/categories">
                    Categories
                  </NavLink>
                </MenuItem>
              </MenuList>
            </Menu>
          </Flex>
          <Box marginTop="30">
            {/* Select for selecting status */}
            <Box marginTop="20px" w="150px" justifyContent="spacce-between">
              <Spacer />
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
            </Box>
            {loading ? (
              <LoadingSpinner />
            ) : filteredMerchants && filteredMerchants.length !== 0 ? (
              <CustomTable
                columns={columns}
                data={filteredMerchants}
                onPageChange={onPageChange}
              />
            ) : (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            )}
          </Box>
        </Card>
      </Grid>

      
      <CreateMerchantModal
        isOpen={createMerchantModal}
        onClose={handleCloseMerchantModal}
      />

      {selectedMerchant && (
        <MerchantDetailsModal
          isOpen={merchantDetailsModal}
          onClose={closeModalAndResetMerchant}
          merchant={selectedMerchant}
        />
      )}
    </Box>
  );
}
