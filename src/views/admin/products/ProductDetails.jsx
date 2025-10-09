import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
  VStack,
  HStack,
  Image,
  IconButton,
  Heading,
  Divider,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Skeleton,
  SkeletonText,
  Container,
  Tooltip,
  Icon,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
  Center,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Wrap,
  WrapItem,
  Tag,
  TagLabel,
  TagLeftIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { Link, useParams, useHistory } from 'react-router-dom';
import {
  FiEdit3,
  FiTrash2,
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiCalendar,
  FiImage,
  FiCheck,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiTag
} from 'react-icons/fi';
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';
import { useAuth } from 'contexts/AuthContext';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { formatMdbDate } from 'utils/helper';

export default function ProductDetails() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const history = useHistory();
  const toast = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Delete confirmation dialog
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const statBg = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get(`/products/catalogue/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      history.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosService.delete(`/products/catalogue/${id}`);
      toast({
        title: 'Product Deleted',
        description: 'The product has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      history.push('/admin/products');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete the product',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    onClose();
  };

  const handleImageNavigation = (direction) => {
    const totalImages = product.images?.length || 0;
    if (totalImages === 0) return;

    if (direction === 'prev') {
      setSelectedImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
    } else {
      setSelectedImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
    }
  };

  const getStockBadgeColor = (quantity) => {
    if (quantity > 10) return 'green';
    if (quantity > 5) return 'yellow';
    return 'red';
  };

  const getStockStatus = (quantity) => {
    if (quantity > 10) return 'In Stock';
    if (quantity > 5) return 'Low Stock';
    if (quantity > 0) return 'Critical';
    return 'Out of Stock';
  };

  if (loading) {
    return (
      <Box pt={{ base: '70px', md: '80px', xl: '80px' }}>
        <Container maxW="container.xl">
          <Card bg={bgColor} p={8}>
            <VStack spacing={4}>
              <Skeleton height="300px" width="100%" />
              <SkeletonText mt="4" noOfLines={4} spacing="4" />
            </VStack>
          </Card>
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box pt={{ base: '70px', md: '80px', xl: '80px' }}>
        <Container maxW="container.xl">
          <Card bg={bgColor} p={8}>
            <Center>
              <VStack spacing={4}>
                <Icon as={FiPackage} boxSize={16} color={mutedColor} />
                <Heading size="md">Product not found</Heading>
                <Link to="/admin/products">
                  <Button colorScheme="blue">Back to Products</Button>
                </Link>
              </VStack>
            </Center>
          </Card>
        </Container>
      </Box>
    );
  }

  const allImages = product.images || [];
  const displayImage = allImages[selectedImageIndex] || product.featuredImage || '';

  return (
    <Box pt={{ base: '70px', md: '80px', xl: '80px' }}>
      <Container maxW="container.xl">
        <Card bg={bgColor} shadow="lg" borderRadius="lg">
          <Box p={{ base: 4, md: 6, lg: 8 }}>
            <BackButton />

            {/* Header Section */}
            <Flex justify="space-between" align="center" mb={6}>
              <VStack align="start" spacing={2}>
                <Heading size="xl">{product.name}</Heading>
                <HStack spacing={3}>
                  <Badge
                    colorScheme={getStockBadgeColor(product.quantity)}
                    fontSize="md"
                    px={3}
                    py={1}
                  >
                    {getStockStatus(product.quantity)} ({product.quantity} units)
                  </Badge>
                  {product.isSbAvailable && (
                    <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                      <Icon as={FiCheck} mr={1} />
                      Available on Surebank
                    </Badge>
                  )}
                </HStack>
              </VStack>

              <HStack spacing={3}>
                <Link to={`/admin/products/catalogue/edit/${id}`}>
                  <Button
                    leftIcon={<FiEdit3 />}
                    colorScheme="blue"
                    size="md"
                  >
                    Edit Product
                  </Button>
                </Link>
                {(currentUser.role === 'admin' || currentUser.role === 'superAdmin') && (
                  <Tooltip label="Delete Product">
                    <IconButton
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="outline"
                      onClick={onOpen}
                      size="md"
                    />
                  </Tooltip>
                )}
              </HStack>
            </Flex>

            <Divider mb={6} />

            <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
              {/* Image Gallery Section */}
              <GridItem>
                <VStack spacing={4} align="stretch">
                  {/* Main Image Display */}
                  <Box
                    position="relative"
                    borderRadius="lg"
                    overflow="hidden"
                    bg={statBg}
                    border="1px solid"
                    borderColor={borderColor}
                    h="400px"
                    cursor="pointer"
                    onClick={() => setIsImageModalOpen(true)}
                  >
                    {displayImage ? (
                      <>
                        <Image
                          src={displayImage}
                          alt={product.name}
                          objectFit="contain"
                          w="100%"
                          h="100%"
                        />
                        <IconButton
                          position="absolute"
                          top={4}
                          right={4}
                          icon={<FiMaximize2 />}
                          size="sm"
                          colorScheme="blackAlpha"
                          aria-label="Expand image"
                        />
                      </>
                    ) : (
                      <Center h="100%">
                        <VStack>
                          <Icon as={FiImage} boxSize={16} color={mutedColor} />
                          <Text color={mutedColor}>No image available</Text>
                        </VStack>
                      </Center>
                    )}

                    {/* Image Navigation */}
                    {allImages.length > 1 && (
                      <>
                        <IconButton
                          position="absolute"
                          left={2}
                          top="50%"
                          transform="translateY(-50%)"
                          icon={<FiChevronLeft />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageNavigation('prev');
                          }}
                          colorScheme="blackAlpha"
                          size="sm"
                          borderRadius="full"
                        />
                        <IconButton
                          position="absolute"
                          right={2}
                          top="50%"
                          transform="translateY(-50%)"
                          icon={<FiChevronRight />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageNavigation('next');
                          }}
                          colorScheme="blackAlpha"
                          size="sm"
                          borderRadius="full"
                        />
                      </>
                    )}
                  </Box>

                  {/* Thumbnail Gallery */}
                  {allImages.length > 0 && (
                    <Box>
                      <Text fontSize="sm" fontWeight="bold" mb={2}>
                        Product Images ({allImages.length})
                      </Text>
                      <SimpleGrid columns={5} spacing={2}>
                        {allImages.map((image, index) => (
                          <Box
                            key={index}
                            borderRadius="md"
                            overflow="hidden"
                            border="2px solid"
                            borderColor={selectedImageIndex === index ? 'blue.500' : borderColor}
                            cursor="pointer"
                            onClick={() => setSelectedImageIndex(index)}
                            transition="all 0.2s"
                            _hover={{ borderColor: 'blue.400' }}
                          >
                            <Image
                              src={image}
                              alt={`Product ${index + 1}`}
                              objectFit="cover"
                              h="80px"
                              w="100%"
                            />
                            {product.featuredImage === image && (
                              <Badge
                                position="absolute"
                                top={1}
                                left={1}
                                colorScheme="blue"
                                fontSize="xs"
                              >
                                Featured
                              </Badge>
                            )}
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}
                </VStack>
              </GridItem>

              {/* Product Details Section */}
              <GridItem>
                <VStack spacing={6} align="stretch">
                  {/* Pricing Information */}
                  <Card bg={statBg} p={6} borderRadius="lg">
                    <StatGroup>
                      <Stat>
                        <StatLabel color={mutedColor}>Cost Price</StatLabel>
                        <StatNumber color="orange.500" fontSize="2xl">
                          ₦{product.costPrice?.toLocaleString() || '0'}
                        </StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel color={mutedColor}>Selling Price</StatLabel>
                        <StatNumber color="green.500" fontSize="2xl">
                          ₦{product.sellingPrice?.toLocaleString() || '0'}
                        </StatNumber>
                      </Stat>
                      {product.discount > 0 && (
                        <Stat>
                          <StatLabel color={mutedColor}>Discount</StatLabel>
                          <StatNumber color="purple.500" fontSize="2xl">
                            ₦{product.discount?.toLocaleString()}
                          </StatNumber>
                        </Stat>
                      )}
                    </StatGroup>

                    {/* Profit Margin */}
                    {(currentUser.role === 'admin' || currentUser.role === 'superAdmin') && (
                      <Box mt={4} pt={4} borderTop="1px solid" borderColor={borderColor}>
                        <HStack justify="space-between">
                          <Text fontWeight="medium">Profit Margin:</Text>
                          <Badge colorScheme="teal" fontSize="md" px={3} py={1}>
                            ₦{((product.sellingPrice || 0) - (product.costPrice || 0)).toLocaleString()}
                            {' '}({(((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(1)}%)
                          </Badge>
                        </HStack>
                      </Box>
                    )}
                  </Card>

                  {/* Description */}
                  <Box>
                    <Heading size="md" mb={3}>Description</Heading>
                    <Text color={textColor} fontSize="md" lineHeight="tall">
                      {showFullDescription || product.description?.length <= 200
                        ? product.description
                        : `${product.description?.substring(0, 200)}...`}
                    </Text>
                    {product.description?.length > 200 && (
                      <Button
                        variant="link"
                        colorScheme="blue"
                        size="sm"
                        mt={2}
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? 'Show less' : 'Read more'}
                      </Button>
                    )}
                  </Box>

                  {/* Tags */}
                  {product.tags && product.tags.length > 0 && (
                    <Box>
                      <Heading size="md" mb={3}>Tags</Heading>
                      <Wrap>
                        {product.tags.map((tag, index) => (
                          <WrapItem key={index}>
                            <Tag size="lg" colorScheme="blue" borderRadius="full">
                              <TagLeftIcon as={FiTag} />
                              <TagLabel>{tag}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}

                  {/* Additional Information */}
                  <Box>
                    <Heading size="md" mb={3}>Additional Information</Heading>
                    <TableContainer>
                      <Table size="sm" variant="simple">
                        <Tbody>
                          <Tr>
                            <Td fontWeight="medium" color={mutedColor}>Product ID</Td>
                            <Td>{product._id || product.id}</Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="medium" color={mutedColor}>Created Date</Td>
                            <Td>{formatMdbDate(product.createdAt)}</Td>
                          </Tr>
                          <Tr>
                            <Td fontWeight="medium" color={mutedColor}>Last Updated</Td>
                            <Td>{formatMdbDate(product.updatedAt)}</Td>
                          </Tr>
                          {product.merchantId && (
                            <Tr>
                              <Td fontWeight="medium" color={mutedColor}>Merchant</Td>
                              <Td>
                                {typeof product.merchantId === 'object'
                                  ? product.merchantId.name
                                  : product.merchantId}
                              </Td>
                            </Tr>
                          )}
                          {product.productId?.brand && (
                            <Tr>
                              <Td fontWeight="medium" color={mutedColor}>Brand</Td>
                              <Td>
                                {typeof product.productId.brand === 'object'
                                  ? product.productId.brand.name
                                  : product.productId.brand}
                              </Td>
                            </Tr>
                          )}
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Box>
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        </Card>
      </Container>

      {/* Image Modal */}
      <Modal isOpen={isImageModalOpen} onClose={() => setIsImageModalOpen(false)} size="6xl">
        <ModalOverlay />
        <ModalContent bg="transparent" boxShadow="none">
          <ModalCloseButton color="white" bg="blackAlpha.600" borderRadius="full" />
          <ModalBody p={0}>
            <Box position="relative">
              <Image
                src={displayImage}
                alt={product.name}
                objectFit="contain"
                maxH="90vh"
                w="100%"
              />
              {allImages.length > 1 && (
                <>
                  <IconButton
                    position="absolute"
                    left={4}
                    top="50%"
                    transform="translateY(-50%)"
                    icon={<FiChevronLeft />}
                    onClick={() => handleImageNavigation('prev')}
                    colorScheme="blackAlpha"
                    size="lg"
                    borderRadius="full"
                  />
                  <IconButton
                    position="absolute"
                    right={4}
                    top="50%"
                    transform="translateY(-50%)"
                    icon={<FiChevronRight />}
                    onClick={() => handleImageNavigation('next')}
                    colorScheme="blackAlpha"
                    size="lg"
                    borderRadius="full"
                  />
                </>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}