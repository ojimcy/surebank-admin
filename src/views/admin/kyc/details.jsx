import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
    Box,
    Button,
    Flex,
    Text,
    Grid,
    GridItem,
    Image,
    Badge,
    VStack,
    HStack,
    Divider,
    useColorModeValue,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Textarea,
    useDisclosure,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Spinner,
    Center,
} from '@chakra-ui/react';
import { FaCheck, FaTimes, FaUser, FaIdCard, FaPhone, FaCalendarAlt, FaMapMarkerAlt, FaFileImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

import Card from 'components/card/Card';
import BackButton from 'components/menu/BackButton';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import axiosService from 'utils/axiosService';
import { formatDate } from 'utils/helper';

function KYCDetails() {
    const { kycId } = useParams();
    const history = useHistory();
    const [kycRequest, setKycRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionType, setActionType] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageLoading, setImageLoading] = useState({ idImage: true, selfieImage: true });

    const { isOpen, onOpen, onClose } = useDisclosure();

    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const brandColor = useColorModeValue('brand.500', 'brand.400');
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    // Fetch KYC request details
    const fetchKycDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosService.get(`/kyc/${kycId}`);
            setKycRequest(response.data);
        } catch (error) {
            console.error('Error fetching KYC details:', error);
            toast.error('Failed to fetch KYC details');
            history.push('/admin/kyc');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchKycDetails();
    }, [kycId]);

    // Handle KYC action (approve/reject)
    const handleKycAction = async () => {
        if (!actionType) return;

        if (actionType === 'rejected' && !remarks.trim()) {
            toast.error('Please provide remarks for rejection');
            return;
        }

        try {
            setIsSubmitting(true);
            await axiosService.post(`/kyc/${kycId}`, {
                status: actionType,
                remarks: remarks.trim(),
            });

            toast.success(`KYC request ${actionType} successfully`);
            fetchKycDetails();
            handleCloseModal();
        } catch (error) {
            console.error('Error updating KYC:', error);
            toast.error(error.response?.data?.message || 'Failed to update KYC request');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setActionType('');
        setRemarks('');
        onClose();
    };

    // Open action modal
    const openActionModal = (action) => {
        setActionType(action);
        onOpen();
    };

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'yellow';
            case 'approved':
                return 'green';
            case 'rejected':
                return 'red';
            default:
                return 'gray';
        }
    };

    // Get KYC type badge color
    const getTypeColor = (type) => {
        switch (type) {
            case 'bvn':
                return 'blue';
            case 'id':
                return 'purple';
            default:
                return 'gray';
        }
    };

    // Handle image load
    const handleImageLoad = (imageKey) => {
        setImageLoading(prev => ({ ...prev, [imageKey]: false }));
    };

    // Handle image error
    const handleImageError = (imageKey) => {
        setImageLoading(prev => ({ ...prev, [imageKey]: false }));
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!kycRequest) {
        return (
            <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
                <BackButton />
                <Alert status="error">
                    <AlertIcon />
                    <AlertTitle>KYC Request Not Found!</AlertTitle>
                    <AlertDescription>
                        The requested KYC details could not be found.
                    </AlertDescription>
                </Alert>
            </Box>
        );
    }

    return (
        <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
            <BackButton />

            <Card mb="20px">
                <Flex direction="column" w="100%">
                    <Flex justifyContent="space-between" alignItems="center" mb="20px">
                        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                            KYC Request Details
                        </Text>
                        <HStack spacing={3}>
                            <Badge colorScheme={getStatusColor(kycRequest.status)} variant="solid" fontSize="sm" px={3} py={1}>
                                {kycRequest.status?.toUpperCase()}
                            </Badge>
                            <Badge colorScheme={getTypeColor(kycRequest.type)} variant="solid" fontSize="sm" px={3} py={1}>
                                {kycRequest.type?.toUpperCase()}
                            </Badge>
                        </HStack>
                    </Flex>

                    <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
                        {/* Personal Information */}
                        <GridItem>
                            <Card bg={cardBg} border="1px" borderColor={borderColor}>
                                <VStack align="start" spacing={4}>
                                    <Text fontSize="lg" fontWeight="bold" color={brandColor}>
                                        <FaUser style={{ display: 'inline', marginRight: '8px' }} />
                                        Personal Information
                                    </Text>
                                    <Divider />

                                    <HStack spacing={3}>
                                        <Text fontWeight="semibold">Name:</Text>
                                        <Text>{kycRequest.name}</Text>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Text fontWeight="semibold">Email:</Text>
                                        <Text>{kycRequest.userId?.email || 'N/A'}</Text>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <FaPhone />
                                        <Text fontWeight="semibold">Phone:</Text>
                                        <Text>{kycRequest.phoneNumber}</Text>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <FaCalendarAlt />
                                        <Text fontWeight="semibold">Date of Birth:</Text>
                                        <Text>{formatDate(kycRequest.dateOfBirth)}</Text>
                                    </HStack>

                                    {kycRequest.address && (
                                        <HStack spacing={3}>
                                            <FaMapMarkerAlt />
                                            <Text fontWeight="semibold">Address:</Text>
                                            <Text>{kycRequest.address}</Text>
                                        </HStack>
                                    )}
                                </VStack>
                            </Card>
                        </GridItem>

                        {/* KYC Information */}
                        <GridItem>
                            <Card bg={cardBg} border="1px" borderColor={borderColor}>
                                <VStack align="start" spacing={4}>
                                    <Text fontSize="lg" fontWeight="bold" color={brandColor}>
                                        <FaIdCard style={{ display: 'inline', marginRight: '8px' }} />
                                        KYC Information
                                    </Text>
                                    <Divider />

                                    <HStack spacing={3}>
                                        <Text fontWeight="semibold">Type:</Text>
                                        <Badge colorScheme={getTypeColor(kycRequest.type)} variant="solid">
                                            {kycRequest.type?.toUpperCase()}
                                        </Badge>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Text fontWeight="semibold">Status:</Text>
                                        <Badge colorScheme={getStatusColor(kycRequest.status)} variant="solid">
                                            {kycRequest.status?.toUpperCase()}
                                        </Badge>
                                    </HStack>

                                    <HStack spacing={3}>
                                        <Text fontWeight="semibold">Submitted:</Text>
                                        <Text>{formatDate(kycRequest.submittedAt)}</Text>
                                    </HStack>

                                    {kycRequest.approvedAt && (
                                        <HStack spacing={3}>
                                            <Text fontWeight="semibold">Processed:</Text>
                                            <Text>{formatDate(kycRequest.approvedAt)}</Text>
                                        </HStack>
                                    )}

                                    {kycRequest.approvedBy && (
                                        <HStack spacing={3}>
                                            <Text fontWeight="semibold">Processed By:</Text>
                                            <Text>{kycRequest.approvedBy?.firstName} {kycRequest.approvedBy?.lastName}</Text>
                                        </HStack>
                                    )}

                                    {kycRequest.remarks && (
                                        <VStack align="start" spacing={2} w="100%">
                                            <Text fontWeight="semibold">Remarks:</Text>
                                            <Text
                                                p={3}
                                                bg={kycRequest.status === 'rejected' ? 'red.50' : 'green.50'}
                                                border="1px"
                                                borderColor={kycRequest.status === 'rejected' ? 'red.200' : 'green.200'}
                                                borderRadius="md"
                                                w="100%"
                                            >
                                                {kycRequest.remarks}
                                            </Text>
                                        </VStack>
                                    )}
                                </VStack>
                            </Card>
                        </GridItem>
                    </Grid>

                    {/* Type-specific Information */}
                    {kycRequest.type === 'id' && (
                        <Card bg={cardBg} border="1px" borderColor={borderColor} mt={6}>
                            <VStack align="start" spacing={4}>
                                <Text fontSize="lg" fontWeight="bold" color={brandColor}>
                                    <FaIdCard style={{ display: 'inline', marginRight: '8px' }} />
                                    ID Verification Details
                                </Text>
                                <Divider />

                                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={6} w="100%">
                                    <VStack align="start" spacing={3}>
                                        <HStack spacing={3}>
                                            <Text fontWeight="semibold">ID Type:</Text>
                                            <Text>{kycRequest.idType?.replace('_', ' ').toUpperCase()}</Text>
                                        </HStack>

                                        <HStack spacing={3}>
                                            <Text fontWeight="semibold">ID Number:</Text>
                                            <Text>{kycRequest.idNumber}</Text>
                                        </HStack>

                                        {kycRequest.expiryDate && (
                                            <HStack spacing={3}>
                                                <Text fontWeight="semibold">Expiry Date:</Text>
                                                <Text>{formatDate(kycRequest.expiryDate)}</Text>
                                            </HStack>
                                        )}
                                    </VStack>

                                    <VStack align="start" spacing={4}>
                                        {/* ID Image */}
                                        {kycRequest.idImage && (
                                            <Box>
                                                <Text fontWeight="semibold" mb={2}>
                                                    <FaFileImage style={{ display: 'inline', marginRight: '8px' }} />
                                                    ID Document
                                                </Text>
                                                <Box
                                                    border="1px"
                                                    borderColor={borderColor}
                                                    borderRadius="md"
                                                    p={2}
                                                    maxW="300px"
                                                >
                                                    {imageLoading.idImage !== false && (
                                                        <Center h="200px">
                                                            <Spinner />
                                                        </Center>
                                                    )}
                                                    <Image
                                                        src={kycRequest.idImage}
                                                        alt="ID Document"
                                                        maxH="200px"
                                                        w="100%"
                                                        objectFit="contain"
                                                        onLoad={() => handleImageLoad('idImage')}
                                                        onError={() => handleImageError('idImage')}
                                                        display={imageLoading.idImage === false ? 'block' : 'none'}
                                                    />
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Selfie Image */}
                                        {kycRequest.selfieImage && (
                                            <Box>
                                                <Text fontWeight="semibold" mb={2}>
                                                    <FaFileImage style={{ display: 'inline', marginRight: '8px' }} />
                                                    Selfie
                                                </Text>
                                                <Box
                                                    border="1px"
                                                    borderColor={borderColor}
                                                    borderRadius="md"
                                                    p={2}
                                                    maxW="300px"
                                                >
                                                    {imageLoading.selfieImage !== false && (
                                                        <Center h="200px">
                                                            <Spinner />
                                                        </Center>
                                                    )}
                                                    <Image
                                                        src={kycRequest.selfieImage}
                                                        alt="Selfie"
                                                        maxH="200px"
                                                        w="100%"
                                                        objectFit="contain"
                                                        onLoad={() => handleImageLoad('selfieImage')}
                                                        onError={() => handleImageError('selfieImage')}
                                                        display={imageLoading.selfieImage === false ? 'block' : 'none'}
                                                    />
                                                </Box>
                                            </Box>
                                        )}
                                    </VStack>
                                </Grid>
                            </VStack>
                        </Card>
                    )}

                    {kycRequest.type === 'bvn' && (
                        <Card bg={cardBg} border="1px" borderColor={borderColor} mt={6}>
                            <VStack align="start" spacing={4}>
                                <Text fontSize="lg" fontWeight="bold" color={brandColor}>
                                    BVN Verification Details
                                </Text>
                                <Divider />

                                <HStack spacing={3}>
                                    <Text fontWeight="semibold">BVN Verified:</Text>
                                    <Badge colorScheme={kycRequest.bvnVerified ? 'green' : 'red'} variant="solid">
                                        {kycRequest.bvnVerified ? 'Yes' : 'No'}
                                    </Badge>
                                </HStack>

                                {kycRequest.bvnVerificationReference && (
                                    <HStack spacing={3}>
                                        <Text fontWeight="semibold">Reference:</Text>
                                        <Text fontSize="sm" fontFamily="mono">
                                            {kycRequest.bvnVerificationReference}
                                        </Text>
                                    </HStack>
                                )}
                            </VStack>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    {kycRequest.status === 'pending' && (
                        <Flex justifyContent="center" mt={6} gap={4}>
                            <Button
                                leftIcon={<FaCheck />}
                                colorScheme="green"
                                size="lg"
                                onClick={() => openActionModal('approved')}
                            >
                                Approve KYC
                            </Button>
                            <Button
                                leftIcon={<FaTimes />}
                                colorScheme="red"
                                size="lg"
                                onClick={() => openActionModal('rejected')}
                            >
                                Reject KYC
                            </Button>
                        </Flex>
                    )}
                </Flex>
            </Card>

            {/* Action Modal */}
            <Modal isOpen={isOpen} onClose={handleCloseModal} size="md">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        {actionType === 'approved' ? 'Approve' : 'Reject'} KYC Request
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack align="start" spacing={3}>
                            <Text><strong>User:</strong> {kycRequest.name}</Text>
                            <Text><strong>Type:</strong> {kycRequest.type?.toUpperCase()}</Text>
                            <Text><strong>Phone:</strong> {kycRequest.phoneNumber}</Text>

                            {actionType === 'rejected' && (
                                <Box w="100%">
                                    <Text mb={2} fontWeight="semibold">Reason for Rejection:</Text>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Please provide a reason for rejecting this KYC request..."
                                        rows={4}
                                    />
                                </Box>
                            )}

                            {actionType === 'approved' && (
                                <Box w="100%">
                                    <Text mb={2} fontWeight="semibold">Remarks (Optional):</Text>
                                    <Textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Any additional remarks..."
                                        rows={3}
                                    />
                                </Box>
                            )}
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="ghost" mr={3} onClick={handleCloseModal}>
                            Cancel
                        </Button>
                        <Button
                            colorScheme={actionType === 'approved' ? 'green' : 'red'}
                            onClick={handleKycAction}
                            isLoading={isSubmitting}
                            loadingText={actionType === 'approved' ? 'Approving...' : 'Rejecting...'}
                        >
                            {actionType === 'approved' ? 'Approve' : 'Reject'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );
}

export default KYCDetails; 