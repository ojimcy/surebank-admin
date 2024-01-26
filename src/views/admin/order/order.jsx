import React, { useState, useEffect } from 'react';

import {
  Grid,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Link,
  CircularProgress,
  Button,
  Box,
  Text,
  Heading,
  List,
  ListItem,
  Image,
} from '@chakra-ui/react';

import BackButton from 'components/menu/BackButton';
import { NavLink, useParams } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

function Order() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const orderId = id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    shippingAddress,
    paymentMethod,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  const handleDeliverOrder = async () => {};

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <Heading as="h1" size="xl" mb={4}>
        Order {orderId}
      </Heading>
      {loading ? (
        <CircularProgress />
      ) : (
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={4}>
          <Box>
            {/* Left Section: Shipping Address */}
            <List spacing={3} mb={4}>
              <ListItem>
                <Heading as="h2" size="lg">
                  Shipping Address
                </Heading>
              </ListItem>
              <ListItem>
                {shippingAddress.fullName}, {shippingAddress.address},{' '}
                {shippingAddress.city}, {shippingAddress.postalCode},{' '}
                {shippingAddress.country}
                &nbsp;
              </ListItem>
              <ListItem>
                Status:{' '}
                {isDelivered ? `delivered at ${deliveredAt}` : 'not delivered'}
              </ListItem>
            </List>

            {/* Middle Section: Payment Method */}
            <List spacing={3} mb={4}>
              <ListItem>
                <Heading as="h2" size="lg">
                  Payment Method
                </Heading>
              </ListItem>
              <ListItem>{paymentMethod}</ListItem>
              <ListItem>
                Status: {isPaid ? `paid at ${paidAt}` : 'not paid'}
              </ListItem>
            </List>

            {/* Right Section: Order Items List */}
            <List spacing={3}>
              <ListItem>
                <Heading as="h2" size="lg">
                  Order Items
                </Heading>
              </ListItem>
              <ListItem>
                <TableContainer>
                  <Table variant="simple">
                    <TableHead>
                      <TableRow>
                        <TableCell>Image</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell isNumeric>Quantity</TableCell>
                        <TableCell isNumeric>Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item._id}>
                          <TableCell>
                            <NavLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  width={50}
                                  height={50}
                                />
                              </Link>
                            </NavLink>
                          </TableCell>
                          <TableCell>
                            <NavLink href={`/product/${item.slug}`} passHref>
                              <Link>
                                <Text>{item.name}</Text>
                              </Link>
                            </NavLink>
                          </TableCell>
                          <TableCell isNumeric>
                            <Text>{item.quantity}</Text>
                          </TableCell>
                          <TableCell isNumeric>
                            <Text>${item.price}</Text>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </ListItem>
            </List>
          </Box>
          <Box>
            {/* Right Section: Order Summary */}
            <List spacing={3} mb={4}>
              <ListItem>
                <Heading as="h2" size="lg">
                  Order Summary
                </Heading>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Items:</Box>
                  <Box textAlign="right">${itemsPrice}</Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Tax:</Box>
                  <Box textAlign="right">${taxPrice}</Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Shipping:</Box>
                  <Box textAlign="right">${shippingPrice}</Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <strong>Total:</strong>
                  </Box>
                  <Box textAlign="right">
                    <strong>${totalPrice}</strong>
                  </Box>
                </Grid>
              </ListItem>
              {currentUser.role === 'superAdmin' && isPaid && !isDelivered && (
                <ListItem>
                  <Button
                    width="full"
                    colorScheme="teal"
                    onClick={handleDeliverOrder}
                  >
                    Deliver Order
                  </Button>
                </ListItem>
              )}
            </List>
          </Box>
        </Grid>
      )}
    </Box>
  );
}

export default Order;
