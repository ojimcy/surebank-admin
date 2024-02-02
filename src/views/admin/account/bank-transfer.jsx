import React, { useEffect, useState } from 'react';

// Chakra imports
import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';

// Custom components

// Assets
import axiosService from 'utils/axiosService';
import BackButton from 'components/menu/BackButton';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAppContext } from 'contexts/AppContext';

export default function WithdrawalRequest() {
  const { customerData } = useAppContext();

  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();

  const [ownerName, setOwnerName] = useState('');

  useEffect(() => {
    // Fetch user information when the component mounts
    if (customerData.accountNumber) {
      fetchUserByAccountNumber(customerData.accountNumber);
    }

    // Set the initial value of accountNumber field
    setValue('accountNumber', customerData.accountNumber || '');
  }, [setValue, customerData.accountNumber]);

  const handleAccountNumberChange = async (e) => {
    const accountNumber = e.target.value.trim();
    if (accountNumber) {
      fetchUserByAccountNumber(accountNumber);
    }
  };

  const fetchUserByAccountNumber = async (accountNumber) => {
    try {
      const response = await axiosService.get(
        `/transactions/user/?accountNumber=${accountNumber}`
      );
      setOwnerName(`${response.data.firstName} ${response.data.lastName}`);
    } catch (error) {
      console.error(error);
      setOwnerName('Invalid account');
    }
  };

  const onSubmit = async (data) => {
    try {
      await axiosService.post('/transactions/withdraw/cash', data);
      toast.success('Withdrawal request sent successfully!');
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
      <BackButton />
      <Grid
        mb="20px"
        gridTemplateColumns={{ xl: 'repeat(3, 1fr)', '2xl': '1fr 0.46fr' }}
        gap={{ base: '20px', xl: '20px' }}
        display={{ base: 'block', xl: 'grid' }}
      >
        <Flex
          flexDirection="column"
          gridArea={{ xl: '1 / 1 / 2 / 3', '2xl': '1 / 1 / 2 / 2' }}
        >
          <Center py={6}>
            <Box
              w={{ base: '90%', md: '80%' }}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              boxShadow="base"
              p="30px"
            >
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={errors.accountNumber}>
                  <FormLabel
                    htmlFor="accountNumber"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    DS Account Number<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="accountNumber"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('accountNumber', {
                      required: 'Account number is required',
                    })}
                    onChange={handleAccountNumberChange}
                  />
                  <Text fontSize="sm" color="green" mb="5px" pb="10px">
                    {ownerName && ownerName}
                  </Text>
                  <FormErrorMessage>
                    {errors.accountNumber && errors.accountNumber.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.amount}>
                  <FormLabel
                    htmlFor="amount"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Amount<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="number"
                    id="amount"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('amount', {
                      required: 'Amount is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.amount && errors.amount.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.bankName}>
                  <FormLabel
                    htmlFor="bankName"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Bank Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="bankName"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('bankName', {
                      required: 'Bank name is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.bankName && errors.bankName.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.bankAccountNumber}>
                  <FormLabel
                    htmlFor="bankAccountNumber"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Bank Account Number<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="number"
                    id="bankAccountNumber"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('bankAccountNumber', {
                      required: 'Account number is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.bankAccountNumber && errors.bankAccountNumber.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={errors.accountName}>
                  <FormLabel
                    htmlFor="accountName"
                    display="flex"
                    ms="4px"
                    fontSize="sm"
                    fontWeight="500"
                    color={textColor}
                    mb="8px"
                  >
                    Bank Account Name<Text color={brandStars}>*</Text>
                  </FormLabel>
                  <Input
                    isRequired={true}
                    variant="auth"
                    fontSize="sm"
                    ms={{ base: '0px', md: '0px' }}
                    type="text"
                    id="accountName"
                    mb="24px"
                    fontWeight="500"
                    size="lg"
                    {...register('accountName', {
                      required: 'Account name is required',
                    })}
                  />
                  <FormErrorMessage>
                    {errors.accountName && errors.accountName.message}
                  </FormErrorMessage>
                </FormControl>
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
                    Request Cash
                  </Button>
                </Box>
              </form>
            </Box>
          </Center>
        </Flex>
      </Grid>
    </Box>
  );
}
