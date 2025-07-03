import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Text,
  Box,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import CustomSelect from 'components/dataDispaly/CustomSelect';

const ChangeProductModal = ({ isOpen, onClose, onSuccess, packageData }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);
  const toast = useToast();

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedProduct(null);
      setProductDetails(null);
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    // Only fetch products when modal is open
    if (!isOpen) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosService.get('products/catalogue');
        if (isMounted.current) {
          // Extract products from the results array in the response
          const productsData = response.data?.results || [];
          setProducts(productsData);
        }
      } catch (error) {
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
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    fetchProducts();
  }, [isOpen, toast]);

  const handleProductSelection = (selectedOption) => {
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
  };

  // Handle form submission
  const onSubmit = async (formData) => {
    try {
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
        ...formData,
        newProductId: selectedProduct.value,
      };

      await axiosService.patch(
        `/daily-savings/sb/package/${packageData._id}`,
        payload
      );

      if (isMounted.current) {
        toast({
          title: 'Success',
          description: 'Product changed successfully!',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        reset();
        onSuccess?.();
        onClose();
      }
    } catch (error) {
      if (isMounted.current) {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Something went wrong',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {packageData && (
            <>
              <Text>Current Product: {packageData.product.name}</Text>
              <Text mb="8px">
                Current Price: {formatNaira(packageData.product.sellingPrice)}
              </Text>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid templateColumns="1fr" gap={4}>
                  <FormControl isRequired>
                    <FormLabel
                      htmlFor="product"
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                      mt="4px"
                    >
                      Select new Product
                    </FormLabel>
                    <CustomSelect
                      isDisabled={loading}
                      options={products.map((product) => ({
                        value: product.id,
                        label: `${product.name} - ${formatNaira(product.sellingPrice)}`,
                      }))}
                      onChange={handleProductSelection}
                      placeholder={loading ? "Loading products..." : "Select new product"}
                      value={selectedProduct}
                    />
                  </FormControl>
                </Grid>
                {selectedProduct && productDetails && (
                  <Box mt={4}>
                    {loading ? (
                      <Spinner size="lg" />
                    ) : (
                      <>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                          p={4}
                          borderRadius="md"
                          border="1px"
                          borderColor="gray.200"
                        >
                          <Text fontWeight="medium">{productDetails.name}</Text>
                          <Text fontSize="lg" fontWeight="bold">
                            {formatNaira(productDetails.sellingPrice)}
                          </Text>
                          {productDetails.description && (
                            <Text fontSize="sm" color="gray.600" mt={2}>
                              {productDetails.description}
                            </Text>
                          )}
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
                  loadingText="Changing product..."
                >
                  Change Product
                </Button>
              </form>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ChangeProductModal;
