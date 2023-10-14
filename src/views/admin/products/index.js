// Chakra imports
import React, { useEffect, useState } from 'react';
import { Box, Grid, Spinner, Flex, Button, Spacer } from '@chakra-ui/react';

// Custom components
import { formatDate } from 'utils/helper';

// Assets
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import SimpleTable from 'components/table/SimpleTable';
import axiosService from 'utils/axiosService';
import CreateProductModal from 'components/modals/CreateProductModal';
import ProductDetailsModal from 'components/modals/ProductDetailsModal';

export default function Customers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(1);
  const [createProductModal, setCreateProductModal] = useState(false);
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const pageLimit = 10;

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
  };

  const handleShowDetailsModal = (product) => {
    setSelectedProduct(product);
    setProductDetailsModal(true);
  };

  const closeModalAndResetProduct = () => {
    setSelectedProduct(null);
    setProductDetailsModal(false);
  };

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
          <Flex justifyContent="space-between" mb="20px">
            <BackButton />
            <Spacer />

            <Button
              bgColor="blue.700"
              color="white"
              onClick={handleShowProductModal}
            >
              Create Product
            </Button>
          </Flex>
          <Box marginTop="30">
            {loading ? (
              <Spinner />
            ) : (
              <SimpleTable
                columns={columns}
                data={products}
                pageSize={pageLimit}
                totalPages={totalResults}
              />
            )}
          </Box>
        </Card>
      </Grid>

      <CreateProductModal
        isOpen={createProductModal}
        onClose={handleCloseProductModal}
      />

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
