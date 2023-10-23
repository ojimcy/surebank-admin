import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';

// Chakra imports
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Spinner,
  Text,
  Heading,
  Image,
} from '@chakra-ui/react';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get(`products/catalogue/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <Box>
      {loading ? (
        <Box
          h="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Spinner size="xl" color="blue.500" />
        </Box>
      ) : (
        <Box pt={{ base: '180px', md: '80px', xl: '80px' }}>
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
                    <Flex alignItems="center">
                      <Box px={6} py={4} justifyContent='center'>
                        <Heading fontSize="2xl" mb={4}>
                          {product.name}
                        </Heading>
                        <Image
                          src="assets/img/categories/1.jpg"
                          alt={product.name}
                        />
                        <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                          <Text fontWeight="bold">Name</Text>
                          <Text>{product.name}</Text>
                        </Grid>
                        <NavLink to={`/admin/products/edit/${id}`}>
                          <Button mt={4} colorScheme="blue" size="md">
                            Edit Product
                          </Button>
                        </NavLink>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
