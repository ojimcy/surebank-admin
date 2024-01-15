// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Text,
  Textarea,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

// Custom components
import ReactSelect from 'react-select';

// Assets
import Card from 'components/card/Card.js';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';

export default function CreateCatalogue() {
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  const fetchProducts = async () => {
    try {
      const response = await axiosService.get('/products/');
      setProducts(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSelectedProduct = (option) => {
    setSelectedProduct(option);
  };

  const submitHandler = async (catalogueData) => {
    try {
      if (selectedProduct) {
        catalogueData.productId = selectedProduct.value;
      }
      await axiosService.post(`/products/catalogue`, catalogueData);
      toast.success('Product catalogue created successfully!');
      history.push('/admin/products/catalogue');
    } catch (error) {
      console.error('Error creating product catalogue:', error);
      toast.error('Something went wrong. Please try again later.');
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
          <Text marginBottom="20px" fontSize="3xl" fontWeight="bold">
            Create Product Catalogue
          </Text>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl>
                  <FormLabel
                    htmlFor="product"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Product<Text>*</Text>
                  </FormLabel>
                  <ReactSelect
                    options={products.map((product) => ({
                      value: product.id,
                      label: `${product.name}`,
                    }))}
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        color: 'black',
                      }),
                      singleValue: (provided) => ({
                        ...provided,
                        color: 'black',
                      }),
                    }}
                    onChange={handleSelectedProduct}
                    placeholder="Select Product"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="name"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="24px"
                  >
                    Name
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="name"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('name', {
                      required: 'Product name is required',
                    })}
                    placeholder="Product Name"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="description"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Description
                  </FormLabel>
                  <Textarea
                    isRequired={true}
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="description"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('description', {
                      required: 'Product description is required',
                    })}
                    placeholder="Product description"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="costPrice"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Cost Price
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="costPrice"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('costPrice', {
                      required: 'Cost price is required',
                    })}
                    placeholder="Product cost price"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="sellingPrice"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Selling Price
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="number"
                    id="sellingPrice"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('sellingPrice', {
                      required: 'Sales price is required',
                    })}
                    placeholder="Sales Price"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel
                    htmlFor="discount"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Discount Price (optional)
                  </FormLabel>
                  <Input
                    isRequired={false}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="discount"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('discount')}
                    placeholder="Product discount price"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="quantity"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Quantity
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="quantity"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('quantity', {
                      required: 'Quantity is required',
                    })}
                    placeholder="Quantity in stock"
                  />
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
        </Card>
      </Grid>
    </Box>
  );
}
