import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  List,
  ListItem,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  TableContainer,
  Flex,
} from '@chakra-ui/react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import axiosService from 'utils/axiosService'; // Adjust the import path
import { useAuth } from 'contexts/AuthContext';
import Card from 'components/card/Card';
import { FaTimesCircle, FaTruck, FaMoneyBill } from 'react-icons/fa';

import { formatNaira, formatMdbDate } from 'utils/helper';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

function SingleOrder() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const orderId = id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderDetails = async () => {
    try {
      const response = await axiosService.get(`/orders/${orderId}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleDeliverOrder = async () => {
    const deliverOrder = async () => {
      setLoading(true);
      try {
        await axiosService.post(`/orders/${orderId}/deliver`);
        toast.success('Product marked as delivered');
        fetchOrderDetails();
      } catch (error) {
        console.error('An error occurred:', error);
        toast.error(error.response?.data?.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    deliverOrder();
  };

  const paymentMethodLabels = {
    sb_balance: 'SB Balance',
    transfer: 'Bank Transfer',
    cash: 'Cash',
  };

  const handleMakePayment = async () => {
    toast.error('Not available');
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setLoading(true);
    try {
      await axiosService.post(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrderDetails();
    } catch (error) {
      console.error('An error occurred:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setLoading(false);
    }
  };

  // Check if user can cancel order
  const canCancelOrder =
    order &&
    !order.isDelivered &&
    !order.isPaid &&
    (currentUser.role === 'superAdmin' ||
      currentUser.id === order.createdBy?.id);

  const getStatusColor = (status) => {
    if (order.isDelivered) return 'green.500';
    if (order.isPaid) return 'blue.500';
    if (order.status === 'canceled') return 'red.500';
    return 'orange.500';
  };

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Flex justifyContent="space-between" alignItems="center" mb={6}>
            <Heading as="h1" size={{ base: 'md', md: 'lg' }}>
              Order #{orderId.substring(0, 6)}
            </Heading>
            <Text
              color={getStatusColor(order.status)}
              fontWeight="bold"
              fontSize="lg"
            >
              {order.status.toUpperCase()}
            </Text>
          </Flex>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
            <Box>
              {/* Customer Details Card */}
              <Card mb={6}>
                <Heading as="h2" size="md" mb={4}>
                  Customer Details
                </Heading>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={4}>
                  <Box>
                    <Text fontWeight="medium">Delivery Address</Text>
                    <Text>{order.deliveryAddress.fullName}</Text>
                    <Text>{order.deliveryAddress.phoneNumber}</Text>
                    <Text>{order.deliveryAddress.address}</Text>
                    <Text>{order.deliveryAddress.city}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium">Order Info</Text>
                    <Text>
                      Rep: {order.createdBy?.firstName}{' '}
                      {order.createdBy?.lastName}
                    </Text>
                    <Text>Created: {formatMdbDate(order.createdAt)}</Text>
                    <Text>
                      Payment: {paymentMethodLabels[order.paymentMethod]}
                    </Text>
                    <Text>
                      Payment Status:{' '}
                      {order.isPaid
                        ? `Paid on ${formatMdbDate(order.paidAt)}`
                        : 'Pending'}
                    </Text>
                    <Text>
                      Delivery Status:{' '}
                      {order.isDelivered
                        ? `Delivered on ${formatMdbDate(order.deliveredAt)}`
                        : 'Pending'}
                    </Text>
                  </Box>
                </Grid>
              </Card>

              {/* Order Items Card */}
              <Card>
                <Heading as="h2" size="md" mb={4}>
                  Order Items
                </Heading>
                <TableContainer>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Product</Th>
                        <Th isNumeric>Quantity</Th>
                        <Th isNumeric>Unit Price</Th>
                        <Th isNumeric>Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {order.products.map((item) => (
                        <Tr key={item._id}>
                          <Td>
                            <NavLink
                              to={`/admin/products/catalogue-details/${item.productCatalogueId.id}`}
                            >
                              <Text
                                color="blue.500"
                                _hover={{ textDecoration: 'underline' }}
                              >
                                {item.productCatalogueId.name}
                              </Text>
                            </NavLink>
                          </Td>
                          <Td isNumeric>{item.quantity}</Td>
                          <Td isNumeric>{formatNaira(item.sellingPrice)}</Td>
                          <Td isNumeric>
                            {formatNaira(item.sellingPrice * item.quantity)}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Card>
            </Box>

            {/* Order Summary Card */}
            <Card>
              <Heading as="h2" size="md" mb={4}>
                Order Summary
              </Heading>
              <List spacing={3}>
                <ListItem>
                  <Flex justify="space-between">
                    <Text>Subtotal:</Text>
                    <Text fontWeight="bold">
                      {formatNaira(order.totalAmount)}
                    </Text>
                  </Flex>
                </ListItem>
                <ListItem>
                  <Flex justify="space-between">
                    <Text>Total:</Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.500">
                      {formatNaira(order.totalAmount)}
                    </Text>
                  </Flex>
                </ListItem>

                {/* Action Buttons */}
                <ListItem pt={4}>
                  <Grid templateColumns="1fr" gap={3}>
                    {!order.isPaid && (
                      <Button
                        leftIcon={<FaMoneyBill />}
                        colorScheme="green"
                        onClick={handleMakePayment}
                        isDisabled={order.status === 'canceled'}
                      >
                        Make Payment
                      </Button>
                    )}

                    {currentUser.role === 'superAdmin' &&
                      order.isPaid &&
                      !order.isDelivered && (
                        <Button
                          leftIcon={<FaTruck />}
                          colorScheme="blue"
                          onClick={handleDeliverOrder}
                          isDisabled={order.status === 'canceled'}
                        >
                          Mark as Delivered
                        </Button>
                      )}

                    {canCancelOrder && (
                      <Button
                        leftIcon={<FaTimesCircle />}
                        colorScheme="red"
                        variant="outline"
                        onClick={handleCancelOrder}
                      >
                        Cancel Order
                      </Button>
                    )}
                  </Grid>
                </ListItem>
              </List>
            </Card>
          </Grid>
        </>
      )}
    </Box>
  );
}

export default SingleOrder;
