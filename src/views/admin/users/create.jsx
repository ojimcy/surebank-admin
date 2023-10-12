// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Custom components

// Assets
import Card from 'components/card/Card.js';
import { useForm } from 'react-hook-form';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import BackButton from 'components/menu/BackButton';
import { useAppContext } from 'contexts/AppContext';

export default function CreateCustomer() {
  const history = useHistory();
  const { branches } = useAppContext();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const submitHandler = async (userData) => {
    try {
      await axiosService.post(`/users`, userData);
      toast.success('User has been created successfully!');
      history.push('/admin/users');
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // Backend error with a specific error message
        const errorMessage = error.response.data.message;
        toast.error(errorMessage);
      } else {
        // Network error or other error
        toast.error('Something went wrong. Please try again later.');
      }
    }
  };

  return (
    <Box pt={{ base: '130px', md: '80px', xl: '80px' }}>
      {/* Main Fields */}
      <Grid
        templateColumns={{
          base: '1fr',
          lg: '3.96fr',
        }}
        templateRows={{
          base: 'repeat(1, 1fr)',
          lg: '1fr',
        }}
        gap={{ base: '20px', xl: '20px' }}
      >
        <Card p={{ base: '30px', md: '30px', sm: '10px' }}>
          <BackButton />
          <Text marginBottom="20px" fontSize="3xl" fontWeight="bold">
            Create User
          </Text>
          <form onSubmit={handleSubmit(submitHandler)}>
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
            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
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
              </Box>
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
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
                    <InputRightElement
                      display="flex"
                      alignItems="center"
                      mt="4px"
                    >
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
              </Box>
            </Flex>

            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
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
              </Box>

              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
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
              </Box>
            </Flex>
            <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
              <FormControl isInvalid={errors.branch}>
                <FormLabel
                  htmlFor="address"
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
                  {branches &&
                    branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                </Select>
              </FormControl>
            </Box>
            <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="25px">
              <Button
                colorScheme="green"
                variant="solid"
                w="100%"
                h="50"
                mb="24px"
                type="submit"
                isLoading={isSubmitting}
              >
                Create
              </Button>
            </Box>
          </form>
        </Card>
      </Grid>
    </Box>
  );
}
