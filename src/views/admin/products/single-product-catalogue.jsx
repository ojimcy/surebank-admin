import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Image,
  useColorModeValue,
  HStack,
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

          <Flex mt="40px" p="20px" justifyContent="center">
            <Box w="50%" pr="20px">
              <HStack spacing={4} mb="20px">
                {product.images &&
                  product.images.map((image, index) => (
                    <Image
                      key={index}
                      src={image}
                      alt={`Product Image ${index + 1}`}
                      maxH="150px"
                      maxW="150px"
                    />
                  ))}
              </HStack>
            </Box>
            <Box w="50%">
              <Text color={textColor} fontSize="xl" fontWeight="bold" mb="10px">
                {product.name}
              </Text>
              <Text color={textColor} mb="10px">
                Price: {product.price}
              </Text>
              <Text color={textColor} mb="10px">
                Selling Price: {product.salesPrice}
              </Text>
              <Text color={textColor} mb="10px">
                Quantity: {product.quantity}
              </Text>
              <Text color={textColor} mb="10px">
                Brand: {product.brand}
              </Text>
              <Text color={textColor} mb="10px">
                Category: {product.category}
              </Text>{' '}
              {/* Specifications Section */}
              {product.specifications && product.specifications.length > 0 && (
                <Box>
                  <Text color={textColor} fontSize="lg" mb="10px">
                    Specifications:
                  </Text>
                  <List>
                    {product.specifications.map((variation, index) => (
                      <ListItem key={index}>
                        <strong>{variation.name}:</strong>{' '}
                        {variation.values.join(', ')}
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              <Box mt="15px">
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
              </Box>
            </Box>
          </Flex>

          {product.description && (
            <Box>
              <Text color={textColor} fontSize="lg" mb="10px">
                Description
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
