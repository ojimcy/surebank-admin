// Chakra imports
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Spinner,
  Flex,
  Button,
  Spacer,
  Text,
  FormControl,
  Stack,
  Input,
  Select,
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';

// Custom components

// Assets
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import axiosService from 'utils/axiosService';
import { useAuth } from 'contexts/AuthContext';
import { useAppContext } from 'contexts/AppContext';

export default function SelectedProducts() {
  const { currentUser } = useAuth();
  const { branches } = useAppContext();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });
  const [branch, setBranch] = useState('');
  const [staffInfo, setStaffInfo] = useState({});

  const handleBranchChange = (e) => {
    setBranch(e.target.value);
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        if (currentUser) {
          const getStaff = await axiosService.get(
            `/staff/user/${currentUser.id}`
          );
          setStaffInfo(getStaff.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStaff();
  }, [currentUser]);

  const fetchSelectedProducts = async () => {
    if (staffInfo) {
      let endpoint = `/daily-savings/sb?`;

      if (staffInfo.role === 'manager') {
        endpoint += `branchId=${staffInfo.branchId}`;
      }

      if (branch) {
        endpoint += `branchId=${branch}`;
      }
      try {
        const response = await axiosService.get(endpoint);
        setSelectedProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (staffInfo) {
      fetchSelectedProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination, branch, staffInfo]);
  console.log(selectedProducts);
  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };
  // Columns for the selected products table
  const baseColumns = [
    {
      Header: 'Name',
      accessor: (row) => (
        <>
          <NavLink to={`/admin/products/catalogue-details/${row.product._id}`}>
            {row.product.name}
          </NavLink>
        </>
      ),
    },

    {
      Header: 'User',
      accessor: (row) => (
        <>
          <NavLink to={`/admin/customer/sb/${row.userId._id}`}>
            {row.userId.firstName} {row.userId.lastName}
          </NavLink>
        </>
      ),
    },
    {
      Header: 'Total Contribution',
      accessor: 'totalContribution',
    },
    {
      Header: 'Sales Reps',
      accessor: (row) => (
        <>
          <NavLink to={`/admin/user/${row.accountManager._id}`}>
            {row.accountManager.firstName} {row.accountManager.lastName}
          </NavLink>
        </>
      ),
    },
    {
      Header: 'Branch',
      accessor: (row) => `${row.branchId?.name} `,
    },
  ];

  const columns = React.useMemo(
    () => baseColumns.filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser.role]
  );

  // Filter products based on search term
  useEffect(() => {
    if (!selectedProducts) {
      return;
    }

    const filtered = selectedProducts?.filter((product) => {
      const productName = `${product.product.name} `.toLowerCase();
      return productName.includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [searchTerm, selectedProducts]);

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
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
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justifyContent="space-between"
            mb="20px"
          >
            <Text fontSize="2xl" mb={{ base: '4', md: '0' }}>
              Selected SB Products
            </Text>
            <Spacer />

            <Flex
              direction={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ base: 'flex-start', md: 'center' }}
              width={{ base: '100%', md: 'auto' }}
            >
              <Box mt={{ base: '4', md: '0' }}>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '2', md: '4' }}
                >
                  {currentUser.role === 'superAdmin' ||
                  currentUser.role === 'admin' ? (
                    <Select value={branch} onChange={handleBranchChange}>
                      <option>Select Branch</option>
                      <option value="">All</option>
                      {branches &&
                        branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch?.name}
                          </option>
                        ))}
                    </Select>
                  ) : (
                    ''
                  )}

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
          </Flex>
          <Box marginTop="30">
            {loading ? (
              <Spinner />
            ) : filteredProducts.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            ) : (
              <>
                <CustomTable
                  columns={columns}
                  data={filteredProducts}
                  onPageChange={onPageChange}
                />
              </>
            )}
          </Box>
        </Card>
      </Grid>
    </Box>
  );
}
