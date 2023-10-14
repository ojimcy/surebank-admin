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
  Image,
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

export default function Catalogue() {
  const history = useHistory();

  const [products, setProducts] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [featuredImagePreview, setFeaturedImagePreview] = useState(null);
  const [imagesPreview, setImagesPreview] = useState([]);

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

  const fetchMerchants = async () => {
    try {
      const response = await axiosService.get('/merchants/');
      setMerchants(response.data.results);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchMerchants();
  }, []);

  const handleFeaturedImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setFeaturedImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const handleImagesChange = (event) => {
    const files = event.target.files;
    const previewImages = [...imagesPreview]; 

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = () => {
        previewImages.push(reader.result); 
        if (previewImages.length === files.length) {
          setImagesPreview(previewImages);
        }
      };
      reader.readAsDataURL(files[i]);
    }
  };

  const submitHandler = async (catalogueData) => {
    try {
      await axiosService.post(`/catalogues`, catalogueData);
      toast.success('Product catalogue created successfully!');
      history.push('/admin/catalogues');
    } catch (error) {
      console.error('Error creating product catalogue:', error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
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
                    placeholder="Select Product"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="merchantId"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="24px"
                  >
                    Merchant<Text>*</Text>
                  </FormLabel>
                  <ReactSelect
                    options={merchants.map((merchant) => ({
                      value: merchant.id,
                      label: `${merchant.storeName}`,
                    }))}
                    placeholder="Select Merchant"
                  />
                </FormControl>
                {/* Featured Image */}
                <FormControl>
                  <FormLabel
                    htmlFor="featuredImage"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                    mt="24px"
                  >
                    Featured Image
                  </FormLabel>
                  <Input
                    type="file"
                    isRequired={true}
                    variant="auth"
                    id="featuredImage"
                    size="lg"
                    onChange={handleFeaturedImageChange}
                    mb="24px"
                  />
                  {featuredImagePreview && (
                    <Box mt="12px">
                      <Text fontSize="sm">Preview:</Text>
                      <Image
                        w="100px"
                        src={featuredImagePreview}
                        alt="Featured Preview"
                      />
                    </Box>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="images"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Images
                  </FormLabel>
                  <Input
                    type="file"
                    isRequired={true}
                    variant="auth"
                    id="images"
                    size="lg"
                    onChange={handleImagesChange}
                    mb="24px"
                    multiple
                  />
                  {imagesPreview.length > 0 && (
                    <Box mt="12px">
                      <Text fontSize="sm">Preview:</Text>
                      <Flex flexWrap="wrap">
                        {imagesPreview.map((preview, index) => (
                          <Box key={index} m="6px">
                            <Image
                              w="100px"
                              src={preview}
                              alt={`Image Preview ${index}`}
                            />
                          </Box>
                        ))}
                      </Flex>
                    </Box>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="salesPrice"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Sales Price
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="number"
                    id="salesPrice"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('salesPrice', {
                      required: 'Sales price is required',
                    })}
                    placeholder="Sales Price"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel
                    htmlFor="price"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    mb="8px"
                  >
                    Price
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="price"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('price', {
                      required: 'Price is required',
                    })}
                    placeholder="Product original price"
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
