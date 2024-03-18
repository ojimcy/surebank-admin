import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  useColorModeValue,
  Box,
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const CreateNoteModal = ({ isOpen, onClose, onSubmit }) => {
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Note</ModalHeader>
        <ModalCloseButton />
        <ModalBody>Enter note</ModalBody>
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={errors.amount}>
              <FormLabel
                htmlFor="amount"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Amount<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                id="amount"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('amount', {
                  required: 'Amount is required',
                })}
              />
            </FormControl>
            <FormControl isInvalid={errors.note}>
              <FormLabel
                htmlFor="note"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Note<Text color={brandStars}>*</Text>
              </FormLabel>
              <Textarea
                isRequired={true}
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                id="note"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('note', {
                  required: 'Note is required',
                })}
                placeholder="Enter note"
              />
              <FormErrorMessage>
                {errors.reason && errors.reason.message}
              </FormErrorMessage>
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
};

export default CreateNoteModal;
