import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
  useColorModeValue,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import ReactSelect from 'react-select';

import axiosService from 'utils/axiosService';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira } from 'utils/helper';


const CreatePackage = ({ isOpen, onClose }) => {
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const { customerData } = useAppContext();

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosService.get('products/catalogue');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductSelection = (selectedOption) => {
    setSelectedProduct(selectedOption);
    const selectedProductDetails = products.find(
      (product) => product.id === selectedOption.value
    );
    setProductDetails(selectedProductDetails);
  };

  // Handle form submission
  const onSubmit = async (packageData) => {
    try {
      if (selectedProduct) {
        packageData.product = selectedProduct.value;
      }
      await axiosService.post(`/daily-savings/sb/package`, packageData);
      toast.success('Package created successfully!');
      onClose();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Package</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid templateColumns="1fr" gap={4}>
              <FormControl isInvalid={errors.accountNumber}>
                <FormLabel
                  htmlFor="accountNumber"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Account Number<Text color={brandStars}>*</Text>
                </FormLabel>
                <Input
                  isRequired={true}
                  variant="auth"
                  fontSize="sm"
                  ms={{ base: '0px', md: '0px' }}
                  type="text"
                  id="accountNumber"
                  mb="24px"
                  fontWeight="500"
                  size="lg"
                  defaultValue={customerData?.accountNumber}
                  {...register('accountNumber', {
                    required: 'Account number is required',
                  })}
                />
                <FormErrorMessage>
                  {errors.accountNumber && errors.accountNumber.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  htmlFor="product"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Select Product
                </FormLabel>
                <ReactSelect
                  options={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  onChange={handleProductSelection}
                  placeholder="Select a product"
                />
              </FormControl>
            </Grid>
            {selectedProduct && (
              <Box mt={4}>
                {loading ? ( // Display loading spinner while loading
                  <Spinner size="lg" />
                ) : (
                  <>
                    <Box
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Text>{productDetails?.name}</Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {selectedProduct &&
                        productDetails &&
                        productDetails.sellingPrice
                          ? formatNaira(productDetails.sellingPrice)
                          : 'Price not available'}
                      </Text>
                    </Box>
                  </>
                )}
              </Box>
            )}

            <Button
              mt={4}
              colorScheme="green"
              variant="solid"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              isLoading={isSubmitting}
            >
              Create Package
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreatePackage;
