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
  Textarea,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const CreateCategoryModal = ({ isOpen, onClose, createCategory }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleCreateCategory = (data) => {
    createCategory(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Category</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleCreateCategory)}>
            <FormControl isInvalid={errors.title}>
              <FormLabel
                htmlFor="title"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Title<Text>*</Text>
              </FormLabel>

              <InputGroup>
                <Input
                  type="text"
                  placeholder="Enter Category Name"
                  {...register('title', { required: true })}
                />
              </InputGroup>
            </FormControl>

            <FormControl isInvalid={errors.description}>
              <FormLabel
                htmlFor="description"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="10px"
              >
                Description<Text>*</Text>
              </FormLabel>
              <InputGroup>
                <Textarea
                  type="text"
                  placeholder="Enter Product Description"
                  {...register('description', { required: true })}
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
            onClick={handleSubmit(handleCreateCategory)}
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

export default CreateCategoryModal;
