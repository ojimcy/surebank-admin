import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
} from '@chakra-ui/react';
import { toast } from 'react-toastify';
import axiosService from 'utils/axiosService';
import { formatNaira, formatDate } from 'utils/helper';

import BackButton from 'components/menu/BackButton';
import { useForm, Controller } from 'react-hook-form';
import LoadingSpinner from 'components/scroll/LoadingSpinner';

const ExpenditureDetail = () => {
  const { id } = useParams();
  const [expenditure, setExpenditure] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const fetchExpenditure = async () => {
    setLoading(true);
    const response = await axiosService.get(`/expenditure/${id}`);
    setExpenditure(response.data);
  };

  useEffect(() => {
    try {
      fetchExpenditure();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while fetching expenditure details.'
      );
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleApprove = async () => {
    try {
      setLoading(true);
      await axiosService.post(`/expenditure/${id}/approve`);
      fetchExpenditure();
      toast.success('Expenditure approved successfully.');
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while approving the expenditure.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (formData) => {
    try {
      setLoading(true);
      await axiosService.post(`/expenditure/${id}/reject`, {
        reasonForRejection: formData.reasonForRejection,
      });
      toast.success('Expenditure rejected successfully.');
      setIsRejectModalOpen(false);
      reset();
      fetchExpenditure();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while rejecting the expenditure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <LoadingSpinner />
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
                  {expenditure && (
                    <Flex alignItems="center">
                      <Box px={6} py={4}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <Text fontWeight="bold">Created By</Text>
                          <Text>
                            {expenditure.createdBy?.firstName}{' '}
                            {expenditure.createdBy?.lastName}
                          </Text>
                          <Text fontWeight="bold">Reason:</Text>
                          <Text>{expenditure.reason}</Text>
                          <Text fontWeight="bold">Status:</Text>
                          <Text>{expenditure.status}</Text>
                          {expenditure.status === 'rejected' ? (
                            <>
                              <Text fontWeight="bold">Rejection Reasons:</Text>
                              <Text>{expenditure.reasonForRejection}</Text>
                            </>
                          ) : (
                            ''
                          )}
                          <Text fontWeight="bold">Date:</Text>
                          <Text>{formatDate(expenditure?.date)}</Text>
                          <Text fontWeight="bold">Amount:</Text>
                          <Text>{formatNaira(expenditure?.amount)}</Text>
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

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject Withdrawal</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Controller
              name="reasonForRejection"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="Enter reason for rejection..."
                />
              )}
            />
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                setIsRejectModalOpen(false);
                reset(); // Reset the form on cancel
              }}
            >
              Cancel
            </Button>
            <Button
              colorScheme="green"
              onClick={handleSubmit(handleReject)}
              isLoading={isSubmitting}
            >
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ExpenditureDetail;
