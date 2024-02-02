import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Text,
  Grid,
  Flex,
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
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import axiosService from 'utils/axiosService';
import { formatNaira, formatDate } from 'utils/helper';

import BackButton from 'components/menu/BackButton';
import { useForm } from 'react-hook-form';
import LoadingSpinner from 'components/scroll/LoadingSpinner';
import { FaClipboard } from 'react-icons/fa';
import copy from 'clipboard-copy';

const WithdrawalDetails = () => {
  const history = useHistory();
  const { requestId } = useParams();
  const [withdrawal, setWithdrawal] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

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

  return (
    <Box p={4}>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
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
                  {withdrawal && (
                    <Flex alignItems="center">
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text fontWeight="bold">narration</Text>
                          <Text>{withdrawal?.narration}</Text>
                          <Text fontWeight="bold">Sales Rep</Text>
                          <Text>
                            {withdrawal.userReps?.firstName}{' '}
                            {withdrawal.userReps?.lastName}
                          </Text>
                          <Text fontWeight="bold">Customer</Text>
                          <Text>
                            {withdrawal.userId?.firstName}{' '}
                            {withdrawal.userId?.lastName}
                          </Text>
                          <Text fontWeight="bold">Date:</Text>
                          <Text>{formatDate(withdrawal?.date)}</Text>
                          <Text fontWeight="bold">Amount:</Text>
                          <Text>{formatNaira(withdrawal?.amount)}</Text>
                          <Text fontWeight="bold">Status:</Text>
                          <Text>{formatNaira(withdrawal?.status)}</Text>
                          <Text fontWeight="bold">Bank Name:</Text>
                          <Text>{withdrawal.bankName}</Text>
                          <Text fontWeight="bold">Bank Account Number:</Text>
                          <Text>
                            {withdrawal.bankAccountNumber}
                            {withdrawal.bankAccountNumber && (
                              <FaClipboard
                                style={{ cursor: 'pointer' }}
                                onClick={() =>
                                  handleCopy(withdrawal.bankAccountNumber)
                                }
                              />
                            )}
                          </Text>
                          <Text fontWeight="bold">Bank Account Name:</Text>
                          <Text>
                            {withdrawal.accountName}
                            {withdrawal.accountName && (
                              <FaClipboard
                                style={{ cursor: 'pointer' }}
                                onClick={() => handleCopy(withdrawal.bankName)}
                              />
                            )}
                          </Text>
                        </Grid>

                        <Flex justifyContent="center" mt={10}>
                          <Button
                            colorScheme="green"
                            variant="outline"
                            onClick={handleApprove}
                            mr={4}
                            isLoading={isSubmitting}
                          >
                            Approve
                          </Button>
                          <Button
                            colorScheme="red"
                            variant="outline"
                            onClick={() => setIsRejectModalOpen(true)}
                          >
                            Reject
                          </Button>
                        </Flex>
                      </Box>
                    </Flex>
                  )}
                </Box>
              </Center>
            </Flex>
          </Grid>
        </Box>
      )}

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                setIsRejectModalOpen(false);
                setRejectionReason('');
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={() => {
                handleReject();
                setRejectionReason('');
              }}
            >
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WithdrawalDetails;
