import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosService from 'utils/axiosService';
import { NavLink } from 'react-router-dom';

export default function UpdateProfile() {
  const { currentUser, setCurrentUser } = useAuth();
  const { handleSubmit } = useForm();

  const submitHandler = async (userData) => {
    const { email, firstName, lastName, address, phoneNumber } = userData;
    try {
      const response = await axiosService.patch('users/', {
        email,
        firstName,
        lastName,
        address,
        phoneNumber,
      });

      toast.success('Profile updated successfully!');
      setCurrentUser(response.data);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <Flex w="50%" mx="auto" mt="26px">
      <form className="update-form" onSubmit={handleSubmit(submitHandler)}>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input
            defaultValue={currentUser.email}
            readOnly
            bg="white"
            cursor="not-allowed"
          />
        </FormControl>

        <FormControl>
          <FormLabel pt={3}>First Name</FormLabel>
          <Input
            defaultValue={currentUser.firstName}
            readOnly
            bg="white"
            cursor="not-allowed"
          />
        </FormControl>

        <FormControl>
          <FormLabel pt={3}>Last Name</FormLabel>
          <Input
            defaultValue={currentUser.lastName}
            readOnly
            bg="white"
            cursor="not-allowed"
          />
        </FormControl>

        <FormControl>
          <FormLabel pt={3}>Address</FormLabel>
          <Input
            defaultValue={currentUser.address}
            readOnly
            bg="white"
            cursor="not-allowed"
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            defaultValue={currentUser.phoneNumber}
            readOnly
            bg="white"
            cursor="not-allowed"
          />
        </FormControl>

        {/* <Button
          fontSize="sm"
          colorScheme="green"
          fontWeight="500"
          w="100%"
          h="50"
          mb="10px"
          mt="20px"
          type="submit"
          isLoading={isSubmitting}
          _hover={{ bg: 'green.400' }}
        >
          Update
        </Button> */}

        <Flex justify="center" mt={5}>
          <NavLink to="/admin/profile/reset-password">Change password</NavLink>
        </Flex>
      </form>
    </Flex>
  );
}
