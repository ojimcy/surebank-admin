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
  Select,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const AddStaffModal = ({
  isOpen,
  onClose,
  users,
  allBranch,
  addStaffToBranch,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleAddStaff = (data) => {
    console.log(data);
    addStaffToBranch(data);
  };

  const roles = ['userReps', 'manager', 'admin', 'superAdmin'];
  const roleLabels = {
    userReps: 'Cashier',
    manager: 'Manager',
    admin: 'Admin',
    superAdmin: 'Super Admin',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create New Staff</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit(handleAddStaff)}>
            <FormControl>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
              >
                Users<Text>*</Text>
              </FormLabel>
              <Select {...register('staffId')} name="staffId" defaultValue="">
                <option value="" disabled>
                  Select User
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {`${user.firstName} ${user.lastName} - ${user.phoneNumber}`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="8px"
              >
                Branch<Text>*</Text>
              </FormLabel>
              <Select {...register('branchId')} name="branchId" defaultValue="">
                <option value="" disabled>
                  Select Branch
                </option>
                {allBranch.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isInvalid={errors.branch}>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                mb="8px"
                mt="8px"
              >
                Role<Text>*</Text>
              </FormLabel>

              <Select {...register('role')} name="role" defaultValue="">
                <option value="" disabled>
                  Select a Role
                </option>
                {roles &&
                  roles.map((role) => (
                    <option key={role} value={role}>
                      {roleLabels[role]}
                    </option>
                  ))}
              </Select>
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

export default AddStaffModal;
