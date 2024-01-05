import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Text,
  InputGroup,
  Input,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const CreateBrandModal = ({ isOpen, onClose, createBrand }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleCreateBrand = (data) => {
    createBrand(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Brand</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleCreateBrand)}>
            <FormControl isInvalid={errors.name}>
              <FormLabel
                htmlFor="name"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Name<Text>*</Text>
              </FormLabel>

              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Brand Name"
                  {...register('name', { required: true })}
                />
              </InputGroup>
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            bgColor="blue.700"
            color="white"
            type="submit"
            isLoading={isSubmitting}
            onClick={handleSubmit(handleCreateBrand)}
          >
            Save
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateBrandModal;
