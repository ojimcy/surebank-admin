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
} from '@chakra-ui/react';
import { NavLink, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import axiosService from 'utils/axiosService'; // Adjust the import path
import { useAuth } from 'contexts/AuthContext';
import Card from 'components/card/Card';

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

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <Heading as="h1" size={{ base: 'l', md: 'xl' }} mb={4}>
        Order {orderId.substring(0, 6)}
      </Heading>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Grid
          templateColumns={{ base: '1fr', md: '1fr', lg: '2fr 1fr' }}
          gap={4}
        >
          <Box>
            {/* Left Section: Shipping Address */}
            <Card>
              <List spacing={3} mb={4}>
                <ListItem>
                  <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
                    Customer Details
                  </Heading>
                </ListItem>
                <ListItem>
                  {order.deliveryAddress.fullName},{' '}
                  {order.deliveryAddress.phoneNumber},{' '}
                  {order.deliveryAddress.address}, {order.deliveryAddress.city},{' '}
                  &nbsp;
                </ListItem>
                <ListItem>
                  Status:{' '}
                  {order.isDelivered
                    ? `Delivered at ${formatMdbDate(order.deliveredAt)}`
                    : 'Not Delivered'}
                </ListItem>
              </List>
            </Card>
            {/* Middle Section: Payment Method */}
            <Box mt={4}>
              <Card>
                <List spacing={3} mb={4}>
                  <ListItem>
                    <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
                      Payment Method
                    </Heading>
                  </ListItem>
                  <ListItem>
                    {paymentMethodLabels[order.paymentMethod]}
                  </ListItem>
                  <ListItem>
                    Status:{' '}
                    {order.isPaid
                      ? `Paid at ${formatMdbDate(order.paidAt)}`
                      : 'Not paid'}
                  </ListItem>
                  <ListItem>
                    Rep: {order.createdBy?.firstName}{' '}
                    {order.createdBy?.lastName}
                  </ListItem>
                </List>
              </Card>
            </Box>
            {/* Right Section: Order Items List */}
            <Box mt={4}>
              <Card>
                <List spacing={3}>
                  <ListItem>
                    <>
                      <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
                        Order Items
                      </Heading>

                      <TableContainer overflowX="auto">
                        <Table variant="simple">
                          <Thead>
                            <Tr>
                              {/* <Th>Image</Th> */}
                              <Th>Name</Th>
                              <Th>Quantity</Th>
                              <Th>Unit Price</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {order.products.map((item) => (
                              <Tr key={item._id}>
                                {/* <Td>
                                  <NavLink
                                    to={`/product/${item.productCatalogueId.id}`}
                                  >
                                    <Image
                                      src={item.productCatalogueId?.images[0]}
                                      alt={item.productCatalogueId.name}
                                      boxSize="50px"
                                    />
                                  </NavLink>
                                </Td> */}
                                <Td>
                                  <NavLink
                                    to={`/product/${item.productCatalogueId.id}`}
                                  >
                                    <Text>{item.productCatalogueId.name}</Text>
                                  </NavLink>
                                </Td>
                                <Td>{item.quantity}</Td>
                                <Td>
                                  {item.sellingPrice &&
                                    formatNaira(item.sellingPrice)}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </>
                  </ListItem>
                </List>
              </Card>
            </Box>
          </Box>
          <Box>
            {/* Right Section: Order Summary */}
            <Card>
              <Box mt={1}>
                <List spacing={3} mb={4}>
                  <ListItem>
                    <Heading as="h2" size={{ base: 'md', md: 'lg' }}>
                      Order Summary
                    </Heading>
                  </ListItem>
                  <ListItem>
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <strong>Sum Total:</strong>
                      </Box>
                      <Box align="right">
                        <strong>
                          {order.totalAmount && formatNaira(order?.totalAmount)}
                        </strong>
                      </Box>
                    </Grid>
                  </ListItem>
                  {!order.isPaid && (
                    <ListItem>
                      <Button
                        width="full"
                        colorScheme="teal"
                        onClick={handleMakePayment}
                      >
                        Make Payment
                      </Button>
                    </ListItem>
                  )}
                  {currentUser.role === 'superAdmin' ||
                  (currentUser.role === 'superAdmin' &&
                    order.isPaid &&
                    !order.isDelivered) ? (
                    <ListItem>
                      <Button
                        width="full"
                        colorScheme="teal"
                        onClick={handleDeliverOrder}
                      >
                        Deliver Order
                      </Button>
                    </ListItem>
                  ) : (
                    ''
                  )}
                </List>
              </Box>
            </Card>
          </Box>
        </Grid>
      )}
    </Box>
  );
}

export default SingleOrder;
