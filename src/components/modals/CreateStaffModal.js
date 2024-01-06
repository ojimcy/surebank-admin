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
  Select,
  Text,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  Flex,
  Box,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import { toSentenceCase } from 'utils/helper';

const AddStaffModal = ({ isOpen, onClose, allBranch, createStaff }) => {
  const [show, setShow] = useState(false);

  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClick = () => setShow(!show);

  const handleAddStaff = (data) => {
    createStaff(data);
  };

  const roles = ['userReps', 'manager', 'admin', 'superAdmin'];
  const roleLabels = {
    userReps: 'Sales Rep',
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
            <FormControl isInvalid={errors.phoneNumber}>
              <FormLabel
                htmlFor="phoneNumber"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Phone Number<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                id="phoneNumber"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('phoneNumber', {
                  required: 'Phone number is required',
                })}
              />
              <FormErrorMessage>
                {errors.phoneNumber && errors.phoneNumber.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.email}>
              <FormLabel
                htmlFor="email"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Email<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="email"
                id="email"
                placeholder="mail@sample.com"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Invalid email address',
                  },
                })}
              />
              <FormErrorMessage>
                {errors.email && errors.email.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.password}>
              <FormLabel
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                display="flex"
                htmlFor="password"
              >
                Password<Text color={brandStars}>*</Text>
              </FormLabel>
              <InputGroup size="md">
                <Input
                  isRequired={true}
                  fontSize="sm"
                  placeholder="Min. 8 characters"
                  mb="24px"
                  size="lg"
                  type={show ? 'text' : 'password'}
                  id="password"
                  variant="auth"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Minimum length should be 8',
                    },
                  })}
                />
                <InputRightElement display="flex" alignItems="center" mt="4px">
                  <Icon
                    color={textColorSecondary}
                    _hover={{ cursor: 'pointer' }}
                    as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                    onClick={handleClick}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>

            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl isInvalid={errors.firstName}>
                  <FormLabel
                    htmlFor="firstName"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    First Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="firstName"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('firstName', {
                      required: 'Firsname is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.firstName && errors.firstName.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl isInvalid={errors.lastName}>
                  <FormLabel
                    htmlFor="lastName"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Last Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="lastName"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('lastName', {
                      required: 'Firsname is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.lastName && errors.lastName.message}
                  </FormErrorMessage>
                </FormControl>
              </Box>
            </Flex>
            <FormControl isInvalid={errors.address}>
              <FormLabel
                htmlFor="address"
                display="flex"
                ms="4px"
                fontSize="sm"
                fontWeight="500"
                color={textColor}
                mb="8px"
              >
                Address<Text color={brandStars}>*</Text>
              </FormLabel>
              <Input
                isRequired={true}
                variant="auth"
                fontSize="sm"
                ms={{ base: '0px', md: '0px' }}
                type="text"
                id="address"
                mb="24px"
                fontWeight="500"
                size="lg"
                {...register('address', {
                  required: 'Address is required',
                })}
              />
              <FormErrorMessage>
                {errors.address && errors.address.message}
              </FormErrorMessage>
            </FormControl>

            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl isInvalid={errors.role}>
                  <FormLabel
                    htmlFor="role"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Role<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select {...register('role')} name="role" defaultValue="">
                    <option value="" disabled>
                      Select a Role
                    </option>
                    {roles &&
                      roles?.map((role) => (
                        <option key={role} value={role}>
                          {roleLabels[role]}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </Box>
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl isInvalid={errors.branch}>
                  <FormLabel
                    htmlFor="branch"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Branch<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select
                    {...register('branchId')}
                    name="branchId"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a branch
                    </option>
                    {allBranch &&
                      allBranch.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {toSentenceCase(branch?.name)}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Flex>
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
