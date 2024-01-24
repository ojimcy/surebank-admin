import React from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Button,
  SimpleGrid,
  Grid,
} from '@chakra-ui/react';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira } from 'utils/helper';

function PlaceOrder() {
  const { customerData, selectedPackage } = useAppContext();

  const placeOrderHandler = async () => {
    // Your order placement logic
  };
  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mt={8}>
        <Box>
          {/* Left Section: Shipping Address */}
          <Box>
            <List spacing={3}>
              <ListItem>
                <Heading as="h2" size="lg">
                  Shipping Information
                </Heading>
              </ListItem>
              {customerData && (
                <ListItem>
                  {customerData.firstName} {customerData.lastName},{' '}
                  {customerData.phoneNumber}
                </ListItem>
              )}
            </List>
          </Box>

          {/* Left Section: Payment Method */}
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
        </Box>
        {/* Right Section: Order Summary */}
        <Box mt={8}>
          {selectedPackage && (
            <List spacing={3}>
              <ListItem>
                <Heading as="h2" size="lg">
                  Order Summary
                </Heading>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Item:</Box>
                  <Box align="right">{selectedPackage?.product.name}</Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Price:</Box>
                  <Box align="right">
                    {formatNaira(selectedPackage?.product.sellingPrice)}
                  </Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Quantity:</Box>
                  <Box align="right">{selectedPackage.quantity}</Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>Delivery:</Box>
                  <Box align="right">
                    {selectedPackage.delivery ? selectedPackage.delivery : 0}
                  </Box>
                </Grid>
              </ListItem>
              <ListItem>
                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <Box>
                    <strong>Total:</strong>
                  </Box>
                  <Box align="right">
                    <strong>{selectedPackage?.salesPrice}</strong>
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
          )}
        </Box>
      </SimpleGrid>
    </Box>
  );
}

export default PlaceOrder;
