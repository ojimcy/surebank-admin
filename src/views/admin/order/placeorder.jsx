import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Button,
  SimpleGrid,
  Grid,
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Alert,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira } from 'utils/helper';
import axiosService from 'utils/axiosService';

function PlaceOrder() {
  const { customerData, selectedPackage } = useAppContext();
  const [cartItems, setCartItems] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    deliveryMethod: 'pickup',
  });
  const [paymentMethod, setPaymentMethod] = useState('sbBalance');
  const [orderError, setOrderError] = useState(null);

  useEffect(() => {
    // Fetch cart items
    const fetchCart = async () => {
      try {
        const result = await axiosService.get('/cart');
        setCartItems(result.data.cartItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCart();
  }, []);

  const placeOrderHandler = async () => {
    try {
      // Validate shipping information
      if (
        shippingInfo.deliveryMethod === 'homeDelivery' &&
        (!shippingInfo.fullName ||
          !shippingInfo.phoneNumber ||
          !shippingInfo.address ||
          !shippingInfo.city ||
          !shippingInfo.state)
      ) {
        setOrderError('Please fill in all fields for home delivery.');
        return;
      }

      // Construct order data
      const orderData = {
        orderItems: cartItems.map((item) => ({
          productCatalogueId: item.product.id,
          name: item.product.name,
          quantity: item.quantity,
          sellingPrice: item.product.sellingPrice,
          image: item.product.image,
        })),
        deliveryAddress: {
          userId: customerData.id,
          fullName:
            shippingInfo.fullName ||
            `${customerData.firstName} ${customerData.lastName}`,
          phoneNumber: shippingInfo.phoneNumber || customerData.phoneNumber,
          address: shippingInfo.address || customerData.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
        },
        createdBy: customerData.id,
        paymentMethod,
        packageId: selectedPackage.id,
      };

      // Submit order
      const response = await axiosService.post('/orders', orderData);

      // Handle successful order placement (you can redirect or show a success message)
      console.log('Order placed successfully:', response.data);
    } catch (error) {
      console.error('Error during order placement:', error);
      setOrderError('Error placing the order. Please try again.');
    }
  };

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <SimpleGrid columns={{ base: 1 }} spacing={4} mt={8}>
        {/* Left Section: Shipping Address */}
        <Box>
          <List spacing={3}>
            <ListItem>
              <Heading as="h2" size="lg">
                Shipping Information
              </Heading>
            </ListItem>
            <FormControl id="deliveryMethod" mt={2}>
              <FormLabel>Delivery Method</FormLabel>
              <RadioGroup
                defaultValue={shippingInfo?.deliveryMethod}
                onChange={(value) =>
                  setShippingInfo((prev) => ({
                    ...prev,
                    deliveryMethod: value,
                  }))
                }
              >
                <Stack direction="column">
                  <Radio value="pickup">Pickup Station</Radio>
                  <Radio value="homeDelivery">Home Delivery</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            {shippingInfo.deliveryMethod === 'homeDelivery' && (
              <>
                <FormControl id="fullName" mt={2}>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    type="text"
                    value={shippingInfo.fullName}
                    defaultValue={`${customerData.firstName} ${customerData.lastName}`}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl id="phoneNumber" mt={2}>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="text"
                    value={shippingInfo.phoneNumber}
                    defaultValue={shippingInfo?.phoneNumber}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        phoneNumber: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl id="address" mt={2}>
                  <FormLabel>Address</FormLabel>
                  <Input
                    type="text"
                    value={shippingInfo.address}
                    defaultValue={shippingInfo?.address}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl id="city" mt={2}>
                  <FormLabel>City</FormLabel>
                  <Input
                    type="text"
                    value={shippingInfo.city}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        city: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormControl id="state" mt={2}>
                  <FormLabel>State</FormLabel>
                  <Input
                    type="text"
                    value={shippingInfo.state}
                    onChange={(e) =>
                      setShippingInfo((prev) => ({
                        ...prev,
                        state: e.target.value,
                      }))
                    }
                  />
                </FormControl>
              </>
            )}
          </List>
        </Box>

        {/* Left Section: Payment Method */}
        <Box mt={6}>
          <List spacing={3}>
            <ListItem>
              <Heading as="h2" size="lg">
                Payment Method
              </Heading>
            </ListItem>
            <FormControl id="paymentMethod" mt={2}>
              <FormLabel>Select Payment Method</FormLabel>
              <RadioGroup
                defaultValue={paymentMethod}
                onChange={(value) => setPaymentMethod(value)}
              >
                <Stack direction="column">
                  <Radio value="sbBalance">SB Balance</Radio>
                  <Radio value="card">Card</Radio>
                  <Radio value="transfer">Transfer</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </List>
        </Box>
        {/*  Order Summary */}
        <Box mt={6}>
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
              {orderError && (
                <ListItem>
                  <Alert status="error" variant="subtle">
                    <AlertIcon />
                    <AlertTitle mr={2}>{orderError}</AlertTitle>
                  </Alert>
                </ListItem>
              )}
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
