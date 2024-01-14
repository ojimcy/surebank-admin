// Chakra imports
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  Input,
  Textarea,
} from '@chakra-ui/react';
import React from 'react';

// Custom components

// Assets
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';

export default function CreateMerchantRequestModal({ isOpen, onClose }) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const submitHandler = async (merchantData) => {
    try {
      await axiosService.post(`/merchants/requests`, merchantData);
      toast.success('Merchant request created successfully!');
      onClose();
      reset();
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Merchant Request</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl>
              <FormLabel
                htmlFor="storeName"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Store Name<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Store Name"
                  {...register('storeName', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="storeAddress"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Store Address<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Textarea
                  type="text"
                  placeholder="Enter Store Address"
                  {...register('storeAddress', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="storePhoneNumber"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Store Phone Number<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type="tel"
                  placeholder="Enter Store Phone Number"
                  {...register('storePhoneNumber', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="website"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Website
              </FormLabel>
              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Website"
                  {...register('website')}
                />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="email"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Email<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  {...register('email', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
              <Button
                colorScheme="green"
                variant="solid"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                isLoading={isSubmitting}
              >
                Submit
              </Button>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
