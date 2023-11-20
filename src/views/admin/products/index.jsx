// Chakra imports
import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Spinner,
  Flex,
  Button,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Select,
  IconButton,
} from '@chakra-ui/react';

import { ChevronDownIcon, EditIcon } from '@chakra-ui/icons';

import { NavLink } from 'react-router-dom';
import { formatDate } from 'utils/helper';
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import SimpleTable from 'components/table/SimpleTable';
import axiosService from 'utils/axiosService';
import CreateProductModal from 'components/modals/CreateProductModal';
import ProductDetailsModal from 'components/modals/ProductDetailsModal';
import EditProductModal from 'components/modals/EditProductModal';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(1);
  const [createProductModal, setCreateProductModal] = useState(false);
  const [editProductModal, setEditProductModal] = useState(false);
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');

  const pageLimit = 10;
  const statusOptions = ['All', 'Pending', 'Approved', 'Rejected'];

  const fetchProductRequests = async () => {
    try {
      const response = await axiosService.get('/products/request');
      setProducts(response.data.results);
      setTotalResults(response.data.totalResults);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductRequests();
  }, []);

  const handleShowProductModal = () => {
    setCreateProductModal(true);
  };

  const handleCloseProductModal = () => {
    setCreateProductModal(false);
    fetchProductRequests();
  };

  const handleShowEditModal = (product) => {
    setSelectedProduct(product);
    setEditProductModal(true);
  };

  const handleCloseEditModal = () => {
    setSelectedProduct(null);
    setEditProductModal(false);
    fetchProductRequests();
  };

  const handleShowDetailsModal = (product) => {
    setSelectedProduct(product);
    setProductDetailsModal(true);
  };

  const closeModalAndResetProduct = () => {
    setSelectedProduct(null);
    setProductDetailsModal(false);
    fetchProductRequests();
  };

  // Function to filter products based on the selected status
  const filterProductsByStatus = (products, status) => {
    if (status === 'All') {
      return products;
    }
    return products.filter(
      (product) => product.status.toLowerCase() === status.toLowerCase()
    );
  };
  const filteredProducts = filterProductsByStatus(products, selectedStatus);

  // Columns for the user table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },

      {
        Header: 'Created At',
        accessor: (row) => formatDate(row.createdAt),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <>
            <NavLink to="#" style={{ marginRight: '10px' }}>
              <IconButton
                icon={<EditIcon />}
                colorScheme="blue"
                aria-label="Edit Product"
                onClick={() => handleShowEditModal(row)}
              />
            </NavLink>
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
            <Text fontSize="2xl">Products</Text>
            <Spacer />
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Manage Products
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <NavLink to="#" onClick={handleShowProductModal}>
                    New Product
                  </NavLink>
                </MenuItem>
                <MenuItem>
                  <NavLink to="/admin/products/catalogue">
                    Product Catalogue
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
              <Spinner />
            ) : filteredProducts && filteredProducts.length !== 0 ? (
              <SimpleTable
                columns={columns}
                data={filteredProducts}
                pageSize={pageLimit}
                totalPages={totalResults}
              />
            ) : (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            )}
          </Box>
        </Card>
      </Grid>

      <CreateProductModal
        isOpen={createProductModal}
        onClose={handleCloseProductModal}
      />

      {selectedProduct && (
        <EditProductModal
          isOpen={editProductModal}
          onClose={handleCloseEditModal}
          product={selectedProduct}
        />
      )}

      {selectedProduct && (
        <ProductDetailsModal
          isOpen={productDetailsModal}
          onClose={closeModalAndResetProduct}
          product={selectedProduct}
        />
      )}
    </Box>
  );
}
