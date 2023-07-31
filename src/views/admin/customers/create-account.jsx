// Chakra imports
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Select,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { useHistory } from 'react-router-dom';

// Custom components

// Assets
import Card from 'components/card/Card.js';
import { useForm } from 'react-hook-form';
import axiosService from 'utils/axiosService';
import { toast } from 'react-toastify';
import { toSentenceCase } from 'utils/helper';
import { useAppContext } from 'contexts/AppContext';
import BackButton from 'components/menu/BackButton';

export default function CreateAccount() {
  const history = useHistory();
  const { branches } = useAppContext();

  const brandStars = useColorModeValue('brand.500', 'brand.400');
  const textColor = useColorModeValue('navy.700', 'white');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const submitHandler = async (accountData) => {
    try {
      await axiosService.post(`/accounts`, accountData);
      toast.success('Account created successfully!');
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
            Create Customer
          </Text>
          <form onSubmit={handleSubmit(submitHandler)}>
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
            </Flex>
            <Flex flexDirection="row">
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
            </Flex>
            <Flex flexDirection="row">
              <Box width={{ base: '50%', md: '50%', sm: '100%' }} mt="20px">
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
                    {...register('branchName')}
                    name="branchName"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a branch
                    </option>
                    {branches &&
                      branches.map((branch) => (
                        <option key={branch.name} value={branch.name}>
                          {toSentenceCase(branch?.name)}
                        </option>
                      ))}
                  </Select>
                </FormControl>
              </Box>
            </Flex>
            <Box width={{ base: '50%', md: '50%', sm: '50%' }} mt="15px">
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
          </form>
        </Card>
      </Grid>
    </Box>
  );
}
