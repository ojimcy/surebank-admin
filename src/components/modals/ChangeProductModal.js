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
  FormLabel,
  Grid,
  Text,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import axiosService from 'utils/axiosService';
import { formatNaira } from 'utils/helper';
import CustomSelect from 'components/dataDispaly/CustomSelect';

const ChangeProductModal = ({ isOpen, onClose, onSuccess, packageData }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

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
  const onSubmit = async (formData) => {
    try {
      if (selectedProduct) {
        formData.newProductId = selectedProduct.value;
      }
      await axiosService.patch(
        `/daily-savings/sb/package/${packageData._id}`,
        formData
      );
      console.log(formData);
      toast.success('Product changed successfully!');
      onSuccess();
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
        <ModalHeader>Change product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {packageData && (
            <>
              <Text>Product: {packageData.product.name}</Text>
              <Text mb="8px">
                Price: {formatNaira(packageData.product.sellingPrice)}
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
                      options={products.map((product) => ({
                        value: product.id,
                        label: product.name,
                      }))}
                      onChange={handleProductSelection}
                      placeholder="Select new product"
                    />
                  </FormControl>
                </Grid>
                {selectedProduct && (
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
