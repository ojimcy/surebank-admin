import React, { useEffect, useState } from 'react';
import {
  Grid,
  Box,
  Heading,
  Button,
  SimpleGrid,
  List,
  ListItem,
} from '@chakra-ui/react';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';

function PlaceOrder() {
  const { customerData, packageData } = useAppContext();

  const shippingPrice = 50;

  const placeOrderHandler = async () => {};

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={8}>
        <Box>
          <List spacing={3}>
            <ListItem>
              <Heading as="h2" size="lg">
                Shipping Address
              </Heading>
            </ListItem>
            <ListItem>
              {customerData?.fullName}, {customerData?.address},{' '}
              {customerData?.city}, {customerData?.phoneNumber},{' '}
              {customerData?.country}
            </ListItem>
          </List>
        </Box>

        <Box>
          <List spacing={3}>
            <ListItem>
              <Heading as="h2" size="lg">
                Payment Method
              </Heading>
            </ListItem>
            <ListItem>Sb Balance</ListItem>
          </List>
        </Box>
      </SimpleGrid>

      <Box mt={8}>
        <List spacing={3}>
          <ListItem>
            <Heading as="h2" size="lg">
              Order Summary
            </Heading>
          </ListItem>
          <ListItem>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>Items:</Box>
              <Box align="right">${packageData?.priduct.salesPrice}</Box>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>Tax:</Box>
              <Box align="right">${packageData?.charge}</Box>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>Shipping:</Box>
              <Box align="right">${shippingPrice}</Box>
            </Grid>
          </ListItem>
          <ListItem>
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <Box>
                <strong>Total:</strong>
              </Box>
              <Box align="right">
                <strong>${packageData?.salesPrice}</strong>
              </Box>
            </Grid>
          </ListItem>
          <ListItem>
            <Button
              onClick={placeOrderHandler}
              colorScheme="teal"
              variant="solid"
              isFullWidth
              mt={4}
            >
              Place Order
            </Button>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}

export default PlaceOrder;
