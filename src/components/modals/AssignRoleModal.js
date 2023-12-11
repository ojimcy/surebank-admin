import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Button,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

const AssignRoleModal = ({ isOpen, onClose, staffs, addRoleToStaff }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const roles = ['userReps', 'manager', 'admin', 'superAdmin'];
  const roleLabels = {
    userReps: 'Cashier',
    manager: 'Manager',
    admin: 'Admin',
    superAdmin: 'Super Admin',
  };

  const onSubmit = (data) => {
    addRoleToStaff(data);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Assign role to staff</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Flex
                gap="20px"
                marginBottom="20px"
                flexDirection={{ base: 'column', md: 'row' }}
              >
                <Box width={{ base: '100%', md: '100%', sm: '100%' }}>
                  <FormControl isInvalid={errors.branch}>
                    <FormLabel
                      htmlFor="address"
                      display="flex"
                      ms="4px"
                      fontSize="sm"
                      fontWeight="500"
                      mb="8px"
                    >
                      Staff<Text>*</Text>
                    </FormLabel>

                    <Select
                      {...register('userId')}
                      name="userId"
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select a staff
                      </option>
                      {staffs?.map((staff) => (
                        <option key={staff.id} value={staff.user.id}>
                          {staff.user.firstName} {staff.user.lastName} (
                          {staff.branchId.name})
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
                </Box>
              </Flex>

              <Spacer />
              <Button
                bgColor="blue.700"
                color="white"
                type="submit"
                isLoading={isSubmitting}
              >
                Save
              </Button>
            </form>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AssignRoleModal;
