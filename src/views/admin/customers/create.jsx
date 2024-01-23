// Chakra imports
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
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
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Custom components

// Assets
import Card from 'components/card/Card.js';
import { useForm } from 'react-hook-form';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { RiEyeCloseLine } from 'react-icons/ri';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { toSentenceCase } from 'utils/helper';
import BackButton from 'components/menu/BackButton';

export default function Customer() {
  const history = useHistory();
  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');
  const textColorSecondary = 'gray.400';

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const [show, setShow] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [branches, setBranches] = useState(null);

  const onCancel = () => {
    setIsCancelDialogOpen(true);
  };

  const onCloseCancelDialog = () => {
    setIsCancelDialogOpen(false);
  };

  const onConfirmCancel = () => {
    setIsCancelDialogOpen(false);
    history.push('/');
  };

  const handleClick = () => setShow(!show);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axiosService.get('/branch/');
        setBranches(response.data.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBranches();
  }, []);

  const submitHandler = async (customerData) => {
    // Remove email property if it's an empty string
    if (customerData.email === '') {
      delete customerData.email;
    }
    try {
      await axiosService.post(`/customer`, customerData);
      toast.success('Customer created successfully!');
      history.push('/admin/customers');
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
    <Box pt={{ base: '90px', md: '80px', xl: '80px' }}>
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
            Create Customer
          </Text>
          <form onSubmit={handleSubmit(submitHandler)}>
            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
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
                    Email
                  </FormLabel>
                  <Input
                    isRequired={false}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="email"
                    id="email"
                    placeholder="mail@surebank.com"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('email', {
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
            </Flex>
            <Flex
              gap="20px"
              marginBottom="20px"
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <Box width={{ base: '50%', md: '50%', sm: '100%' }}>
                <FormControl isInvalid={errors.accountType}>
                  <FormLabel
                    htmlFor="address"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Account Type<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Select
                    {...register('accountType')}
                    name="accountType"
                    defaultValue="Hq"
                  >
                    <option value="">Select account rype</option>
                    <option value="ds">DS</option>
                    <option value="sb">SB</option>
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
                    {branches &&
                      branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {toSentenceCase(branch?.name)}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Flex>

            <Flex
              gap="20px"
              marginTop="20px"
              flexDirection={{ base: 'row' }}
              justifyContent="center"
            >
              <Box width={{ base: '50%', md: '50%', sm: '50%' }}>
                <Button
                  colorScheme="red"
                  variant="solid"
                  fontWeight="500"
                  w="100%"
                  h="50"
                  mb="24px"
                  onClick={onCancel}
                >
                  Cancel
                </Button>
              </Box>
              <Box width={{ base: '50%', md: '50%', sm: '50%' }}>
                <Button
                  colorScheme="green"
                  variant="solid"
                  w="100%"
                  h="50"
                  mb="24px"
                  type="submit"
                  isLoading={isSubmitting}
                >
                  Save
                </Button>
              </Box>
            </Flex>
            <AlertDialog
              isOpen={isCancelDialogOpen}
              onClose={onCloseCancelDialog}
            >
              <AlertDialogOverlay />
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Cancel Confirmation
                </AlertDialogHeader>

                <AlertDialogBody>
                  Are you sure you want to cancel creating a new customer?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={onCloseCancelDialog}>No</Button>
                  <Button colorScheme="red" onClick={onConfirmCancel} ml={3}>
                    Yes
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </form>
        </Card>
      </Grid>
    </Box>
  );
}
