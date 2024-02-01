// Import necessary Chakra components and dependencies
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Spacer, Button, Select } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import CustomTable from 'components/table/CustomTable';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import axiosService from 'utils/axiosService';
import { useAuth } from 'contexts/AuthContext';

// Define the OrdersPage component
const OrdersPage = () => {
  // State variables
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10, // Set your desired page size
  });
  const [staffInfo, setStaffInfo] = useState({});

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

  useEffect(() => {
    const fetchOrders = async () => {
      if (currentUser && staffInfo && staffInfo.branchId !== undefined) {
        const { pageIndex, pageSize } = pagination;
        try {
          setLoading(true);
          let query = `/orders?&limit=${pageSize}&page=${pageIndex + 1}`;
          // Add query parameters based on user role
          if (currentUser.role === 'manager') {
            query += `&branchId=${staffInfo.branchId}`;
          } else if (currentUser.role === 'userReps') {
            query += `&createdBy=${currentUser.id}`;
          }
          const response = await axiosService.get(query);
          setOrders(response.data.orders);
        } catch (error) {
          console.error(
            error.response?.data?.message || 'Error fetching orders:',
            error
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, staffInfo, pagination]);

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
        Cell: ({ value, row }) => (
          <NavLink
            to={`/product/catalogue-details/${row.original.products[0].productCatalogueId.id}`}
          >
            <img src={value} alt="Product" style={{ width: '50px' }} />
          </NavLink>
        ),
      },
      {
        Header: 'Name',
        accessor: 'products[0].productCatalogueId.name',
      },
      {
        Header: 'Reps',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.createdBy.id}`}>
            {row.createdBy.firstName} {row.createdBy.lastName}
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
