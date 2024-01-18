import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  FormErrorMessage,
  InputRightElement,
  Icon,
  InputGroup,
  useColorModeValue,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { RiEyeCloseLine } from 'react-icons/ri';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

const ResetPassword = () => {
  const history = useHistory();
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm();

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const onSubmit = async (data) => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        setError('confirmPassword', {
          type: 'manual',
          message: 'Passwords do not match',
        });
        return;
      }

      await axiosService.post('/users/reset-password', data);

      // Show a success message or redirect the user
      toast.success('Password changed successfully');
      history.push('/admin/');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error('Error changing password.');
      }
    }
  };

  return (
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
      <BackButton />
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl isInvalid={errors.password}>
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
            htmlFor="password"
          >
            Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Old password"
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
        <FormControl isInvalid={errors.newPassword}>
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
            htmlFor="newPassword"
          >
            New Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="New password"
              mb="24px"
              size="lg"
              type={show ? 'text' : 'password'}
              id="newPassword"
              variant="auth"
              {...register('newPassword', {
                required: 'New password is required',
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
            {errors.newPassword && errors.newPassword.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.confirmPassword}>
          <FormLabel
            ms="4px"
            fontSize="sm"
            fontWeight="500"
            color={textColor}
            display="flex"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </FormLabel>
          <InputGroup size="md">
            <Input
              isRequired={true}
              fontSize="sm"
              placeholder="Enter new password again"
              mb="24px"
              size="lg"
              type={show ? 'text' : 'password'}
              id="confirmPassword"
              variant="auth"
              {...register('confirmPassword', {
                required: 'Confirm password is required',
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
            {errors.confirmPassword && errors.confirmPassword.message}
          </FormErrorMessage>
        </FormControl>

        <Button
          colorScheme="green"
          variant="solid"
          w="100%"
          h="50"
          mb="24px"
          type="submit"
          isLoading={isSubmitting}
        >
          Change Password
        </Button>
      </form>
    </Box>
  );
};

export default ResetPassword;
