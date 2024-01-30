// Import necessary Chakra components and dependencies
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Spacer, Button, Select } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import CustomTable from 'components/table/CustomTable';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import axiosService from 'utils/axiosService';

// Define the OrdersPage component
const OrdersPage = () => {
  // State variables
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Set your desired page size
  });

  // Fetch orders from the server
  const fetchOrders = async () => {
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/orders?&limit=${pageSize}&page=${pageIndex + 1}`
      );
      console.log(response.data);
      setOrders(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  // Effect to fetch orders on component mount and when pagination changes
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  // Function to handle page change
  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  // Function to filter orders based on the selected status
  const filterOrdersByStatus = (orders, status) => {
    if (status === 'All') {
      return orders;
    }
    return orders.filter(
      (order) => order.status.toLowerCase() === status.toLowerCase()
    );
  };
  const filteredOrders = filterOrdersByStatus(orders, selectedStatus);

  console.log(filteredOrders)
  // Columns for the order table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Order ID',
        accessor: 'id',
        Cell: ({ value }) => <Text>{value.substring(0, 6)}</Text>,
      },
      {
        Header: 'Image',
        accessor: 'products[0].productCatalogueId.images',
        Cell: ({ value }) => (
          <img src={value} alt="Product" style={{ width: '50px' }} />
        ),
      },
      {
        Header: 'Name',
        accessor: 'products[0].productCatalogueId.name',
      },
      {
        Header: 'User Reps',
        accessor: 'createdBy',
        Cell: (value) => (
          <NavLink to={`/admin/user/${value.createdby}`}>
            {value.firstName} {value.lastName}
          </NavLink>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <Button
            as={NavLink}
            to={`/admin/orders/${row.id}`}
            variant="outline"
            colorScheme="blue"
          >
            View Details
          </Button>
        ),
      },
    ],
    []
  );

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Flex justifyContent="space-between" mb="20px">
        <Text fontSize="2xl">Orders</Text>
        <Spacer />
        {/* Additional menu or filters can be added here if needed */}
      </Flex>
      <Box marginTop="30">
        {/* Select for selecting status */}
        <Box marginTop="20px" w="150px" justifyContent="space-between">
          <Spacer />
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            {['All', 'Pending', 'Paid', 'Delivered', 'Canceled'].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </Select>
        </Box>
        {loading ? (
          <LoadingSpinner />
        ) : filteredOrders && filteredOrders.length !== 0 ? (
          <CustomTable
            columns={columns}
            data={filteredOrders}
            onPageChange={onPageChange}
          />
        ) : (
          <Text fontSize="lg" textAlign="center" mt="20">
            No records found!
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default OrdersPage;
