import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Select,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const TransferStaffModal = ({
  isOpen,
  onClose,
  staffUser,
  allBranch,
  transferStaffToBranch,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    transferStaffToBranch(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Transfer staff</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <FormLabel pt={3}>
                {`${staffUser?.firstName} ${staffUser?.lastName}`}
              </FormLabel>
            </FormControl>
            <FormControl>
              <input
                type="hidden"
                {...register('staffId')}
                value={staffUser?.id}
              />
            </FormControl>
            <FormControl isInvalid={errors.branch}>
              <Select
                {...register('branchId', { required: true })}
                placeholder="Select a branch"
              >
                {allBranch.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <Flex justify="flex-end" marginTop={4}>
              <Button variant="ghost" marginRight={2} onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue">
                Save
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TransferStaffModal;
