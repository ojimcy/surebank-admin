// Chakra imports
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Select,
  Text,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  Input,
} from '@chakra-ui/react';
import React from 'react';

// Custom components

// Assets
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { toSentenceCase } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';

export default function CreateAccountModal({ isOpen, onClose }) {
  const { branches, customerData } = useAppContext();

  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (accountData) => {
    try {
      await axiosService.post(`/accounts`, accountData);
      toast.success('Account created successfully!');
      onClose();
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
        <ModalHeader>Create Account</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Email<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  defaultValue={customerData.email}
                  {...register('email', { required: true })}
                />
              </InputGroup>
            </FormControl>
            <FormControl isInvalid={errors.accountType}>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Account Type<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select
                {...register('accountType')}
                name="accountType"
                defaultValue="Hq"
              >
                <option value="">Select account rype</option>
                <option value="ds">DS</option>
                <option value="sb">SB</option>
              </Select>
            </FormControl>
            <FormControl isInvalid={errors.branch}>
              <FormLabel
                htmlFor="branch"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Branch<Text color={brandStars}>*</Text>
              </FormLabel>
              <Select {...register('branchId')} name="branchId" defaultValue="">
                <option value="" disabled>
                  Select a branch
                </option>
                {branches &&
                  branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {toSentenceCase(branch?.name)}
                    </option>
                  ))}
              </Select>
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
                Save
              </Button>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
