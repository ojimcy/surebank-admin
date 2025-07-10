import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Text,
  Grid,
  Center,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  Badge,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Heading,
  Stack,
  StackDivider,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import { formatNaira, formatDate } from 'utils/helper';

import BackButton from 'components/menu/BackButton';
import { useForm } from 'react-hook-form';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { FaClipboard, FaUser, FaCalendarAlt, FaDollarSign, FaUniversity, FaCreditCard, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import copy from 'clipboard-copy';

const WithdrawalDetails = () => {
  const history = useHistory();
  const { requestId } = useParams();
  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  const labelColor = useColorModeValue('gray.600', 'gray.400');

  const {
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    const fetchWithdrawalDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosService.get(
          `/transactions/withdraw/cash/${requestId}`
        );
        setWithdrawal(response.data);
      } catch (error) {
        console.error(error);
        toast.error(
          error.response?.data?.message ||
          'An error occurred while fetching withdrawal details.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawalDetails();
  }, [requestId]);

  // Function to handle approval action
  const handleApprove = async () => {
    try {
      setLoading(true);
      await axiosService.post(`/transactions/withdraw?requestId=${requestId}`);
      toast.success('Withdrawal request approved successfully.');

      history.push('/admin/');
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
        'An error occurred while approving the withdrawal.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle rejection action
  const handleReject = async () => {
    try {
      setLoading(true);
      await axiosService.post(`/transactions/withdraw/cash/${requestId}`, {
        narration: rejectionReason,
      });
      toast.success('Withdrawal request rejected successfully.');
      setIsRejectModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while rejecting the withdrawal.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (textToCopy) => {
    copy(textToCopy);
    toast.success('Copied to clipboard!');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { colorScheme: 'green', icon: FaCheckCircle },
      pending: { colorScheme: 'yellow', icon: FaTimesCircle },
      rejected: { colorScheme: 'red', icon: FaTimesCircle },
    };

    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge colorScheme={config.colorScheme} fontSize="sm" px={3} py={1} borderRadius="full">
        <HStack spacing={1}>
          <IconComponent size={12} />
          <Text textTransform="capitalize">{status}</Text>
        </HStack>
      </Badge>
    );
  };

  const DetailRow = ({ icon: Icon, label, value, copyable = false, copyValue }) => (
    <HStack justify="space-between" align="flex-start" spacing={4}>
      <HStack spacing={3} flex={1}>
        <Icon color="blue.500" size={16} />
        <Text fontSize="sm" fontWeight="medium" color={labelColor} minW="120px">
          {label}:
        </Text>
      </HStack>
      <HStack spacing={2} flex={2} justify="flex-end">
        <Text fontSize="sm" color={textColor} textAlign="right" wordBreak="break-word">
          {value || 'N/A'}
        </Text>
        {copyable && value && (
          <IconButton
            icon={<FaClipboard />}
            size="xs"
            variant="ghost"
            colorScheme="blue"
            onClick={() => handleCopy(copyValue || value)}
            aria-label={`Copy ${label}`}
          />
        )}
      </HStack>
    </HStack>
  );

  return (
    <Box minH="100vh" bg={bgColor} p={4}>
      {loading ? (
        <Center h="60vh">
          <LoadingSpinner />
        </Center>
      ) : (
        <Box pt={{ base: '90px', md: '80px', xl: '80px' }} maxW="6xl" mx="auto">
          <BackButton />

          <VStack spacing={6} align="stretch">
            {/* Header Card */}
            <Box bg={cardBg} shadow="lg" borderRadius="xl" p={6}>
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center" flexWrap="wrap">
                  <Heading size="lg" color={textColor}>
                    Withdrawal Request Details
                  </Heading>
                  {withdrawal?.status && getStatusBadge(withdrawal.status)}
                </HStack>

                <Text fontSize="lg" fontWeight="semibold" color="blue.500">
                  Request ID: {requestId}
                </Text>
              </VStack>
            </Box>

            {withdrawal && (
              <Grid
                templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }}
                gap={6}
              >
                {/* Customer Information */}
                <Box bg={cardBg} shadow="md" borderRadius="xl" p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md" color={textColor} mb={2}>
                      Customer Information
                    </Heading>
                    <Stack divider={<StackDivider borderColor={borderColor} />} spacing={3}>
                      <DetailRow
                        icon={FaUser}
                        label="Customer"
                        value={`${withdrawal.userId?.firstName} ${withdrawal.userId?.lastName}`}
                      />
                      <DetailRow
                        icon={FaUser}
                        label="Sales Rep"
                        value={withdrawal.userReps ? `${withdrawal.userReps.firstName} ${withdrawal.userReps.lastName}` : 'N/A'}
                      />
                      <DetailRow
                        icon={FaCalendarAlt}
                        label="Date"
                        value={formatDate(withdrawal?.date)}
                      />
                    </Stack>
                  </VStack>
                </Box>

                {/* Transaction Details */}
                <Box bg={cardBg} shadow="md" borderRadius="xl" p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md" color={textColor} mb={2}>
                      Transaction Details
                    </Heading>
                    <Stack divider={<StackDivider borderColor={borderColor} />} spacing={3}>
                      <DetailRow
                        icon={FaDollarSign}
                        label="Amount"
                        value={formatNaira(withdrawal?.amount)}
                      />
                      <DetailRow
                        icon={FaCalendarAlt}
                        label="Narration"
                        value={withdrawal?.narration}
                      />
                    </Stack>
                  </VStack>
                </Box>

                {/* Bank Information */}
                <Box bg={cardBg} shadow="md" borderRadius="xl" gridColumn={{ base: '1', lg: '1 / -1' }} p={6}>
                  <VStack align="stretch" spacing={4}>
                    <Heading size="md" color={textColor} mb={2}>
                      Bank Information
                    </Heading>
                    <Stack divider={<StackDivider borderColor={borderColor} />} spacing={3}>
                      <DetailRow
                        icon={FaUniversity}
                        label="Bank Name"
                        value={withdrawal.bankName}
                      />
                      <DetailRow
                        icon={FaCreditCard}
                        label="Account Number"
                        value={withdrawal.bankAccountNumber}
                        copyable={true}
                      />
                      <DetailRow
                        icon={FaUser}
                        label="Account Name"
                        value={withdrawal.accountName}
                        copyable={true}
                      />
                    </Stack>
                  </VStack>
                </Box>
              </Grid>
            )}

            {/* Action Buttons */}
            {withdrawal && (
              <Box bg={cardBg} shadow="md" borderRadius="xl" p={6}>
                <VStack spacing={4}>
                  <Heading size="md" color={textColor}>
                    Actions
                  </Heading>
                  <HStack spacing={4} justify="center" flexWrap="wrap" gap={4}>
                    <Button
                      leftIcon={<FaCheckCircle />}
                      colorScheme="green"
                      size="lg"
                      onClick={handleApprove}
                      isLoading={isSubmitting}
                      disabled={withdrawal.status === 'approved'}
                      px={8}
                      mb={2}
                      borderRadius="xl"
                      _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      Approve Request
                    </Button>
                    <Button
                      leftIcon={<FaTimesCircle />}
                      colorScheme="red"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsRejectModalOpen(true)}
                      px={8}
                      mb={2}
                      borderRadius="xl"
                      _hover={{ transform: 'translateY(-1px)', shadow: 'lg' }}
                      transition="all 0.2s"
                    >
                      Reject Request
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            )}
          </VStack>
        </Box>
      )}

      {/* Enhanced Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        size={{ base: 'sm', md: 'md' }}
        isCentered
      >
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={4} borderRadius="xl" bg={cardBg}>
          <ModalHeader borderBottomWidth="1px" borderColor={borderColor}>
            <HStack>
              <FaTimesCircle color="red" />
              <Text>Reject Withdrawal Request</Text>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              <Text color={labelColor}>
                Please provide a reason for rejecting this withdrawal request:
              </Text>
              <Textarea
                placeholder="Enter detailed reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                borderRadius="lg"
                borderColor={borderColor}
                _focus={{ borderColor: 'blue.500', shadow: '0 0 0 1px blue.500' }}
              />
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={borderColor}>
            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectionReason('');
                }}
                borderRadius="lg"
              >
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  handleReject();
                  setRejectionReason('');
                }}
                isLoading={loading}
                borderRadius="lg"
                leftIcon={<FaTimesCircle />}
              >
                Reject Request
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WithdrawalDetails;
