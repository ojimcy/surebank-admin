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
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  FormControl,
  Stack,
  Input,
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';

// Custom components
import { formatMdbDate } from 'utils/helper';

// Assets
import Card from 'components/card/Card.js';
import { SearchIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import axiosService from 'utils/axiosService';
import CatalogueDetailsModal from 'components/modals/CatalogueDetailsModal';
import { useAuth } from 'contexts/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';

export default function Catalogue() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000000,
  });

  const fetchProducts = async () => {
    const { pageIndex } = pagination;
    try {
      const response = await axiosService.get(
        `/products/catalogue?&page=${pageIndex + 1}`
      );
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  const closeModalAndResetProduct = () => {
    setSelectedProduct(null);
    setProductDetailsModal(false);
  };

  const costPriceColumn = {
    Header: 'Cost Price',
    accessor: 'costPrice',
  };

  // Columns for the catalogue table
  const baseColumns = [
    {
      Header: 'Name',
      accessor: (row) => (
        <>
          <NavLink to={`/admin/products/catalogue-details/${row.id}`}>
            {row.name}
          </NavLink>
        </>
      ),
    },
    // Include "Cost Price" column before "Selling Price"
    currentUser.role === 'admin' || currentUser.role === 'superAdmin'
      ? costPriceColumn
      : null,
    {
      Header: 'Selling Price',
      accessor: 'sellingPrice',
    },
    {
      Header: 'Discount Price',
      accessor: 'discount',
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
    },

    {
      Header: 'Created At',
      accessor: (row) => formatMdbDate(row.createdAt),
    },
    {
      Header: 'Action',
      accessor: (row) => (
        <>
          <NavLink to={`/admin/products/catalogue-details/${row.id}`}>
            <Button className="view-details-btn">View Details</Button>
          </NavLink>
        </>
      ),
    },
  ];

  const columns = React.useMemo(
    () => baseColumns.filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser.role]
  );

  // Filter products based on search term
  useEffect(() => {
    if (!products) {
      return;
    }

    const filtered = products?.filter((product) => {
      const productName = `${product.name} `.toLowerCase();
      return productName.includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

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
              Products
            </Text>
            <Spacer />

            <Flex
              direction={{ base: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ base: 'flex-start', md: 'center' }}
              width={{ base: '100%', md: 'auto' }}
            >
              {currentUser.role === 'superAdmin' ||
              currentUser.role === 'admin' ? (
                <Menu>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    Manage Products
                  </MenuButton>
                  <MenuList>
                    <MenuItem>
                      <NavLink to="/admin/products/catalogue/create">
                        Add Product
                      </NavLink>
                    </MenuItem>
                    <MenuItem>
                      <NavLink to="/admin/products/requests">
                        Product Requests
                      </NavLink>
                    </MenuItem>
                  </MenuList>
                </Menu>
              ) : (
                ''
              )}

              <Box mt={{ base: '4', md: '0' }}>
                <Stack
                  direction={{ base: 'column', md: 'row' }}
                  spacing={{ base: '2', md: '4' }}
                >
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

      {selectedProduct && (
        <CatalogueDetailsModal
          isOpen={productDetailsModal}
          onClose={closeModalAndResetProduct}
          product={selectedProduct}
        />
      )}
    </Box>
  );
}
