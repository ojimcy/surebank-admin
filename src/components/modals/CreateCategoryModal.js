import React, { useState } from 'react';
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
  Select, // Import Select from Chakra UI
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const CreateCategoryModal = ({
  isOpen,
  onClose,
  createCategory,
  parentCategories,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [showParentCategoryField, setShowParentCategoryField] = useState(false);
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);

  const handleCreateCategory = (data) => {
    // Include selectedParentCategory in the data
    createCategory({ ...data, parentCategoryId: selectedParentCategory });
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

            <Button
              mt={4}
              variant="link"
              color="blue.500"
              onClick={() =>
                setShowParentCategoryField(!showParentCategoryField)
              }
            >
              {showParentCategoryField ? 'Hide' : 'Show'} Parent Category
            </Button>

            {showParentCategoryField && (
              <FormControl mt={4}>
                <FormLabel
                  htmlFor="parentCategory"
                  display="flex"
                  ms="4px"
                  fontSize="sm"
                  fontWeight="500"
                  mb="8px"
                >
                  Parent Category
                </FormLabel>
                <Select
                  placeholder="Select a parent category"
                  {...register('parentCategoryId')}
                  onChange={(e) => setSelectedParentCategory(e.target.value)}
                >
                  {parentCategories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
            )}
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
