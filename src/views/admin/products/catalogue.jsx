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
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';

// Custom components
import { formatDate } from 'utils/helper';

// Assets
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import SimpleTable from 'components/table/SimpleTable';
import axiosService from 'utils/axiosService';
import CatalogueDetailsModal from 'components/modals/CatalogueDetailsModal';

export default function Catalogue() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(1);
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const pageLimit = 10;

  const fetchProductRequests = async () => {
    try {
      const response = await axiosService.get('/products/catalogue');
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

  const closeModalAndResetProduct = () => {
    setSelectedProduct(null);
    setProductDetailsModal(false);
  };

  // Columns for the catalogue table
  const columns = React.useMemo(
    () => [
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
      {
        Header: 'Sales Price',
        accessor: 'salesPrice',
      },
      {
        Header: 'Price',
        accessor: 'price',
      },
      {
        Header: 'Quantity',
        accessor: 'quantity',
      },

      {
        Header: 'Created At',
        accessor: (row) => formatDate(row.createdAt),
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <>
            <NavLink to={`/admin/products/catalogue-details/${row.id}`}>
              <Button style={{ marginRight: '10px' }}>View Details</Button>
            </NavLink>
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
            <Text fontSize="2xl">Catalogue</Text>
            <Spacer />
            <NavLink to="/admin/products/catalogue/create">
              <Button bgColor="blue.700" color="white">
                Add Product
              </Button>
            </NavLink>
          </Flex>
          <Box marginTop="30">
            {loading ? (
              <Spinner />
            ) : products.length === 0 ? (
              <Text fontSize="lg" textAlign="center" mt="20">
                No records found!
              </Text>
            ) : (
              <>
                <SimpleTable
                  columns={columns}
                  data={products}
                  pageSize={pageLimit}
                  totalPages={totalResults}
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
