// Import necessary Chakra components and dependencies
import React, { useEffect, useState } from 'react';
import { Box, Flex, Text, Button, Select } from '@chakra-ui/react';
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
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

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
      if (!currentUser) return;

      // Only require staffInfo for manager role
      if (currentUser.role === 'manager' && !staffInfo?.branchId) return;

      const { pageIndex, pageSize } = pagination;
      try {
        setLoading(true);
        setError(null);

        let query = `/orders?limit=${pageSize}&page=${pageIndex + 1}`;

        // Add query parameters based on user role
        if (currentUser.role === 'manager') {
          query += `&branchId=${staffInfo.branchId}`;
        } else if (currentUser.role === 'userReps') {
          query += `&createdBy=${currentUser.id}`;
        }
        // superAdmin gets all orders by default

        // Add status filter if not "All"
        if (selectedStatus !== 'All') {
          query += `&status=${selectedStatus.toLowerCase()}`;
        }

        const response = await axiosService.get(query);
        setOrders(response.data.orders);
        setTotalCount(response.data.totalCount || 0);
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || 'Error fetching orders';
        console.error(errorMessage, error);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser, staffInfo, pagination, selectedStatus]);

  // Function to handle page change
  const onPageChange = ({ pageIndex, pageSize }) => {
    setPagination({ pageIndex, pageSize });
  };

  // Columns for the order table
  const columns = React.useMemo(
    () => [
      {
        Header: 'Order ID',
        accessor: 'id',
        Cell: ({ value }) => (
          <Text color="blue.500" fontWeight="medium">
            #{value.substring(0, 6)}
          </Text>
        ),
      },
      {
        Header: 'Name',
        accessor: 'products[0].productCatalogueId.name',
        Cell: ({ value }) => (
          <Text noOfLines={2} maxW="200px">
            {value}
          </Text>
        ),
      },
      {
        Header: 'Reps',
        accessor: (row) => (
          <NavLink to={`/admin/user/${row.createdBy.id}`}>
            <Text color="blue.500" _hover={{ textDecoration: 'underline' }}>
              {row.createdBy.firstName} {row.createdBy.lastName}
            </Text>
          </NavLink>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
          const statusColors = {
            pending: 'orange',
            paid: 'green',
            delivered: 'blue',
            canceled: 'red',
          };
          return (
            <Text
              color={`${statusColors[value.toLowerCase()]}.500`}
              fontWeight="medium"
            >
              {value}
            </Text>
          );
        },
      },
      {
        Header: 'Action',
        accessor: (row) => (
          <Button
            as={NavLink}
            to={`/admin/orders/${row.id}`}
            variant="outline"
            colorScheme="blue"
            size="sm"
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
      <Flex direction="column" gap={6}>
        {/* Header Section */}
        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl" fontWeight="bold">
            Orders {totalCount > 0 && `(${totalCount})`}
          </Text>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            width="auto"
            minW="200px"
          >
            {['All', 'Pending', 'Paid', 'Delivered', 'Canceled'].map(
              (option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              )
            )}
          </Select>
        </Flex>

        {/* Error Message */}
        {error && (
          <Text color="red.500" textAlign="center">
            {error}
          </Text>
        )}

        {/* Table Section */}
        {loading ? (
          <LoadingSpinner />
        ) : orders && orders.length > 0 ? (
          <CustomTable
            columns={columns}
            data={orders}
            onPageChange={onPageChange}
            totalCount={totalCount}
            pageCount={Math.ceil(totalCount / pagination.pageSize)}
            {...pagination}
          />
        ) : (
          <Text fontSize="lg" textAlign="center" color="gray.500">
            No orders found
          </Text>
        )}
      </Flex>
    </Box>
  );
};

export default OrdersPage;
