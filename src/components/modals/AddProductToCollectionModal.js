import React from 'react';
import Select from 'react-select';
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
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const AddProductToCollectionModal = ({
  isOpen,
  onClose,
  collections,
  products,
  addToCollection,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleAddStaff = (data) => {
    addToCollection(data);
  };

  const productOptions =
    products &&
    products.map((product) => ({
      value: product.id,
      label: product.name,
    }));

  const collectionOptions =
    collections &&
    collections.map((collection) => ({
      value: collection.id,
      label: collection.title,
    }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Staff</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleAddStaff)}>
            <FormControl isInvalid={errors.productId}>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Products<Text>*</Text>
              </FormLabel>
              <Select
                {...register('productId')}
                name="productId"
                options={productOptions}
                isSearchable
                placeholder="Select Product"
              />
            </FormControl>
            <FormControl isInvalid={errors.collectionId}>
              <FormLabel
                htmlFor="collections"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="8px"
              >
                Collections<Text>*</Text>
              </FormLabel>
              <Select
                {...register('collectionId')}
                name="collectionId"
                options={collectionOptions}
                isSearchable
                placeholder="Select Collection"
              />
            </FormControl>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            bgColor="blue.700"
            color="white"
            type="submit"
            isLoading={isSubmitting}
            onClick={handleSubmit(handleAddStaff)}
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

export default AddProductToCollectionModal;
