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
import { useAuth } from 'contexts/AuthContext';

const ProductDetailsModal = ({ isOpen, onClose, product }) => {
  const { currentUser } = useAuth();
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const {
    control,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{product.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentUser.role === 'superAdmin' ||
              (currentUser.role === 'admin' && (
                <Box mb="1rem">
                  <Text fontWeight="bold">Cost Price:</Text>
                  <Text>{product.costPrice}</Text>
                </Box>
              ))}
            <Box mb="1rem">
              <Text fontWeight="bold">Selling Price:</Text>
              <Text>{product.sellingPrice}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Discount Price:</Text>
              <Text>{product.discount}</Text>
            </Box>
            <Box mb="1rem">
              <Text fontWeight="bold">Quantity:</Text>
              <Text>{product.quantity}</Text>
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
              Cancel
            </Button>
            <Button colorScheme="green" isLoading={isSubmitting}>
              Edit
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
            <Button colorScheme="green" isLoading={isSubmitting}>
              Reject
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductDetailsModal;
