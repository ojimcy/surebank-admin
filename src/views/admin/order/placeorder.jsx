import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Button,
  GridItem,
  Grid,
  Input,
  FormControl,
  FormLabel,
  RadioGroup,
  Stack,
  Radio,
  Table,
  Thead,
  Tbody,
  Td,
  Th,
  Tr,
} from '@chakra-ui/react';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira } from 'utils/helper';
import axiosService from 'utils/axiosService';
import { useAuth } from 'contexts/AuthContext';
import { toast } from 'react-toastify';
import Card from 'components/card/Card';

function PlaceOrder() {
  const { currentUser } = useAuth();
  const { customerData } = useAppContext();
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
        toast.error('Please fill in all required fields for home delivery.');
        return;
      }

      // Ensure that the cart items are available
      if (!cartItems || cartItems.length === 0) {
        toast.error('Your cart is empty. Add items before placing an order.');
        return;
      }

      // Construct order data
      const orderData = {
        orderItems: cartItems.map((item) => ({
          productCatalogueId: item.productCatalogueId.id,
          packageId: item.packageId,
          name: item.productCatalogueId.name,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          image: item.productCatalogueId?.images[0],
        })),
        deliveryAddress: {
          userId: customerData._id,
          fullName:
            shippingInfo.fullName ||
            `${customerData.firstName} ${customerData.lastName}`,
          phoneNumber: shippingInfo.phoneNumber || customerData.phoneNumber,
          address: shippingInfo.address || customerData.address,
          city: shippingInfo.city || customerData.city,
          state: shippingInfo.state || customerData.state,
        },
        createdBy: currentUser.id,
        paymentMethod,
      };
      console.log(orderData);

      // Submit order
      await axiosService.post('/orders', orderData);

      toast.success('Order placed successfully:');
    } catch (error) {
      console.error('Error during order placement:', error);
      toast.error('Error placing the order. Please try again.');
    }
  };
  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={4} mt={8}>
        <GridItem>
          <Box>
            {/* Left Section: Shipping Address */}
            <Card>
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
            </Card>

            {/* Left Section: Payment Method */}
            <Box mt={1} pb={5}>
              <Card>
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
              </Card>
            </Box>

            {/* Left Section: Order Items List */}
            <Box mt={1} pb={5}>
              <Card>
                {cartItems && cartItems.length > 0 && (
                  <>
                    <Heading as="h2" size="lg">
                      Order Items
                    </Heading>
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Image</Th>
                          <Th>Name</Th>
                          <Th>Quantity</Th>
                          <Th>Price</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cartItems.map((cartItem, index) => (
                          <Tr key={index}>
                            <Td>
                              <img
                                src={cartItem.productCatalogueId?.images[0]}
                                alt={cartItem.productCatalogueId?.name}
                                style={{ width: '50px', height: '50px' }}
                              />
                            </Td>
                            <Td>{cartItem.productCatalogueId?.name}</Td>
                            <Td>{cartItem?.quantity}</Td>
                            <Td>{formatNaira(cartItem?.sellingPrice)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </>
                )}
              </Card>
            </Box>
          </Box>
        </GridItem>

        <GridItem>
          {/*  Order Summary */}
          <Card>
            <Box mt={1}>
              {cartItems &&
                cartItems.map((cartItem, index) => (
                  <List spacing={3} key={index}>
                    <ListItem>
                      <Heading as="h2" size="lg">
                        Order Summary
                      </Heading>
                    </ListItem>
                    <ListItem>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>Item:</Box>
                        <Box align="right">
                          {cartItem.productCatalogueId?.name}
                        </Box>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>Quantity:</Box>
                        <Box align="right">{cartItem?.quantity}</Box>
                      </Grid>
                    </ListItem>
                    <ListItem>
                      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                        <Box>
                          <strong>Total:</strong>
                        </Box>
                        <Box align="right">
                          <strong>{cartItem?.subTotal}</strong>
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
                ))}
            </Box>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}

export default PlaceOrder;
