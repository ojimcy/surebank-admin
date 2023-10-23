// Chakra imports
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';

// Custom components

// Assets
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { toSentenceCase } from 'utils/helper';

export default function EditProductModal({ isOpen, onClose, product }) {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const fetchProductsCategories = async () => {
    const response = await axiosService.get('/store/categories');
    setCategories(response.data);
  };

  const fetchProductsBrands = async () => {
    const response = await axiosService.get('/store/brands');
    setBrands(response.data);
  };

  useEffect(() => {
    fetchProductsCategories();
    fetchProductsBrands();
  }, []);

  const submitHandler = async (productData) => {
    try {
      await axiosService.patch(`/products/request`, productData);
      toast.success('Product created successfully!');
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
        <ModalHeader>Edit Product</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl>
              <FormLabel
                htmlFor="name"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Name<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Product Name"
                  defaultValue={product.name}
                  {...register('name', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="description"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Description<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Textarea
                  type="text"
                  placeholder="Enter Product Description"
                  defaultValue={product.description}
                  {...register('description', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <FormControl isInvalid={errors.brand}>
              <FormLabel
                htmlFor="brand"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt="10px"
              >
                Brand<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                {...register('brand')}
                name="brand"
                defaultValue={product.brand}
              >
                <option value="" disabled>
                  Select Product Brand
                </option>
                {brands &&
                  brands?.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {toSentenceCase(brand?.name)}
                    </option>
                  ))}
              </Select>
            </FormControl>

            <FormControl isInvalid={errors.category}>
              <FormLabel
                htmlFor="category"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
                mt="10px"
              >
                Category<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                {...register('categoryId')}
                name="categoryId"
                defaultValue={product.category}
              >
                <option value="" disabled>
                  Select Product Category
                </option>
                {categories &&
                  categories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {toSentenceCase(category?.name)}
                    </option>
                  ))}
              </Select>
            </FormControl>
            <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
              <Button
                colorScheme="green"
                variant="solid"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
