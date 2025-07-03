import React, { useState, useCallback, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  VStack,
  HStack,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import CustomSelect from 'components/dataDispaly/CustomSelect';
import axiosService from 'utils/axiosService';
import { useAppContext } from 'contexts/AppContext';
import { formatNaira } from 'utils/helper';

const CreatePackage = ({ isOpen, onClose, onSuccess }) => {
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');
  const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
  const bgColor = useColorModeValue('gray.50', 'whiteAlpha.50');
  const toast = useToast();

  // Use a ref to track component mount state
  const isMounted = useRef(true);

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm();

  const { customerData } = useAppContext();

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Memoized fetch products function
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosService.get('products/catalogue');
      // Only update state if component is still mounted
      if (isMounted.current) {
        setProducts(response.data?.results);
      }
    } catch (error) {
      // Only show error if component is still mounted
      if (isMounted.current) {
        toast({
          title: 'Error fetching products',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [toast]);

  // Load products on modal open
  React.useEffect(() => {
    if (isOpen) {
      fetchProducts();
    }
    // Reset state when modal closes
    return () => {
      if (!isOpen) {
        setProducts([]);
        setSelectedProduct(null);
        setProductDetails(null);
        setLoading(false);
        setIsSubmitting(false);
        reset();
      }
    };
  }, [isOpen, fetchProducts, reset]);

  const handleProductSelection = useCallback((selectedOption) => {
    if (!selectedOption) {
      setSelectedProduct(null);
      setProductDetails(null);
      return;
    }

    setSelectedProduct(selectedOption);
    const selectedProductDetails = products?.find(
      (product) => product.id === selectedOption.value
    );
    setProductDetails(selectedProductDetails);
  }, [products]);

  // Handle form submission
  const onSubmit = async (packageData) => {
    try {
      setIsSubmitting(true);
      if (!selectedProduct) {
        toast({
          title: 'Error',
          description: 'Please select a product',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const payload = {
        ...packageData,
        product: selectedProduct.value,
      };

      await axiosService.post('/daily-savings/sb/package', payload);

      // Only proceed with success actions if component is still mounted
      if (isMounted.current) {
        toast({
          title: 'Success',
          description: 'Package created successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        reset();
        setSelectedProduct(null);
        setProductDetails(null);
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      // Only show error if component is still mounted
      if (isMounted.current) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    } finally {
      // Only update submitting state if component is still mounted
      if (isMounted.current) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay backdropFilter="blur(4px)" />
      <ModalContent>
        <ModalHeader borderBottom="1px" borderColor={borderColor}>
          Create New Package
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              <FormControl isInvalid={errors.accountNumber}>
                <FormLabel
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
                  variant="auth"
                  fontSize="sm"
                  type="text"
                  placeholder="Enter account number"
                  defaultValue={customerData?.accountNumber}
                  {...register('accountNumber', {
                    required: 'Account number is required',
                    pattern: {
                      value: /^\d{10}$/,
                      message: 'Account number must be 10 digits'
                    }
                  })}
                />
                <FormErrorMessage>
                  {errors.accountNumber && errors.accountNumber.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isRequired>
                <FormLabel
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  color={textColor}
                  mb="8px"
                >
                  Select Product<Text color={brandStars}>*</Text>
                </FormLabel>
                <CustomSelect
                  isDisabled={loading}
                  options={(Array.isArray(products) ? products : [])?.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  onChange={handleProductSelection}
                  placeholder={loading ? "Loading products..." : "Select a product"}
                  value={selectedProduct}
                />
              </FormControl>

              {selectedProduct && productDetails && (
                <Box
                  p={4}
                  borderRadius="md"
                  border="1px"
                  borderColor={borderColor}
                  bg={bgColor}
                >
                  <VStack spacing={3} align="stretch">
                    <Text fontWeight="medium" fontSize="sm">
                      Selected Product Details
                    </Text>
                    <Divider />
                    <Grid templateColumns="1fr 1fr" gap={4}>
                      <Text fontSize="sm" color={textColor}>Name:</Text>
                      <Text fontSize="sm" fontWeight="medium">{productDetails.name}</Text>

                      <Text fontSize="sm" color={textColor}>Price:</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {formatNaira(productDetails.sellingPrice)}
                      </Text>

                      {productDetails.description && (
                        <>
                          <Text fontSize="sm" color={textColor}>Description:</Text>
                          <Text fontSize="sm" noOfLines={2}>
                            {productDetails.description}
                          </Text>
                        </>
                      )}
                    </Grid>
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter borderTop="1px" borderColor={borderColor}>
            <HStack spacing={3}>
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isSubmitting}
                loadingText="Creating..."
              >
                Create Package
              </Button>
            </HStack>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreatePackage;
