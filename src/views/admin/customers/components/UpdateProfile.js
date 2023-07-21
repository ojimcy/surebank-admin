// Chakra imports
import { Button, Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useAuth } from 'contexts/AuthContext';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axiosService from 'utils/axiosService';

export default function UpdateProfile() {
  const { currentUser, setCurrentUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const submitHandler = async (userData) => {
    const userId = currentUser.id;
    try {
      const response = await axiosService.patch('users/', {
        userId,
        userData,
      });

      toast.success('Profile updated successfully!');
      console.log(response);
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
            {...register('email')}
            placeholder="Email"
            defaultValue={currentUser.email}
          />
        </FormControl>

        <FormControl>
          <FormLabel pt={3}>First Name</FormLabel>
          <Input
            {...register('firstName')}
            placeholder="First Name"
            defaultValue={currentUser.firstName}
          />
        </FormControl>

        <FormControl>
          <FormLabel pt={3}>Last Name</FormLabel>
          <Input
            {...register('lastName')}
            placeholder="Last Name"
            defaultValue={currentUser.lastName}
          />
        </FormControl>

        <FormControl>
          <FormLabel pt={3}>Address</FormLabel>
          <Input
            {...register('address')}
            placeholder="Address"
            defaultValue={currentUser.address}
          />
        </FormControl>

        <FormControl mt={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            {...register('phoneNumber')}
            placeholder="Phone Number"
            defaultValue={currentUser.phoneNumber}
          />
        </FormControl>

        <Button
          fontSize="sm"
          colorScheme="green"
          fontWeight="500"
          w="100%"
          h="50"
          mb="24px"
          mt="20px"
          type="submit"
          isLoading={isSubmitting}
        >
          Update
        </Button>
      </form>
    </Flex>
  );
}
