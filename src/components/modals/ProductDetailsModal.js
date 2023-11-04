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

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleApprove = async () => {
    try {
      await axiosService.post(`/products/request/${product.id}/approve`);
      toast.success('Product request approved successfully!');
      onClose();
    } catch (error) {
      console.error(error);
      console.log(error.response);
      toast.error('An error occurred while approving the product request.');
    }
  };
  console.log(product);
  const handleReject = async (formData) => {
    try {
      await axiosService.post(`/products/request/${product.id}/reject`, {
        reasonForRejection: formData.reasonForRejection,
      });
      toast.success('Product request rejected successfully.');
      setIsRejectModalOpen(false);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while rejecting the product request.');
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{product.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box mb="1rem">
              <Text fontWeight="bold">Brand:</Text>
              <Text>{product.brand?.name}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Category:</Text>
              <Text>{product.categoryId?.name}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Description:</Text>
              <Text>
                {showFullDescription
                  ? product.description
                  : `${product.description.substring(0, 100)}...`}
              </Text>
              {product.description.length > 100 && (
                <Button onClick={toggleDescription}>
                  {showFullDescription ? 'View Less' : 'View More'}
                </Button>
              )}
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

export default ProductDetailsModal;
