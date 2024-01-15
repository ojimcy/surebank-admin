import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Grid,
  List,
  ListItem,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Center,
  Avatar,
  Stack,
} from '@chakra-ui/react';
import { Link, useParams, useHistory } from 'react-router-dom';
import axiosService from 'utils/axiosService';

import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [showFullDescription, setShowFullDescription] = useState(false);

  const textColor = useColorModeValue('navy.700', 'white');
  const history = useHistory();
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  useEffect(() => {
    const fetchProductCatalogue = async () => {
      try {
        const response = await axiosService.get(`/products/catalogue/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProductCatalogue();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axiosService.delete(`/products/catalogue/${id}`);
      toast({
        title: 'Product Deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      history.push('/'); // Redirect to a desired page after deletion
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error Deleting Product',
        description: 'An error occurred while deleting the product.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <BackButton />
          <Grid
            mb="20px"
            gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
            gap={{ base: '20px', xl: '20px' }}
            display={{ base: 'block', xl: 'grid' }}
          >
            <Flex
              flexDirection="column"
              gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
            >
              <Center py={6}>
                <Box
                  w={{ base: '90%', md: '80%' }}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="base"
                >
                  {product && (
                    <Flex
                      alignItems="center"
                      flexDirection={{ base: 'column', md: 'row' }}
                    >
                      <Avatar
                        size="xl"
                        name={product.name || ''}
                        src={product.avatarUrl || ''}
                        m={4}
                      />
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text>Name</Text>
                          <Text fontWeight="bold">{product.name}</Text>
                          <Text>Cost Price</Text>
                          <Text fontWeight="bold">{product.costPrice}</Text>
                          <Text>Seling Price:</Text>
                          <Text fontWeight="bold">{product.sellingPrice}</Text>
                          <Text>Discount Price:</Text>
                          <Text fontWeight="bold">
                            {product.discount ? product.discount : 'None'}
                          </Text>
                          <Text>Quantity:</Text>
                          <Text fontWeight="bold">{product.quantity}</Text>
                          <Text>Brand:</Text>
                          <Text fontWeight="bold">{product.brand}</Text>
                          <Text>Category:</Text>
                          <Text fontWeight="bold">{product.category}</Text>
                        </Grid>

                        {/* Specifications Section */}
                        {product.specifications &&
                          product.specifications.length > 0 && (
                            <Box>
                              <Text color={textColor} fontSize="lg" mb="10px">
                                Specifications:
                              </Text>
                              <List>
                                {product.specifications.map(
                                  (variation, index) => (
                                    <ListItem key={index}>
                                      <strong>{variation.name}:</strong>{' '}
                                      {variation.values.join(', ')}
                                    </ListItem>
                                  )
                                )}
                              </List>
                            </Box>
                          )}
                        {product.description && (
                          <Box mt={2}>
                            <Text color={textColor} fontSize="lg" mb="10px">
                              Description:
                            </Text>
                            <Text>
                              {showFullDescription
                                ? product.description
                                : product.description.slice(0, 100) + '...'}
                            </Text>
                            {!showFullDescription && (
                              <Button
                                colorScheme="blue"
                                size="sm"
                                onClick={() => setShowFullDescription(true)}
                              >
                                View All
                              </Button>
                            )}
                          </Box>
                        )}
                        <Stack
                          spacing={4}
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          mt={4}
                        >
                          <Button
                            as={Link}
                            to={`/admin/products/catalogue/edit/${id}`}
                            colorScheme="teal"
                            mr="10px"
                          >
                            Update
                          </Button>
                          <Button colorScheme="red" onClick={onOpen}>
                            Delete
                          </Button>
                        </Stack>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
        </Card>
      </Grid>
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
