import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Switch,
  VStack,
  HStack,
  Text,
  Image,
  Icon,
  IconButton,
  useToast,
  FormErrorMessage,
  Grid,
  GridItem,
  Badge,
  Tooltip,
  useColorModeValue,
  Divider,
  Heading,
  SimpleGrid,
  Alert,
  AlertIcon,
  Progress,
  CloseButton,
  Center,
  Spinner,
  Container,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { FiUpload, FiTrash2, FiImage, FiX, FiCheck, FiStar, FiMove } from 'react-icons/fi';
import { useHistory, useParams } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import Card from 'components/card/Card.js';
import BackButton from 'components/menu/BackButton';

const ProductForm = ({ isEdit = false }) => {
  const { id } = useParams();
  const history = useHistory();
  const toast = useToast();
  const fileInputRef = useRef(null);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'white');
  const mutedColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sellingPrice: 0,
    costPrice: 0,
    discount: 0,
    quantity: 0,
    featuredImage: '',
    images: [],
    tags: [],
    isSbAvailable: true,
  });

  const [errors, setErrors] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Fetch existing product data if editing
  useEffect(() => {
    if (isEdit && id) {
      fetchProductData();
    }
  }, [isEdit, id]);

  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await axiosService.get(`/products/catalogue/${id}`);
      const product = response.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        sellingPrice: product.sellingPrice || 0,
        costPrice: product.costPrice || 0,
        discount: product.discount || 0,
        quantity: product.quantity || 0,
        featuredImage: product.featuredImage || '',
        images: product.images || [],
        tags: product.tags || [],
        isSbAvailable: product.isSbAvailable !== undefined ? product.isSbAvailable : true,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product data',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const uploadImageToS3 = async (file, index) => {
    try {
      // First, get presigned URL from backend
      const presignedResponse = await axiosService.post('/s3/presigned-url', {
        contentType: file.type,
        fileName: file.name,
        documentType: 'product-images',
      });

      const { url, key } = presignedResponse.data;
      console.log('Presigned URL received:', { url, key });

      // Upload to S3 using presigned URL - Use fetch for S3 upload to avoid axios interceptors
      const uploadResponse = await fetch(url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error(`Failed to upload to S3: ${uploadResponse.status} ${uploadResponse.statusText}`);
      }

      // Track upload progress (simulated since fetch doesn't support progress)
      setUploadProgress((prev) => ({
        ...prev,
        [index]: 100,
      }));

      // Construct the public URL from the presigned URL
      // Parse the presigned URL to extract bucket and region
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;

      // Extract bucket and region from hostname
      // Format: bucket.s3.region.amazonaws.com (e.g., surebank-kyc-documents.s3.us-east-1.amazonaws.com)
      const parts = hostname.split('.');
      const bucket = parts[0]; // surebank-kyc-documents
      const region = parts[2]; // us-east-1

      // Construct the public URL using the bucket, region, and key
      const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
      console.log('Constructed image URL:', fileUrl);

      // Return the constructed URL immediately for preview
      // The image should be accessible since we just uploaded it
      return fileUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);
    const newImages = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: 'Invalid file type',
            description: `${file.name} is not an image file`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          continue;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds 5MB limit`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          continue;
        }

        const imageUrl = await uploadImageToS3(file, i);
        newImages.push(imageUrl);
      }

      // Update form data with new images
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
        // Set first image as featured if no featured image exists
        featuredImage: !prev.featuredImage && newImages.length > 0 ? newImages[0] : prev.featuredImage,
      }));

      toast({
        title: 'Success',
        description: `${newImages.length} image(s) uploaded successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload images. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
      setUploadProgress({});
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      const removedImage = prev.images[index];

      // If removed image was featured, set new featured image
      let newFeaturedImage = prev.featuredImage;
      if (removedImage === prev.featuredImage) {
        newFeaturedImage = newImages.length > 0 ? newImages[0] : '';
      }

      return {
        ...prev,
        images: newImages,
        featuredImage: newFeaturedImage,
      };
    });
  };

  const setAsFeatured = (imageUrl) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: imageUrl,
    }));

    toast({
      title: 'Featured image updated',
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }
    if (formData.sellingPrice <= 0) {
      newErrors.sellingPrice = 'Selling price must be greater than 0';
    }
    if (formData.costPrice <= 0) {
      newErrors.costPrice = 'Cost price must be greater than 0';
    }
    if (formData.quantity < 0) {
      newErrors.quantity = 'Quantity cannot be negative';
    }
    if (formData.discount < 0) {
      newErrors.discount = 'Discount cannot be negative';
    }
    if (formData.discount >= formData.sellingPrice) {
      newErrors.discount = 'Discount must be less than selling price';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const endpoint = isEdit
        ? `/products/catalogue/${id}`
        : '/products/catalogue';

      const method = isEdit ? 'patch' : 'post';

      const response = await axiosService[method](endpoint, formData);

      toast({
        title: 'Success',
        description: `Product ${isEdit ? 'updated' : 'created'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to product details or list
      history.push(`/admin/products/catalogue-details/${response.data._id || response.data.id}`);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} product`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const draggedImage = formData.images[draggedIndex];
    const newImages = [...formData.images];

    // Remove dragged item and insert at new position
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);

    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));

    setDraggedIndex(null);
  };

  if (loading && isEdit) {
    return (
      <Center h="100vh">
        <VStack>
          <Spinner size="xl" color="blue.500" />
          <Text>Loading product data...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <Box pt={{ base: '70px', md: '80px', xl: '80px' }} px={{ base: 4, md: 8 }}>
      <Container maxW="container.xl">
        <Card bg={bgColor} shadow="lg" borderRadius="lg" p={{ base: 4, md: 6, lg: 8 }}>
          <BackButton />

          <VStack spacing={6} align="stretch">
            <Box>
              <Heading size="lg" mb={2}>
                {isEdit ? 'Edit Product' : 'Add New Product'}
              </Heading>
              <Text color={mutedColor}>
                {isEdit ? 'Update the product information below' : 'Fill in the details to add a new product to your catalog'}
              </Text>
            </Box>

            <Divider />

            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
              {/* Main Form Fields */}
              <VStack spacing={6} align="stretch">
                <FormControl isInvalid={!!errors.name} isRequired>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    size="lg"
                  />
                  <FormErrorMessage>{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description} isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe your product..."
                    rows={5}
                    resize="vertical"
                  />
                  <FormErrorMessage>{errors.description}</FormErrorMessage>
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                  <FormControl isInvalid={!!errors.costPrice} isRequired>
                    <FormLabel>Cost Price (₦)</FormLabel>
                    <NumberInput
                      value={formData.costPrice}
                      onChange={(value) => handleInputChange('costPrice', parseFloat(value) || 0)}
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.costPrice}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.sellingPrice} isRequired>
                    <FormLabel>Selling Price (₦)</FormLabel>
                    <NumberInput
                      value={formData.sellingPrice}
                      onChange={(value) => handleInputChange('sellingPrice', parseFloat(value) || 0)}
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.sellingPrice}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.discount}>
                    <FormLabel>Discount (₦)</FormLabel>
                    <NumberInput
                      value={formData.discount}
                      onChange={(value) => handleInputChange('discount', parseFloat(value) || 0)}
                      min={0}
                      precision={2}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.discount}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!errors.quantity} isRequired>
                    <FormLabel>Stock Quantity</FormLabel>
                    <NumberInput
                      value={formData.quantity}
                      onChange={(value) => handleInputChange('quantity', parseInt(value) || 0)}
                      min={0}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    <FormErrorMessage>{errors.quantity}</FormErrorMessage>
                  </FormControl>
                </SimpleGrid>

                <FormControl>
                  <HStack justify="space-between">
                    <FormLabel mb={0}>Available on Surebank?</FormLabel>
                    <Switch
                      isChecked={formData.isSbAvailable}
                      onChange={(e) => handleInputChange('isSbAvailable', e.target.checked)}
                      colorScheme="blue"
                      size="lg"
                    />
                  </HStack>
                </FormControl>
              </VStack>

              {/* Image Upload Section */}
              <VStack spacing={6} align="stretch">
                <Box>
                  <FormLabel>Product Images</FormLabel>
                  <Text fontSize="sm" color={mutedColor} mb={3}>
                    Upload product images. First image will be the featured image.
                  </Text>

                  {/* Upload Button */}
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    display="none"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<FiUpload />}
                    colorScheme="blue"
                    variant="outline"
                    isDisabled={uploading}
                    width="full"
                    mb={4}
                  >
                    {uploading ? 'Uploading...' : 'Choose Images'}
                  </Button>

                  {/* Upload Progress */}
                  {Object.keys(uploadProgress).length > 0 && (
                    <Box mb={4}>
                      {Object.entries(uploadProgress).map(([index, progress]) => (
                        <Box key={index} mb={2}>
                          <Text fontSize="sm">Uploading image {parseInt(index) + 1}</Text>
                          <Progress value={progress} size="sm" colorScheme="blue" />
                        </Box>
                      ))}
                    </Box>
                  )}

                  {/* Image Gallery */}
                  {formData.images.length > 0 ? (
                    <SimpleGrid columns={2} spacing={3}>
                      {formData.images.map((imageUrl, index) => (
                        <Box
                          key={index}
                          position="relative"
                          borderRadius="lg"
                          overflow="hidden"
                          border={formData.featuredImage === imageUrl ? '3px solid' : '1px solid'}
                          borderColor={formData.featuredImage === imageUrl ? 'blue.500' : borderColor}
                          draggable
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index)}
                          cursor="move"
                          _hover={{ shadow: 'md' }}
                          transition="all 0.2s"
                        >
                          <Image
                            src={imageUrl}
                            alt={`Product ${index + 1}`}
                            objectFit="cover"
                            w="full"
                            h="150px"
                            onError={(e) => {
                              console.error(`Failed to load image: ${imageUrl}`);
                              e.target.style.display = 'none';
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded image: ${imageUrl}`);
                            }}
                          />

                          {/* Featured Badge */}
                          {formData.featuredImage === imageUrl && (
                            <Badge
                              position="absolute"
                              top={2}
                              left={2}
                              colorScheme="blue"
                              px={2}
                              py={1}
                            >
                              <HStack spacing={1}>
                                <Icon as={FiStar} />
                                <Text>Featured</Text>
                              </HStack>
                            </Badge>
                          )}

                          {/* Action Buttons */}
                          <HStack
                            position="absolute"
                            top={2}
                            right={2}
                            spacing={1}
                          >
                            {formData.featuredImage !== imageUrl && (
                              <Tooltip label="Set as featured">
                                <IconButton
                                  icon={<FiStar />}
                                  size="sm"
                                  colorScheme="blue"
                                  onClick={() => setAsFeatured(imageUrl)}
                                  aria-label="Set as featured"
                                />
                              </Tooltip>
                            )}
                            <Tooltip label="Remove image">
                              <IconButton
                                icon={<FiTrash2 />}
                                size="sm"
                                colorScheme="red"
                                onClick={() => removeImage(index)}
                                aria-label="Remove image"
                              />
                            </Tooltip>
                          </HStack>
                        </Box>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Center
                      h="200px"
                      border="2px dashed"
                      borderColor={borderColor}
                      borderRadius="lg"
                      bg={hoverBg}
                    >
                      <VStack>
                        <Icon as={FiImage} boxSize={12} color={mutedColor} />
                        <Text color={mutedColor}>No images uploaded</Text>
                      </VStack>
                    </Center>
                  )}

                  {formData.images.length > 0 && (
                    <Alert status="info" mt={3} borderRadius="md">
                      <AlertIcon />
                      <Text fontSize="sm">Drag images to reorder them</Text>
                    </Alert>
                  )}
                </Box>

                {/* Product Preview Card */}
                {(formData.name || formData.featuredImage) && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>Preview</Text>
                    <Box
                      borderWidth="1px"
                      borderRadius="lg"
                      overflow="hidden"
                      borderColor={borderColor}
                    >
                      {formData.featuredImage && (
                        <Image
                          src={formData.featuredImage}
                          alt="Product preview"
                          objectFit="cover"
                          w="full"
                          h="200px"
                          onError={(e) => {
                            console.error(`Failed to load preview image: ${formData.featuredImage}`);
                          }}
                        />
                      )}
                      <Box p={4}>
                        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
                          {formData.name || 'Product Name'}
                        </Text>
                        <Text color={mutedColor} fontSize="sm" noOfLines={2} mt={1}>
                          {formData.description || 'Product description will appear here'}
                        </Text>
                        <HStack mt={3} spacing={4}>
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color={mutedColor}>Price</Text>
                            <Text fontWeight="bold" color="green.500">
                              ₦{formData.sellingPrice.toLocaleString()}
                            </Text>
                          </VStack>
                          {formData.discount > 0 && (
                            <VStack align="start" spacing={0}>
                              <Text fontSize="xs" color={mutedColor}>Discount</Text>
                              <Badge colorScheme="purple">₦{formData.discount.toLocaleString()}</Badge>
                            </VStack>
                          )}
                          <VStack align="start" spacing={0}>
                            <Text fontSize="xs" color={mutedColor}>Stock</Text>
                            <Badge
                              colorScheme={formData.quantity > 10 ? 'green' : formData.quantity > 5 ? 'yellow' : 'red'}
                            >
                              {formData.quantity} units
                            </Badge>
                          </VStack>
                        </HStack>
                      </Box>
                    </Box>
                  </Box>
                )}
              </VStack>
            </Grid>

            <Divider />

            {/* Form Actions */}
            <HStack justify="flex-end" spacing={4}>
              <Button
                variant="ghost"
                onClick={() => history.goBack()}
                isDisabled={loading || uploading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
                isDisabled={uploading}
                leftIcon={<FiCheck />}
                loadingText={isEdit ? 'Updating...' : 'Creating...'}
              >
                {isEdit ? 'Update Product' : 'Create Product'}
              </Button>
            </HStack>
          </VStack>
        </Card>
      </Container>
    </Box>
  );
};

export default ProductForm;