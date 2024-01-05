import React, { useState } from 'react';
import {
  Box,
  Button,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
} from '@chakra-ui/react';

import { useForm, Controller } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';

const MerchantDetailsModal = ({ isOpen, onClose, merchant }) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const handleApprove = async () => {
    try {
      await axiosService.post(`/merchants/request/${merchant.id}/approve`);
      toast.success('merchant request approved successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while approving the merchant request.');
    }
  };

  const handleReject = async (formData) => {
    try {
      await axiosService.post(`/merchants/request/${merchant.id}/reject`, {
        reasonForRejection: formData.reasonForRejection,
      });
      toast.success('Merchant request rejected successfully.');
      setIsRejectModalOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while rejecting the merchant request.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{merchant.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb="1rem">
              <Text fontWeight="bold">Name:</Text>
              <Text>{merchant.name}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Store name:</Text>
              <Text>{merchant.storeName}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Phone Number:</Text>
              <Text>{merchant.phoneNumber}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Email:</Text>
              <Text>{merchant.email}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Address:</Text>
              <Text>{merchant.storeAddress}</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => setIsRejectModalOpen(true)}
            >
              Reject
            </Button>
            <Button
              colorScheme="green"
              onClick={handleApprove}
              isLoading={isSubmitting}
            >
              Approve
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
    </>
  );
};

export default MerchantDetailsModal;
