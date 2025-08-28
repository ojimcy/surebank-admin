// Chakra imports
import React, { useEffect, useState } from 'react';
import {
  Box,
  Spinner,
  Button,
  Text,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  Stack,
  Input,
  IconButton,
  Badge,
  useColorModeValue,
  InputGroup,
  InputLeftElement,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  SimpleGrid,
  Skeleton,
  Fade,
  ScaleFade,
  Heading,
  Container,
  Divider,
  Tooltip,
  useToast,
  HStack,
  VStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Select,
  Avatar,
} from '@chakra-ui/react';

import { NavLink } from 'react-router-dom';

// Custom components
import { formatMdbDate } from 'utils/helper';

// Assets
import Card from 'components/card/Card.js';
import { SearchIcon, AddIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import BackButton from 'components/menu/BackButton';
import axiosService from 'utils/axiosService';
import CatalogueDetailsModal from 'components/modals/CatalogueDetailsModal';
import { useAuth } from 'contexts/AuthContext';
import { ChevronDownIcon } from '@chakra-ui/icons';
import { FiPackage, FiBox, FiImage, FiEye, FiEdit3, FiShoppingCart } from 'react-icons/fi';

export default function Catalogue() {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productDetailsModal, setProductDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [stats, setStats] = useState({
    total: 0,
    lowStock: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const statCardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.700', 'white');
  const secondaryText = useColorModeValue('gray.500', 'gray.400');
  const tableHeadBg = useColorModeValue('gray.50', 'gray.700');
  const tableHoverBg = useColorModeValue('blue.50', 'blue.900');
  const selectBg = useColorModeValue('white', 'gray.700');

  const fetchProducts = async () => {
    const { pageIndex, pageSize } = pagination;
    try {
      const response = await axiosService.get(
        `/products/catalogue?page=${pageIndex + 1}&limit=${pageSize}`
      );
      console.log('products response:', response.data);
      const productsData = response.data.results || [];
      setProducts(productsData);

      // Update pagination metadata from API response
      setTotalPages(response.data.totalPages || 0);
      setTotalResults(response.data.totalResults || 0);

      // Set total products immediately
      setStats(prev => ({
        ...prev,
        total: response.data.totalResults || productsData.length
      }));

    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: 'Error fetching products',
        description: 'Unable to load products. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchGlobalLowStockCount = async () => {
    setStatsLoading(true);
    try {
      // For 363 products, we can fetch all in one request with a reasonable limit
      // This avoids multiple API calls and gives us accurate global statistics
      const response = await axiosService.get(
        `/products/catalogue?page=1&limit=500`
      );

      const allProducts = response.data.results || [];
      const totalResults = response.data.totalResults || 0;
      let lowStockCount = 0;

      // Count low stock from this batch
      lowStockCount = allProducts.filter(p => p.quantity < 5).length;

      // If there are more products than fetched, we need to get the rest
      if (allProducts.length < totalResults) {
        console.log(`Fetching remaining products: ${totalResults - allProducts.length}`);
        const remainingPages = Math.ceil((totalResults - allProducts.length) / 500);

        const remainingRequests = [];
        for (let page = 2; page <= remainingPages + 1; page++) {
          remainingRequests.push(
            axiosService.get(`/products/catalogue?page=${page}&limit=500`)
          );
        }

        const remainingResponses = await Promise.all(remainingRequests);

        remainingResponses.forEach(res => {
          const products = res.data.results || [];
          lowStockCount += products.filter(p => p.quantity < 5).length;
        });
      }

      console.log(`Global low stock calculation: ${lowStockCount} out of ${totalResults} products`);

      setStats(prev => ({
        ...prev,
        lowStock: lowStockCount
      }));

    } catch (error) {
      console.error('Error fetching global low stock count:', error);
      // Fallback: estimate based on current page ratio
      const currentPageLowStock = products.filter(p => p.quantity < 5).length;
      const estimatedGlobalLowStock = Math.round((currentPageLowStock / products.length) * totalResults);

      setStats(prev => ({
        ...prev,
        lowStock: estimatedGlobalLowStock
      }));

      console.log(`Using estimated low stock count: ${estimatedGlobalLowStock} (based on current page ratio)`);
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  // Fetch global low stock count separately (only on first load)
  useEffect(() => {
    fetchGlobalLowStockCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleNextPage = () => {
    if (pagination.pageIndex < totalPages - 1) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex + 1 }));
    }
  };

  const handlePreviousPage = () => {
    if (pagination.pageIndex > 0) {
      setPagination(prev => ({ ...prev, pageIndex: prev.pageIndex - 1 }));
    }
  };

  const handlePageSizeChange = (newPageSize) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize });
  };

  const closeModalAndResetProduct = () => {
    setSelectedProduct(null);
    setProductDetailsModal(false);
  };


  // Enhanced columns with better styling
  const baseColumns = [
    {
      Header: 'Product',
      accessor: (row) => (
        <HStack spacing={{ base: 1, md: 2, lg: 4 }} align="center" w="full">
          <Avatar
            size={{ base: 'xs', md: 'sm', lg: 'md' }}
            src={row.images && row.images[0] ? row.images[0] : ''}
            icon={<FiImage />}
            bg="gray.100"
            color="gray.400"
            borderRadius="lg"
            flexShrink={0}
          />
          <VStack align="start" spacing={{ base: 0, md: 1 }} flex="1" minW="0">
            <NavLink to={`/admin/products/catalogue-details/${row.id}`}>
              <Text
                fontWeight="bold"
                fontSize={{ base: 'sm', md: 'md' }}
                color={textColor}
                _hover={{ color: 'blue.500', textDecoration: 'underline' }}
                transition="all 0.2s"
                noOfLines={1}
              >
                {row.name || 'Unnamed Product'}
              </Text>
            </NavLink>
            <Text fontSize={{ base: 'xs', md: 'sm' }} color={secondaryText} noOfLines={1} display={{ base: 'none', md: 'block' }}>
              {row.description || 'No description available'}
            </Text>
            {row.productId?.brand && (
              <Badge colorScheme="gray" size="sm" variant="subtle">
                {typeof row.productId.brand === 'object' ? row.productId.brand.name : row.productId.brand}
              </Badge>
            )}
          </VStack>
        </HStack>
      ),
    },
    // Include "Cost Price" column before "Selling Price"
    currentUser.role === 'admin' || currentUser.role === 'superAdmin'
      ? {
        Header: 'Cost Price',
        accessor: (row) => (
          <VStack align="start" spacing={1}>
            <Text fontWeight="semibold" color="orange.500" fontSize="md">
              ₦{row.costPrice?.toLocaleString() || '0'}
            </Text>
            <Text fontSize="xs" color={secondaryText}>
              Cost
            </Text>
          </VStack>
        ),
      }
      : null,
    {
      Header: 'Selling Price',
      accessor: (row) => (
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="lg" color="green.500">
            ₦{row.sellingPrice?.toLocaleString() || '0'}
          </Text>
          <Text fontSize="xs" color={secondaryText}>
            Retail Price
          </Text>
        </VStack>
      ),
    },
    {
      Header: 'Discount',
      accessor: (row) => (
        <VStack align="start" spacing={1}>
          <Badge
            colorScheme={row.discount > 0 ? "purple" : "gray"}
            fontSize="sm"
            px={3}
            py={1}
            borderRadius="full"
            variant="subtle"
          >
            ₦{row.discount?.toLocaleString() || '0'}
          </Badge>
          {row.discount > 0 && (
            <Text fontSize="xs" color="purple.500">
              Savings available
            </Text>
          )}
        </VStack>
      ),
    },
    {
      Header: 'Stock',
      accessor: (row) => (
        <VStack align="center" spacing={2}>
          <Badge
            colorScheme={row.quantity > 10 ? 'green' : row.quantity > 5 ? 'yellow' : 'red'}
            fontSize="lg"
            px={4}
            py={2}
            borderRadius="full"
            fontWeight="bold"
          >
            {row.quantity || 0}
          </Badge>
          <HStack spacing={1}>
            <Icon as={FiShoppingCart} w={3} h={3} color={secondaryText} />
            <Text fontSize="xs" color={secondaryText}>
              {row.quantity > 10 ? 'In Stock' : row.quantity > 5 ? 'Low Stock' : 'Critical'}
            </Text>
          </HStack>
          {row.quantity < 5 && (
            <Tooltip label="Critical stock level!" placement="top">
              <Badge colorScheme="red" variant="solid" size="sm">
                ⚠️ Alert
              </Badge>
            </Tooltip>
          )}
        </VStack>
      ),
    },
    {
      Header: 'Date Added',
      accessor: (row) => (
        <VStack align="start" spacing={0}>
          <Text fontSize="sm" fontWeight="medium">
            {formatMdbDate(row.createdAt)}
          </Text>
          <Text fontSize="xs" color={secondaryText}>
            {new Date(row.createdAt).toLocaleTimeString()}
          </Text>
        </VStack>
      ),
    },
    {
      Header: 'Actions',
      accessor: (row) => (
        <VStack spacing={{ base: 1, md: 2 }}>
          <HStack spacing={{ base: 0.5, md: 1 }}>
            <Tooltip label="View Details" placement="top">
              <NavLink to={`/admin/products/catalogue-details/${row.id}`}>
                <IconButton
                  aria-label="View"
                  icon={<FiEye />}
                  size={{ base: 'xs', md: 'sm' }}
                  colorScheme="blue"
                  variant="solid"
                  _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                  transition="all 0.2s"
                  borderRadius="lg"
                />
              </NavLink>
            </Tooltip>
            <Tooltip label="Edit Product" placement="top">
              <NavLink to={`/admin/products/catalogue-details/${row.id}`}>
                <IconButton
                  aria-label="Edit"
                  icon={<FiEdit3 />}
                  size={{ base: 'xs', md: 'sm' }}
                  colorScheme="teal"
                  variant="solid"
                  _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                  transition="all 0.2s"
                  borderRadius="lg"
                />
              </NavLink>
            </Tooltip>
          </HStack>
          <Text fontSize="xs" color={secondaryText} textAlign="center" display={{ base: 'none', md: 'block' }}>
            Quick Actions
          </Text>
        </VStack>
      ),
    },
  ];

  const columns = React.useMemo(
    () => baseColumns.filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser.role]
  );

  // Filter products based on search term
  useEffect(() => {
    if (!products) {
      return;
    }

    const filtered = products?.filter((product) => {
      const productName = `${product.name} `.toLowerCase();
      return productName.includes(searchTerm.toLowerCase());
    });
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  return (
    <Box
      pt={{ base: '70px', md: '80px', xl: '80px' }}
      bg={useColorModeValue('gray.50', 'gray.900')}
      minH="100vh"
    >
      <Container maxW="container.2xl" px={{ base: 2, md: 2, lg: 8 }}>
        {/* Statistics Cards */}
        <ScaleFade in={!loading} initialScale={0.9}>
          <SimpleGrid
            columns={{ base: 1, sm: 2 }}
            spacing={{ base: 2, md: 4, lg: 6 }}
            mb={{ base: 4, md: 6, lg: 8 }}
          >
            <Card
              p={{ base: 4, md: 5, lg: 6 }}
              bg={statCardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Stat>
                <StatLabel color={secondaryText}>
                  <HStack>
                    <Icon as={FiPackage} />
                    <Text>Total Products</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="3xl" color={textColor}>
                  {loading ? <Skeleton height="40px" /> : stats.total}
                </StatNumber>
                <StatHelpText color="green.500">Active items</StatHelpText>
              </Stat>
            </Card>

            <Card
              p={{ base: 4, md: 5, lg: 6 }}
              bg={statCardBg}
              borderWidth="1px"
              borderColor={borderColor}
              _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
              transition="all 0.3s"
            >
              <Stat>
                <StatLabel color={secondaryText}>
                  <HStack>
                    <Icon as={FiBox} />
                    <Text>Low Stock</Text>
                  </HStack>
                </StatLabel>
                <StatNumber fontSize="3xl" color={stats.lowStock > 0 ? 'red.500' : textColor}>
                  {statsLoading ? <Skeleton height="40px" /> : stats.lowStock}
                </StatNumber>
                <StatHelpText color="orange.500">
                  Items below 5 units
                </StatHelpText>
              </Stat>
            </Card>
          </SimpleGrid>
        </ScaleFade>

        {/* Main Content Card */}
        <Fade in={!loading}>
          <Card
            p={{ base: '12px', md: '20px', lg: '30px' }}
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="xl"
            shadow="lg"
          >
            <BackButton />
            <Stack
              direction={{ base: 'column', lg: 'row' }}
              justifyContent="space-between"
              align={{ base: 'start', lg: 'center' }}
              mb={{ base: 4, md: 6, lg: 8 }}
              spacing={{ base: 3, md: 4, lg: 6 }}
            >
              <VStack align={{ base: 'center', md: 'start' }} spacing={1} textAlign={{ base: 'center', md: 'left' }}>
                <Heading size={{ base: 'md', md: 'lg' }} color={textColor}>
                  Product Catalog
                </Heading>
                <Text color={secondaryText} fontSize="sm">
                  Manage your inventory and product listings
                </Text>
              </VStack>

              <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: 2, md: 3 }} w={{ base: 'full', lg: 'auto' }}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    colorScheme="blue"
                    size={{ base: 'md', md: 'md' }}
                    w={{ base: 'full', sm: 'auto' }}
                    _hover={{ transform: 'translateY(-2px)', shadow: 'md' }}
                    transition="all 0.2s"
                  >
                    <HStack spacing={2} justify="center">
                      <AddIcon />
                      <Text>Manage Products</Text>
                    </HStack>
                  </MenuButton>
                  <MenuList>
                    {currentUser.role === 'superAdmin' ||
                      currentUser.role === 'admin' ? (
                      <>
                        <MenuItem>
                          <NavLink to="/admin/products/catalogue/create">
                            Add Product
                          </NavLink>
                        </MenuItem>
                        <MenuItem>
                          <NavLink to="/admin/products/requests">
                            Product Requests
                          </NavLink>
                        </MenuItem>
                        <MenuItem>
                          <NavLink to="/admin/products/sb-products">
                            Selected SB Products
                          </NavLink>
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem>
                        <NavLink to="/admin/products/sb-products">
                          Selected SB Products
                        </NavLink>
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>

                <InputGroup w={{ base: 'full', sm: 'auto' }} maxW={{ base: '100%', md: '300px' }}>
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color={secondaryText} />
                  </InputLeftElement>
                  <Input
                    type="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    borderRadius="full"
                    bg={useColorModeValue('white', 'gray.700')}
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px rgba(66, 153, 225, 0.6)',
                    }}
                  />
                </InputGroup>
              </Stack>
            </Stack>

            <Divider mb={{ base: 3, md: 4, lg: 6 }} />

            <Box>
              {loading ? (
                <VStack spacing={4} py={{ base: 6, md: 8, lg: 10 }}>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                  />
                  <Text color={secondaryText}>Loading products...</Text>
                  <Stack spacing={3} w="full">
                    <Skeleton height="60px" borderRadius="md" />
                    <Skeleton height="60px" borderRadius="md" />
                    <Skeleton height="60px" borderRadius="md" />
                  </Stack>
                </VStack>
              ) : filteredProducts.length === 0 ? (
                <VStack spacing={4} py={{ base: 10, md: 15, lg: 20 }}>
                  <Icon as={FiPackage} w={16} h={16} color={secondaryText} />
                  <Heading size="md" color={textColor}>
                    {searchTerm ? 'No products found' : 'No products available'}
                  </Heading>
                  <Text color={secondaryText} textAlign="center" maxW="md">
                    {searchTerm
                      ? `No products match your search "${searchTerm}"`
                      : 'Start by adding your first product to the catalog'}
                  </Text>
                  {(currentUser.role === 'admin' || currentUser.role === 'superAdmin') && !searchTerm && (
                    <NavLink to="/admin/products/catalogue/create">
                      <Button
                        colorScheme="blue"
                        size="lg"
                        leftIcon={<AddIcon />}
                        _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                        transition="all 0.2s"
                      >
                        Add First Product
                      </Button>
                    </NavLink>
                  )}
                </VStack>
              ) : (
                <VStack spacing={4}>
                  <Box
                    overflowX={{ base: 'auto', lg: 'visible' }}
                    w="full"
                    css={{
                      '&::-webkit-scrollbar': {
                        height: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '10px',
                      },
                      '&::-webkit-scrollbar-thumb:hover': {
                        background: '#555',
                      },
                    }}
                  >
                    <TableContainer
                      bg={cardBg}
                      borderRadius="xl"
                      shadow="sm"
                      border="1px"
                      borderColor={borderColor}
                    >
                      <Table variant="simple" size={{ base: 'sm', md: 'md', lg: 'lg' }}>
                        <Thead bg={tableHeadBg}>
                          <Tr>
                            {columns.map((column, index) => (
                              <Th
                                key={index}
                                py={{ base: 2, md: 3, lg: 4 }}
                                px={{ base: 1, md: 3, lg: 4 }}
                                fontWeight="bold"
                                fontSize={{ base: 'xs', md: 'sm' }}
                                textTransform="uppercase"
                                letterSpacing="wide"
                                color={textColor}
                                borderColor={borderColor}
                              >
                                {column.Header}
                              </Th>
                            ))}
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredProducts.map((product, index) => (
                            <Tr
                              key={product.id || index}
                              _hover={{
                                bg: tableHoverBg,
                                transform: 'translateY(-2px)',
                                shadow: 'md',
                                borderColor: 'blue.200'
                              }}
                              transition="all 0.2s ease-in-out"
                              cursor="pointer"
                            >
                              {columns.map((column, colIndex) => (
                                <Td
                                  key={colIndex}
                                  py={{ base: 2, md: 3, lg: 4 }}
                                  px={{ base: 1, md: 3, lg: 4 }}
                                  borderColor={borderColor}
                                  verticalAlign="top"
                                >
                                  {column.accessor(product)}
                                </Td>
                              ))}
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>

                  {/* Enhanced Server-side Pagination Controls */}
                  <Card
                    mt={{ base: 3, md: 4, lg: 6 }}
                    p={{ base: 3, md: 4, lg: 6 }}
                    bg={cardBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    borderRadius="xl"
                    shadow="sm"
                  >
                    <Stack
                      direction={{ base: 'column', lg: 'row' }}
                      justifyContent="space-between"
                      alignItems={{ base: 'stretch', lg: 'center' }}
                      w="full"
                      spacing={{ base: 3, md: 4 }}
                    >
                      <VStack align={{ base: 'center', lg: 'start' }} spacing={{ base: 1, md: 2 }}>
                        <HStack spacing={{ base: 1, md: 2 }} justify="center">
                          <Tooltip label="Previous Page" placement="top">
                            <IconButton
                              onClick={handlePreviousPage}
                              isDisabled={pagination.pageIndex === 0}
                              icon={<ChevronLeftIcon h={4} w={4} />}
                              size={{ base: 'sm', md: 'md' }}
                              colorScheme="blue"
                              variant="outline"
                              borderRadius="lg"
                              _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                              transition="all 0.2s"
                            />
                          </Tooltip>

                          <Badge
                            colorScheme="blue"
                            fontSize={{ base: 'sm', md: 'md' }}
                            px={{ base: 3, md: 4 }}
                            py={2}
                            borderRadius="full"
                            fontWeight="bold"
                          >
                            Page {pagination.pageIndex + 1} of {totalPages}
                          </Badge>

                          <Tooltip label="Next Page" placement="top">
                            <IconButton
                              onClick={handleNextPage}
                              isDisabled={pagination.pageIndex >= totalPages - 1}
                              icon={<ChevronRightIcon h={4} w={4} />}
                              size={{ base: 'sm', md: 'md' }}
                              colorScheme="blue"
                              variant="outline"
                              borderRadius="lg"
                              _hover={{ transform: 'scale(1.05)', shadow: 'md' }}
                              transition="all 0.2s"
                            />
                          </Tooltip>
                        </HStack>
                        <Text fontSize={{ base: 'xs', md: 'sm' }} color={secondaryText} textAlign="center">
                          Navigate through pages
                        </Text>
                      </VStack>

                      <VStack align={{ base: 'center', lg: 'end' }} spacing={{ base: 1, md: 2 }}>
                        <Stack direction={{ base: 'column', sm: 'row' }} spacing={{ base: 2, md: 3 }} align="center">
                          <Text fontSize={{ base: 'xs', md: 'sm' }} color={textColor} fontWeight="medium" textAlign="center">
                            Showing {((pagination.pageIndex) * pagination.pageSize) + 1} to{' '}
                            {Math.min((pagination.pageIndex + 1) * pagination.pageSize, totalResults)} of{' '}
                            <Text as="span" fontWeight="bold" color="blue.500">
                              {totalResults}
                            </Text> products
                          </Text>
                          <Select
                            value={pagination.pageSize}
                            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                            size={{ base: 'sm', md: 'md' }}
                            w={{ base: 'full', sm: 'auto' }}
                            minW="120px"
                            borderRadius="lg"
                            bg={selectBg}
                            _focus={{ borderColor: 'blue.500', shadow: 'outline' }}
                          >
                            <option value={10}>10 per page</option>
                            <option value={20}>20 per page</option>
                            <option value={50}>50 per page</option>
                            <option value={100}>100 per page</option>
                          </Select>
                        </Stack>
                        <Text fontSize="xs" color={secondaryText} textAlign="center">
                          Items per page
                        </Text>
                      </VStack>
                    </Stack>
                  </Card>
                </VStack>
              )}
            </Box>
          </Card>
        </Fade>
      </Container>

      {selectedProduct && (
        <CatalogueDetailsModal
          isOpen={productDetailsModal}
          onClose={closeModalAndResetProduct}
          product={selectedProduct}
        />
      )}
    </Box>
  );
}