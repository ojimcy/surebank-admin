import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Select,
  Textarea,
  useColorModeValue,
} from '@chakra-ui/react';
import Card from 'components/card/Card';
import { useForm, useFieldArray } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import { toSentenceCase } from 'utils/helper';

export default function EditProductCatalogue() {
  const { id } = useParams();
  const history = useHistory();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState([]);
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    control,
    formState: { isSubmitting },
  } = useForm();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'variations',
  });

  const fetchProductsCategories = async () => {
    const response = await axiosService.get('/stores/categories');
    setCategories(response.data);
  };

  const fetchProductsBrands = async () => {
    const response = await axiosService.get('/stores/brands');
    setBrands(response.data);
  };

  useEffect(() => {
    fetchProductsCategories();
    fetchProductsBrands();
  }, []);

  useEffect(() => {
    try {
      const fetchProductCatalogue = async () => {
        const response = await axiosService.get(`/products/catalogue/${id}`);
        setProduct(response.data);
      };

      fetchProductCatalogue();
    } catch (error) {
      console.error(error);
    }
  }, [id]);

  const submitHandler = async (productData) => {
    try {
      await axiosService.patch(`/products/catalogue/${id}`, productData);
      toast.success('Product catalogue updated successfully!');
      history.push(`/admin/products/catalogue-details/${id}`);
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
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <Card>
        <Flex>
          <BackButton />
        </Flex>
        <Flex w={{ base: '100%', md: '50%' }} mx="auto" mt="26px">
          <form
            onSubmit={handleSubmit(submitHandler)}
            style={{ width: '100%' }}
          >
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
                Name
              </FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Product Name"
                  defaultValue={product.name}
                  {...register('name')}
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
                Description
              </FormLabel>
              <InputGroup>
                <Textarea
                  type="text"
                  placeholder="Enter Product Description"
                  defaultValue={product.description}
                  {...register('description')}
                />
              </InputGroup>
            </FormControl>

            <FormControl>
              <FormLabel
                htmlFor="variations"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Variations
              </FormLabel>
              {fields.map((variation, index) => (
                <InputGroup key={variation.id}>
                  <Flex
                    gap="20px"
                    marginBottom="20px"
                    flexDirection={{ base: 'column', md: 'row' }}
                  >
                    <Input
                      type="text"
                      placeholder="Variation Name"
                      defaultValue={variation.name}
                      {...register(`variations.${index}.name`)}
                    />
                    <Input
                      type="text"
                      placeholder="Variation Values (comma-separated)"
                      defaultValue={variation.values}
                      {...register(`variations.${index}.values`)}
                    />
                    <Button type="button" onClick={() => remove(index)}>
                      Remove
                    </Button>
                  </Flex>
                </InputGroup>
              ))}
              <Button
                type="button"
                onClick={() => append({ name: '', values: '' })}
              >
                Add Variation
              </Button>
            </FormControl>

            <FormControl>
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
                Brand
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

            <FormControl>
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
                Category
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
                      {toSentenceCase(category?.title)}
                    </option>
                  ))}
              </Select>
            </FormControl>

            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
                <FormControl>
                  <FormLabel
                    htmlFor="costPrice"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="10px"
                  >
                    Cost Price
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      placeholder="Enter Product Cost Price"
                      defaultValue={product.costPrice}
                      {...register('costPrice')}
                    />
                  </InputGroup>
                </FormControl>
              </Box>
              <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
                <FormControl>
                  <FormLabel
                    htmlFor="sellingPrice"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="10px"
                  >
                    Selling Price
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      placeholder="Enter Product Sales Price"
                      defaultValue={product.sellingPrice}
                      {...register('sellingPrice')}
                    />
                  </InputGroup>
                </FormControl>
              </Box>
            </Flex>

            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
                <FormControl>
                  <FormLabel
                    htmlFor="discount"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="10px"
                  >
                    Discount Price
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      placeholder="Enter Product Discount Price"
                      defaultValue={product.discount}
                      {...register('discount')}
                    />
                  </InputGroup>
                </FormControl>
              </Box>
              <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
                <FormControl>
                  <FormLabel
                    htmlFor="quantity"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="10px"
                  >
                    Quantity
                  </FormLabel>
                  <InputGroup>
                    <Input
                      type="number"
                      placeholder="Enter Product Quantity"
                      defaultValue={product.quantity}
                      {...register('quantity')}
                    />
                  </InputGroup>
                </FormControl>
              </Box>
            </Flex>
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
        </Flex>
      </Card>
    </Box>
  );
}
