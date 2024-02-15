import React, { useState } from 'react';
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';

const EditPackageModal = ({ isOpen, onClose, packageData, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [target, setTarget] = useState(packageData.target);
  const [amountPerDay, setAmountPerDay] = useState(packageData.amountPerDay);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await axiosService.patch(`/daily-savings/package/${packageData.id}`, {
        target,
        amountPerDay,
      });
      toast.success('Updated successfully!!!');
      onClose();
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred while editing package.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit DS Package</ModalHeader>
        <ModalBody>
          <FormControl>
            <FormLabel>Target</FormLabel>
            <Input
              type="text"
              defaultValue={target}
              onChange={(e) => setTarget(e.target.value)}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Amount per Day</FormLabel>
            <Input
              type="number"
              defaultValue={amountPerDay}
              onChange={(e) => setAmountPerDay(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Editing"
          >
            Save Changes
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditPackageModal;
