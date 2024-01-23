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
import { formatMdbDate } from 'utils/helper';

// Assets
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import CustomTable from 'components/table/CustomTable';
import axiosService from 'utils/axiosService';
import CatalogueDetailsModal from 'components/modals/CatalogueDetailsModal';
import { useAuth } from 'contexts/AuthContext';

export default function Catalogue() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });

  const fetchProductRequests = async () => {
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/products/catalogue?&limit=${pageSize}&page=${pageIndex + 1}`
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
    fetchProductRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

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
        Header: 'Cost Price',
        accessor: 'costPrice',
      },
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
              <Button style={{ marginRight: '10px' }}>View Details</Button>
            </NavLink>
          </>
        ),
      },
    ],
    []
  );

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
          <Flex justifyContent="space-between" mb="20px">
            <Text fontSize="2xl">Catalogue</Text>
            <Spacer />
            {currentUser.role === 'superAdmin' ||
            currentUser.role === 'admin' ? (
              <NavLink to="/admin/products/catalogue/create">
                <Button bgColor="blue.700" color="white">
                  Add Product
                </Button>
              </NavLink>
            ) : (
              ''
            )}
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
                <CustomTable
                  columns={columns}
                  data={products}
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
