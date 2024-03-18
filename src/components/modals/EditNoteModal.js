import React from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const EditNoteModal = ({ isOpen, onClose, selectedNote }) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting },
  } = useForm();

  const submitHandler = async () => {
    try {
      await axiosService.patch(`/note-keeping/${selectedNote.id}`);
      toast.success('Updated successfully!!!');
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while editing package.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit(submitHandler)}>
            <FormControl>
              <FormLabel>Amount</FormLabel>
              <Input
                type="text"
                defaultValue={selectedNote?.amount}
                {...register('amount', { required: true })}
                bg="transparent"
                color="secondaryGray.600"
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Note</FormLabel>
              <Textarea
                isRequired={true}
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                mb="24px"
                placeholder="Enter note"
                bg="transparent"
                color="secondaryGray.600"
                defaultValue={selectedNote?.note}
                {...register('note', { required: true })}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              variant="solid"
              w="100%"
              h="50"
              mb="24px"
              type="submit"
              isLoading={isSubmitting}
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default EditNoteModal;
